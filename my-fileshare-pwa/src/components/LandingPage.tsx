import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function LandingPage() {
  const navigate = useNavigate();
  const [roomInput, setRoomInput] = useState('');
  const [codeRoomInput, setCodeRoomInput] = useState('');

  const createRoom = (type: 'room' | 'code') => {
    const id = uuidv4().slice(0, 8);
    navigate(`/${type}/${id}`);
  };

  const joinRoom = (type: 'room' | 'code', value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    navigate(`/${type}/${trimmed}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Hero */}
      <header className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl mb-4 shadow-lg shadow-primary-900/50">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">
            File<span className="text-primary-400">Share</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-md mx-auto">
            Peer-to-peer file sharing and real-time code collaboration — no account needed.
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {['WebRTC P2P', 'End-to-End', 'Real-time Sync', 'Monaco Editor', 'PWA Offline'].map((feat) => (
            <span key={feat} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300">
              {feat}
            </span>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* File Share Card */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-white">File Sharing</h2>
                <p className="text-sm text-slate-400">Up to 500MB via WebRTC P2P</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Room ID (optional)"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinRoom('room', roomInput)}
              />
              <button
                className="btn-primary whitespace-nowrap"
                onClick={() => (roomInput.trim() ? joinRoom('room', roomInput) : createRoom('room'))}
              >
                {roomInput.trim() ? 'Join' : 'Create'}
              </button>
            </div>
          </div>

          {/* Code Collab Card */}
          <div className="card flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-white">Code Collaboration</h2>
                <p className="text-sm text-slate-400">Real-time Monaco + Yjs CRDT</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Room ID (optional)"
                value={codeRoomInput}
                onChange={(e) => setCodeRoomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && joinRoom('code', codeRoomInput)}
              />
              <button
                className="btn-primary whitespace-nowrap"
                onClick={() => (codeRoomInput.trim() ? joinRoom('code', codeRoomInput) : createRoom('code'))}
              >
                {codeRoomInput.trim() ? 'Join' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-600 text-sm border-t border-slate-800">
        <p>
          Powered by WebRTC · Yjs · Monaco Editor · Socket.IO
        </p>
      </footer>
    </div>
  );
}
