import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { getIceServers, createPeerConnection, logWebRTCStats } from '../utils/webrtc';
import {
  sendWebRTCP2P,
  sendWebRTCResume,
  uploadToS3AndShareLink,
  getTransferStrategy,
  TransferProgress,
  TransferResult,
} from '../utils/fileTransfer';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string ?? 'http://localhost:4000';

export interface ReceivedFile {
  filename: string;
  mimeType: string;
  url: string;
  size: number;
  receivedAt: number;
}

interface IncomingTransfer {
  filename: string;
  mimeType: string;
  fileSize: number;
  chunks: ArrayBuffer[];
  receivedBytes: number;
  chunkMap?: Map<number, ArrayBuffer>;
  totalChunks?: number;
  isResumable?: boolean;
}

export interface WebRTCState {
  connected: boolean;
  peers: string[];
  transfers: Map<string, TransferProgress>;
  receivedFiles: ReceivedFile[];
  error: string | null;
}

export function useWebRTC(roomId: string) {
  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<Map<string, RTCDataChannel>>(new Map());
  const incomingRef = useRef<Map<string, IncomingTransfer>>(new Map());

  const [state, setState] = useState<WebRTCState>({
    connected: false,
    peers: [],
    transfers: new Map(),
    receivedFiles: [],
    error: null,
  });

  const setError = (error: string | null) =>
    setState((s) => ({ ...s, error }));

  const setConnected = (connected: boolean) =>
    setState((s) => ({ ...s, connected }));

  const addPeer = (peerId: string) =>
    setState((s) => ({ ...s, peers: [...s.peers, peerId] }));

  const removePeer = (peerId: string) =>
    setState((s) => ({ ...s, peers: s.peers.filter((p) => p !== peerId) }));

  const updateTransfer = (filename: string, progress: TransferProgress) =>
    setState((s) => {
      const transfers = new Map(s.transfers);
      transfers.set(filename, progress);
      return { ...s, transfers };
    });

  const addReceivedFile = (file: ReceivedFile) =>
    setState((s) => ({ ...s, receivedFiles: [...s.receivedFiles, file] }));

  const setupDataChannelListeners = useCallback(
    (channel: RTCDataChannel, peerId: string) => {
      let currentTransfer: IncomingTransfer | null = null;

      channel.onmessage = (ev) => {
        const data = ev.data;

        if (typeof data === 'string') {
          let msg: Record<string, unknown>;
          try {
            msg = JSON.parse(data) as Record<string, unknown>;
          } catch {
            return;
          }

          if (msg.type === 'file-meta') {
            currentTransfer = {
              filename: msg.filename as string,
              mimeType: (msg.mimeType as string) || 'application/octet-stream',
              fileSize: msg.fileSize as number,
              chunks: [],
              receivedBytes: 0,
            };
            incomingRef.current.set(peerId, currentTransfer);
          } else if (msg.type === 'file-meta-resume') {
            currentTransfer = {
              filename: msg.filename as string,
              mimeType: (msg.mimeType as string) || 'application/octet-stream',
              fileSize: msg.fileSize as number,
              chunks: [],
              receivedBytes: 0,
              chunkMap: new Map(),
              totalChunks: msg.totalChunks as number,
              isResumable: true,
            };
            incomingRef.current.set(peerId, currentTransfer);
          } else if (msg.type === 'file-end') {
            const transfer = incomingRef.current.get(peerId);
            if (!transfer) return;

            let blob: Blob;
            if (transfer.isResumable && transfer.chunkMap) {
              const sorted = [...transfer.chunkMap.entries()]
                .sort(([a], [b]) => a - b)
                .map(([, buf]) => buf);
              blob = new Blob(sorted, { type: transfer.mimeType });
            } else {
              blob = new Blob(transfer.chunks, { type: transfer.mimeType });
            }

            const url = URL.createObjectURL(blob);
            addReceivedFile({
              filename: transfer.filename,
              mimeType: transfer.mimeType,
              url,
              size: transfer.fileSize,
              receivedAt: Date.now(),
            });
            incomingRef.current.delete(peerId);
            currentTransfer = null;
          }
        } else if (data instanceof ArrayBuffer) {
          const transfer = incomingRef.current.get(peerId);
          if (!transfer) return;

          if (transfer.isResumable && transfer.chunkMap) {
            const view = new DataView(data);
            const chunkIndex = view.getUint32(0, true);
            const chunkData = data.slice(4);
            transfer.chunkMap.set(chunkIndex, chunkData);
            transfer.receivedBytes += chunkData.byteLength;
          } else {
            transfer.chunks.push(data);
            transfer.receivedBytes += data.byteLength;
          }

          updateTransfer(transfer.filename, {
            filename: transfer.filename,
            totalBytes: transfer.fileSize,
            transferredBytes: transfer.receivedBytes,
            percentage: Math.round((transfer.receivedBytes / transfer.fileSize) * 100),
            speedBytesPerSec: 0,
            remainingSeconds: 0,
          });
        }
      };

      channel.onerror = (err) => {
        console.error(`[webrtc] DataChannel error from ${peerId}`, err);
      };
    },
    [],
  );

  const createOffer = useCallback(
    async (pc: RTCPeerConnection, socket: Socket, targetPeerId: string) => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { roomId, to: targetPeerId, signal: offer });
    },
    [roomId],
  );

  const initPeerConnection = useCallback(
    async (peerId: string, socket: Socket, isInitiator: boolean) => {
      const iceServers = await getIceServers();
      const pc = createPeerConnection(iceServers);
      pcRef.current.set(peerId, pc);

      pc.onicecandidate = (ev) => {
        if (ev.candidate) {
          socket.emit('ice-candidate', {
            roomId,
            to: peerId,
            candidate: ev.candidate.toJSON(),
          });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log(`[webrtc] Connection to ${peerId}: ${pc.connectionState}`);
        if (pc.connectionState === 'connected') {
          void logWebRTCStats(pc);
        }
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          removePeer(peerId);
          pcRef.current.delete(peerId);
          channelRef.current.delete(peerId);
        }
      };

      pc.ondatachannel = (ev) => {
        const channel = ev.channel;
        channelRef.current.set(peerId, channel);
        setupDataChannelListeners(channel, peerId);
      };

      if (isInitiator) {
        const channel = pc.createDataChannel('filetransfer', {
          ordered: false,
          maxRetransmits: 3,
        });
        channelRef.current.set(peerId, channel);
        setupDataChannelListeners(channel, peerId);
        await createOffer(pc, socket, peerId);
      }

      return pc;
    },
    [roomId, setupDataChannelListeners, createOffer],
  );

  useEffect(() => {
    if (!roomId) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError(null);
      socket.emit('join-room', { roomId });
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => setError(err.message));

    socket.on('room-peers', ({ peers }: { peers: string[] }) => {
      setState((s) => ({ ...s, peers }));
      peers.forEach((peerId) => {
        void initPeerConnection(peerId, socket, true);
      });
    });

    socket.on('peer-joined', ({ peerId }: { peerId: string }) => {
      addPeer(peerId);
      void initPeerConnection(peerId, socket, false);
    });

    socket.on('peer-left', ({ peerId }: { peerId: string }) => {
      removePeer(peerId);
      const pc = pcRef.current.get(peerId);
      if (pc) { pc.close(); pcRef.current.delete(peerId); }
      channelRef.current.delete(peerId);
    });

    socket.on('offer', async ({ from, signal }: { from: string; signal: RTCSessionDescriptionInit }) => {
      let pc = pcRef.current.get(from);
      if (!pc) {
        pc = await initPeerConnection(from, socket, false);
      }
      await pc.setRemoteDescription(new RTCSessionDescription(signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { roomId, to: from, signal: answer });
    });

    socket.on('answer', async ({ from, signal }: { from: string; signal: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current.get(from);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(signal));
    });

    socket.on('ice-candidate', async ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
      const pc = pcRef.current.get(from);
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn('[webrtc] Failed to add ICE candidate', err);
        }
      }
    });

    return () => {
      socket.disconnect();
      pcRef.current.forEach((pc) => pc.close());
      pcRef.current.clear();
      channelRef.current.clear();
      socketRef.current = null;
    };
  }, [roomId, initPeerConnection]);

  const sendFile = useCallback(
    async (file: File, onProgress: (p: TransferProgress) => void): Promise<TransferResult> => {
      const strategy = getTransferStrategy(file.size);

      if (strategy === 's3') {
        return uploadToS3AndShareLink(file, onProgress);
      }

      const channels = [...channelRef.current.values()].filter(
        (ch) => ch.readyState === 'open',
      );

      if (channels.length === 0) {
        return { success: false, error: 'No connected peers' };
      }

      const results: TransferResult[] = [];
      for (const channel of channels) {
        let result: TransferResult;
        if (strategy === 'p2p') {
          result = await sendWebRTCP2P(channel, file, onProgress);
        } else {
          result = await sendWebRTCResume(channel, file, onProgress);
        }
        results.push(result);
      }

      const failed = results.filter((r) => !r.success);
      if (failed.length > 0) {
        return { success: false, error: failed[0].error };
      }
      return { success: true };
    },
    [],
  );

  return { state, sendFile };
}
