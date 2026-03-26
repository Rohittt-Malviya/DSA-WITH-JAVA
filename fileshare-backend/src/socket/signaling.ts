import { Server, Socket } from 'socket.io';
import {
  addPeerToRoom,
  removePeerFromRoom,
  getRoomPeers,
  findRoomBySocketId,
} from '../utils/rooms';

interface JoinRoomPayload {
  roomId: string;
}

interface SignalPayload {
  roomId: string;
  to: string;
  signal: unknown;
}

interface IceCandidatePayload {
  roomId: string;
  to: string;
  candidate: {
    candidate: string;
    sdpMLineIndex?: number | null;
    sdpMid?: string | null;
    usernameFragment?: string | null;
  };
}

export function registerSignalingHandlers(io: Server, socket: Socket): void {
  socket.on('join-room', ({ roomId }: JoinRoomPayload) => {
    if (!roomId || typeof roomId !== 'string') return;

    const sanitizedRoomId = roomId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    if (!sanitizedRoomId) return;

    socket.join(sanitizedRoomId);
    addPeerToRoom(sanitizedRoomId, socket.id);

    const peers = getRoomPeers(sanitizedRoomId).filter((id) => id !== socket.id);
    socket.emit('room-peers', { peers });

    socket.to(sanitizedRoomId).emit('peer-joined', { peerId: socket.id });

    console.log(`[signaling] ${socket.id} joined room ${sanitizedRoomId}. Peers: ${peers.length + 1}`);
  });

  socket.on('offer', ({ roomId, to, signal }: SignalPayload) => {
    if (!roomId || !to || !signal) return;
    const sanitizedRoomId = roomId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    io.to(to).emit('offer', { from: socket.id, signal, roomId: sanitizedRoomId });
  });

  socket.on('answer', ({ roomId, to, signal }: SignalPayload) => {
    if (!roomId || !to || !signal) return;
    const sanitizedRoomId = roomId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    io.to(to).emit('answer', { from: socket.id, signal, roomId: sanitizedRoomId });
  });

  socket.on('ice-candidate', ({ roomId, to, candidate }: IceCandidatePayload) => {
    if (!roomId || !to || !candidate) return;
    const sanitizedRoomId = roomId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    io.to(to).emit('ice-candidate', { from: socket.id, candidate, roomId: sanitizedRoomId });
  });

  socket.on('disconnect', () => {
    const roomId = findRoomBySocketId(socket.id);
    if (roomId) {
      removePeerFromRoom(roomId, socket.id);
      socket.to(roomId).emit('peer-left', { peerId: socket.id });
      console.log(`[signaling] ${socket.id} disconnected from room ${roomId}`);
    }
  });
}
