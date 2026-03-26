import { useCallback, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWebRTC, ReceivedFile } from '../hooks/useWebRTC';
import { formatBytes, formatSpeed, getTransferStrategy, TransferProgress } from '../utils/fileTransfer';

export default function FileShare() {
  const { id: roomId = '' } = useParams<{ id: string }>();
  const { state, sendFile } = useWebRTC(roomId);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTransfers, setActiveTransfers] = useState<Map<string, TransferProgress>>(new Map());
  const [completedTransfers, setCompletedTransfers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        setErrors([]);
        const result = await sendFile(file, (progress) => {
          setActiveTransfers((prev) => new Map(prev).set(file.name, progress));
        });

        if (result.success) {
          setActiveTransfers((prev) => {
            const next = new Map(prev);
            next.delete(file.name);
            return next;
          });
          setCompletedTransfers((prev) => [...prev, file.name]);
        } else {
          setErrors((prev) => [...prev, `${file.name}: ${result.error ?? 'Unknown error'}`]);
          setActiveTransfers((prev) => {
            const next = new Map(prev);
            next.delete(file.name);
            return next;
          });
        }
      }
    },
    [sendFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        void handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        void handleFiles(e.target.files);
        e.target.value = '';
      }
    },
    [handleFiles],
  );

  const copyRoomLink = () => {
    void navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="font-semibold text-white">File Share</h1>
            <p className="text-xs text-slate-500">Room: {roomId}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${state.connected ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`}
            />
            <span className="text-sm text-slate-400">
              {state.connected ? `${state.peers.length + 1} peer${state.peers.length !== 0 ? 's' : ''}` : 'Connecting…'}
            </span>
          </div>

          <button className="btn-secondary text-sm" onClick={copyRoomLink}>
            Copy Link
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-0">
        {/* Left: Upload area */}
        <div className="flex-1 flex flex-col p-6 gap-6">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors ${
              isDragging
                ? 'border-primary-400 bg-primary-900/10'
                : 'border-slate-700 hover:border-slate-500'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Drop files here</p>
              <p className="text-sm text-slate-500 mt-1">or click to browse</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {['< 100 MB → P2P', '< 2 GB → Resumable', '≥ 2 GB → S3'].map((label) => (
                <span key={label} className="text-xs px-2 py-1 bg-slate-800 rounded-full text-slate-400">
                  {label}
                </span>
              ))}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={onFileInput}
          />

          {/* Errors */}
          {errors.map((err, i) => (
            <div key={i} className="bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm">
              {err}
            </div>
          ))}

          {/* Active transfers */}
          {activeTransfers.size > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Sending</h3>
              {[...activeTransfers.values()].map((t) => (
                <TransferCard key={t.filename} transfer={t} />
              ))}
            </div>
          )}

          {/* Completed */}
          {completedTransfers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Sent</h3>
              {completedTransfers.map((name) => (
                <div key={name} className="flex items-center gap-3 bg-emerald-900/10 border border-emerald-900/50 rounded-lg px-4 py-2">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-slate-300 truncate">{name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Received files */}
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 p-6">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
            Received Files ({state.receivedFiles.length})
          </h2>

          {state.receivedFiles.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No files received yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {state.receivedFiles.map((file, i) => (
                <ReceivedFileCard key={i} file={file} />
              ))}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

function TransferCard({ transfer }: { transfer: TransferProgress }) {
  const strategy = getTransferStrategy(transfer.totalBytes);

  return (
    <div className="card gap-3 flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-white font-medium truncate">{transfer.filename}</span>
        <span className="text-xs text-slate-500 flex-shrink-0">{transfer.percentage}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${transfer.percentage}%` }} />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{formatBytes(transfer.transferredBytes)} / {formatBytes(transfer.totalBytes)}</span>
        <span className="flex items-center gap-2">
          {transfer.speedBytesPerSec > 0 && <span>{formatSpeed(transfer.speedBytesPerSec)}</span>}
          <span className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-400 uppercase">{strategy}</span>
        </span>
      </div>
    </div>
  );
}

function ReceivedFileCard({ file }: { file: ReceivedFile }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{file.filename}</p>
        <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
      </div>
      <a
        href={file.url}
        download={file.filename}
        className="btn-secondary text-xs px-3 py-1.5"
        onClick={() => {
          if ('vibrate' in navigator) navigator.vibrate(50);
        }}
      >
        Save
      </a>
    </div>
  );
}
