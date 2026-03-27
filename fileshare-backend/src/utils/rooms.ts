import { config } from '../config/env';

interface RoomPeer {
  socketId: string;
  joinedAt: number;
}

interface Room {
  id: string;
  peers: RoomPeer[];
  lastActivity: number;
  cleanupTimer: ReturnType<typeof setTimeout> | null;
}

const rooms = new Map<string, Room>();

function scheduleCleanup(roomId: string): void {
  const room = rooms.get(roomId);
  if (!room) return;

  if (room.cleanupTimer !== null) {
    clearTimeout(room.cleanupTimer);
  }

  room.cleanupTimer = setTimeout(() => {
    rooms.delete(roomId);
    console.log(`[rooms] Room ${roomId} cleaned up after idle timeout`);
  }, config.roomTimeoutMs);
}

export function getOrCreateRoom(roomId: string): Room {
  let room = rooms.get(roomId);
  if (!room) {
    room = {
      id: roomId,
      peers: [],
      lastActivity: Date.now(),
      cleanupTimer: null,
    };
    rooms.set(roomId, room);
  }
  scheduleCleanup(roomId);
  return room;
}

export function addPeerToRoom(roomId: string, socketId: string): Room {
  const room = getOrCreateRoom(roomId);
  if (!room.peers.find((p) => p.socketId === socketId)) {
    room.peers.push({ socketId, joinedAt: Date.now() });
  }
  room.lastActivity = Date.now();
  scheduleCleanup(roomId);
  return room;
}

export function removePeerFromRoom(roomId: string, socketId: string): Room | null {
  const room = rooms.get(roomId);
  if (!room) return null;

  room.peers = room.peers.filter((p) => p.socketId !== socketId);
  room.lastActivity = Date.now();

  if (room.peers.length === 0) {
    if (room.cleanupTimer !== null) {
      clearTimeout(room.cleanupTimer);
    }
    rooms.delete(roomId);
    console.log(`[rooms] Room ${roomId} removed (no peers left)`);
    return null;
  }

  scheduleCleanup(roomId);
  return room;
}

export function getRoomPeers(roomId: string): string[] {
  const room = rooms.get(roomId);
  if (!room) return [];
  return room.peers.map((p) => p.socketId);
}

export function findRoomBySocketId(socketId: string): string | null {
  for (const [roomId, room] of rooms.entries()) {
    if (room.peers.find((p) => p.socketId === socketId)) {
      return roomId;
    }
  }
  return null;
}
