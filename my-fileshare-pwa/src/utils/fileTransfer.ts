const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string ?? 'http://localhost:4000';

export const CHUNK_SIZE = 16 * 1024; // 16 KB
export const P2P_MAX_BYTES = 100 * 1024 * 1024; // 100 MB
export const RESUME_MAX_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB

export interface TransferProgress {
  filename: string;
  totalBytes: number;
  transferredBytes: number;
  percentage: number;
  speedBytesPerSec: number;
  remainingSeconds: number;
}

export interface TransferResult {
  success: boolean;
  url?: string;
  error?: string;
}

type ProgressCallback = (progress: TransferProgress) => void;

// ─────────────────────────────────────────────────────────────────────────────
// sendWebRTCP2P — direct DataChannel transfer for files < 100 MB
// ─────────────────────────────────────────────────────────────────────────────
export async function sendWebRTCP2P(
  channel: RTCDataChannel,
  file: File,
  onProgress: ProgressCallback,
): Promise<TransferResult> {
  return new Promise((resolve) => {
    const totalBytes = file.size;
    let transferredBytes = 0;
    const startTime = Date.now();

    // Send metadata header first
    const meta = JSON.stringify({
      type: 'file-meta',
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
    channel.send(meta);

    const reader = new FileReader();
    let offset = 0;

    const sendNextChunk = () => {
      if (offset >= file.size) {
        channel.send(JSON.stringify({ type: 'file-end', filename: file.name }));
        resolve({ success: true });
        return;
      }

      // Backpressure: wait if buffer is filling up
      if (channel.bufferedAmount > CHUNK_SIZE * 8) {
        setTimeout(sendNextChunk, 50);
        return;
      }

      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve({ success: false, error: 'FileReader failed' });
        return;
      }
      try {
        channel.send(e.target.result as ArrayBuffer);
        offset += CHUNK_SIZE;
        transferredBytes = Math.min(offset, totalBytes);

        const elapsed = (Date.now() - startTime) / 1000;
        const speed = elapsed > 0 ? transferredBytes / elapsed : 0;
        const remaining = speed > 0 ? (totalBytes - transferredBytes) / speed : 0;

        onProgress({
          filename: file.name,
          totalBytes,
          transferredBytes,
          percentage: Math.round((transferredBytes / totalBytes) * 100),
          speedBytesPerSec: speed,
          remainingSeconds: remaining,
        });

        sendNextChunk();
      } catch (err) {
        resolve({ success: false, error: String(err) });
      }
    };

    reader.onerror = () => resolve({ success: false, error: 'FileReader error' });

    sendNextChunk();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// sendWebRTCResume — resumable transfer for files 100 MB – 2 GB
// ─────────────────────────────────────────────────────────────────────────────
export async function sendWebRTCResume(
  channel: RTCDataChannel,
  file: File,
  onProgress: ProgressCallback,
  startChunkIndex = 0,
): Promise<TransferResult> {
  return new Promise((resolve) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let currentChunk = startChunkIndex;
    const startTime = Date.now();

    const meta = JSON.stringify({
      type: 'file-meta-resume',
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      totalChunks,
      startChunkIndex,
    });
    channel.send(meta);

    const reader = new FileReader();

    const sendChunk = () => {
      if (currentChunk >= totalChunks) {
        channel.send(
          JSON.stringify({ type: 'file-end', filename: file.name, totalChunks }),
        );
        resolve({ success: true });
        return;
      }

      if (channel.bufferedAmount > CHUNK_SIZE * 16) {
        setTimeout(sendChunk, 50);
        return;
      }

      const offset = currentChunk * CHUNK_SIZE;
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      if (!e.target?.result) {
        resolve({ success: false, error: 'FileReader failed' });
        return;
      }
      try {
        // Prepend chunkIndex as a 4-byte header so receiver can reorder
        const chunkData = e.target.result as ArrayBuffer;
        const header = new Uint32Array([currentChunk]);
        const packet = new Uint8Array(4 + chunkData.byteLength);
        packet.set(new Uint8Array(header.buffer), 0);
        packet.set(new Uint8Array(chunkData), 4);
        channel.send(packet.buffer);

        currentChunk++;
        const transferred = Math.min(currentChunk * CHUNK_SIZE, file.size);
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = elapsed > 0 ? (transferred - startChunkIndex * CHUNK_SIZE) / elapsed : 0;
        const remaining = speed > 0 ? (file.size - transferred) / speed : 0;

        onProgress({
          filename: file.name,
          totalBytes: file.size,
          transferredBytes: transferred,
          percentage: Math.round((transferred / file.size) * 100),
          speedBytesPerSec: speed,
          remainingSeconds: remaining,
        });

        sendChunk();
      } catch (err) {
        resolve({ success: false, error: String(err) });
      }
    };

    reader.onerror = () => resolve({ success: false, error: 'FileReader error' });

    sendChunk();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// uploadToS3AndShareLink — for files > 2 GB via presigned URL
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadToS3AndShareLink(
  file: File,
  onProgress: ProgressCallback,
): Promise<TransferResult> {
  try {
    // 1. Request presigned URL from our backend
    const presignRes = await fetch(`${SOCKET_URL}/api/s3/presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        fileSize: file.size,
      }),
    });

    if (!presignRes.ok) {
      const body = (await presignRes.json()) as { error?: string };
      return { success: false, error: body.error ?? 'Failed to get presigned URL' };
    }

    const { url, publicUrl } = (await presignRes.json()) as {
      url: string;
      publicUrl: string;
    };

    // 2. Upload directly to S3 using XHR for progress
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const startTime = Date.now();

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = elapsed > 0 ? ev.loaded / elapsed : 0;
          onProgress({
            filename: file.name,
            totalBytes: ev.total,
            transferredBytes: ev.loaded,
            percentage: Math.round((ev.loaded / ev.total) * 100),
            speedBytesPerSec: speed,
            remainingSeconds: speed > 0 ? (ev.total - ev.loaded) / speed : 0,
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`S3 upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during S3 upload'));
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.send(file);
    });

    return { success: true, url: publicUrl };
  } catch (err) {
    // Queue for background sync if offline
    if (!navigator.onLine) {
      await queueBackgroundUpload(file);
      return { success: false, error: 'Queued for background sync (offline)' };
    }
    return { success: false, error: String(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Background sync queue via IndexedDB
// ─────────────────────────────────────────────────────────────────────────────
async function queueBackgroundUpload(file: File): Promise<void> {
  const db = await openSyncDB();
  const tx = db.transaction('upload-queue', 'readwrite');
  const store = tx.objectStore('upload-queue');
  const buffer = await file.arrayBuffer();
  store.add({
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    data: buffer,
    queuedAt: Date.now(),
  });
  await new Promise<void>((res, rej) => {
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();

  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const reg = await navigator.serviceWorker.ready;
    // @ts-expect-error SyncManager not in all TS lib versions
    await reg.sync.register('upload-queue');
  }
}

function openSyncDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('fileshare-sync', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('upload-queue')) {
        db.createObjectStore('upload-queue', { autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatSpeed(bytesPerSec: number): string {
  return `${formatBytes(bytesPerSec)}/s`;
}

export function getTransferStrategy(fileSize: number): 'p2p' | 'resume' | 's3' {
  if (fileSize < P2P_MAX_BYTES) return 'p2p';
  if (fileSize < RESUME_MAX_BYTES) return 'resume';
  return 's3';
}
