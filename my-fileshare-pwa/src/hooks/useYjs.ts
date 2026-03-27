import { useEffect, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { io, Socket } from 'socket.io-client';
import type * as Monaco from 'monaco-editor';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string ?? 'http://localhost:4000';

export interface Participant {
  id: string;
  color: string;
  isTyping: boolean;
  joinedAt: number;
}

const PARTICIPANT_COLORS = [
  '#f59e0b', '#10b981', '#3b82f6', '#ec4899',
  '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16',
];

function pickColor(index: number): string {
  return PARTICIPANT_COLORS[index % PARTICIPANT_COLORS.length];
}

export function useYjs(roomId: string) {
  const docRef = useRef<Y.Doc>(new Y.Doc());
  const socketRef = useRef<Socket | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [connected, setConnected] = useState(false);
  const [language, setLanguageState] = useState('typescript');

  const updateParticipant = useCallback((id: string, update: Partial<Participant>) => {
    setParticipants((prev) => {
      const next = new Map(prev);
      const existing = next.get(id);
      if (existing) {
        next.set(id, { ...existing, ...update });
      } else {
        next.set(id, {
          id,
          color: pickColor(next.size),
          isTyping: false,
          joinedAt: Date.now(),
          ...update,
        });
      }
      return next;
    });
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const doc = docRef.current;
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', { roomId });
    });

    socket.on('disconnect', () => setConnected(false));

    // Yjs awareness — broadcast document updates to peers
    socket.on('yjs-update', ({ update }: { update: number[] }) => {
      Y.applyUpdate(doc, new Uint8Array(update));
    });

    socket.on('yjs-sync-request', ({ from }: { from: string }) => {
      const state = Y.encodeStateAsUpdate(doc);
      socket.emit('yjs-sync-response', {
        roomId,
        to: from,
        update: Array.from(state),
      });
    });

    socket.on('yjs-sync-response', ({ update }: { update: number[] }) => {
      Y.applyUpdate(doc, new Uint8Array(update));
    });

    socket.on('peer-joined', ({ peerId }: { peerId: string }) => {
      updateParticipant(peerId, { id: peerId });
      // Send our current doc state to the new peer
      const state = Y.encodeStateAsUpdate(doc);
      socket.emit('yjs-sync-response', {
        roomId,
        to: peerId,
        update: Array.from(state),
      });
    });

    socket.on('peer-left', ({ peerId }: { peerId: string }) => {
      removeParticipant(peerId);
    });

    socket.on('room-peers', ({ peers }: { peers: string[] }) => {
      peers.forEach((id, index) => {
        updateParticipant(id, { id, color: pickColor(index) });
      });
      // Request sync from first peer
      if (peers.length > 0) {
        socket.emit('yjs-sync-request', { roomId, from: socket.id });
      }
    });

    socket.on('typing-status', ({ peerId, isTyping }: { peerId: string; isTyping: boolean }) => {
      updateParticipant(peerId, { isTyping });
    });

    socket.on('language-change', ({ language: lang }: { language: string }) => {
      setLanguageState(lang);
    });

    // Broadcast local Yjs updates
    const handleDocUpdate = (update: Uint8Array) => {
      socket.emit('yjs-update', { roomId, update: Array.from(update) });
    };
    doc.on('update', handleDocUpdate);

    return () => {
      doc.off('update', handleDocUpdate);
      socket.disconnect();
      socketRef.current = null;
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
    };
  }, [roomId, updateParticipant, removeParticipant]);

  const bindEditor = useCallback(
    (editor: Monaco.editor.IStandaloneCodeEditor, _monacoInstance: typeof Monaco) => {
      const doc = docRef.current;
      const yText = doc.getText('content');

      if (bindingRef.current) {
        bindingRef.current.destroy();
      }

      const monacoModel = editor.getModel();
      if (!monacoModel) return;

      bindingRef.current = new MonacoBinding(
        yText,
        monacoModel,
        new Set([editor]),
        null,
      );

      // Track typing status
      editor.onDidChangeModelContent(() => {
        const socket = socketRef.current;
        if (!socket) return;

        socket.emit('typing-status', { roomId, isTyping: true });

        if (typingTimerRef.current !== null) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
          socket.emit('typing-status', { roomId, isTyping: false });
        }, 1500);
      });

      void _monacoInstance;
    },
    [roomId],
  );

  const changeLanguage = useCallback(
    (lang: string) => {
      setLanguageState(lang);
      socketRef.current?.emit('language-change', { roomId, language: lang });
    },
    [roomId],
  );

  return { participants, connected, language, changeLanguage, bindEditor };
}
