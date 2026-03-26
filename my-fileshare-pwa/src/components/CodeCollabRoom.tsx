import { useCallback, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor, { OnMount } from '@monaco-editor/react';
import { useYjs } from '../hooks/useYjs';
import type * as Monaco from 'monaco-editor';

const LANGUAGES = [
  'typescript', 'javascript', 'python', 'java', 'cpp', 'csharp',
  'go', 'rust', 'html', 'css', 'json', 'markdown', 'sql', 'bash',
];

export default function CodeCollabRoom() {
  const { id: roomId = '' } = useParams<{ id: string }>();
  const { participants, connected, language, changeLanguage, bindEditor } = useYjs(roomId);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const [fontSize, setFontSize] = useState(14);

  const handleEditorMount: OnMount = useCallback(
    (editor, monacoInstance) => {
      editorRef.current = editor;
      bindEditor(editor, monacoInstance);
    },
    [bindEditor],
  );

  const copyRoomLink = () => {
    void navigator.clipboard.writeText(window.location.href);
  };

  const participantList = [...participants.values()];

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="font-semibold text-white text-sm">Code Collab</h1>
            <p className="text-xs text-slate-500">Room: {roomId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin py-1">
          {/* Language selector */}
          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Font size */}
          <div className="flex items-center gap-1">
            <button
              className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs"
              onClick={() => setFontSize((f) => Math.max(10, f - 1))}
            >
              −
            </button>
            <span className="text-xs text-slate-400 w-6 text-center">{fontSize}</span>
            <button
              className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs"
              onClick={() => setFontSize((f) => Math.min(24, f + 1))}
            >
              +
            </button>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-1">
            {participantList.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-slate-900 relative"
                style={{ backgroundColor: p.color }}
                title={p.id}
              >
                {p.id.slice(-2).toUpperCase()}
                {p.isTyping && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-slate-900" />
                )}
              </div>
            ))}
            {participantList.length > 5 && (
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                +{participantList.length - 5}
              </div>
            )}
          </div>

          {/* Connection */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${connected ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`}
            />
            <span className="text-xs text-slate-500">{connected ? 'Live' : 'Connecting'}</span>
          </div>

          <button className="btn-secondary text-xs px-3 py-1.5" onClick={copyRoomLink}>
            Share
          </button>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          onMount={handleEditorMount}
          options={{
            fontSize,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontLigatures: true,
            minimap: { enabled: window.innerWidth > 768 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            bracketPairColorization: { enabled: true },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 16 },
          }}
        />
      </div>

      {/* Participant sidebar (bottom strip on mobile) */}
      {participantList.length > 0 && (
        <div className="flex-shrink-0 border-t border-slate-800 px-4 py-2 flex items-center gap-3 overflow-x-auto scrollbar-thin">
          <span className="text-xs text-slate-500 flex-shrink-0">
            {participantList.length} participant{participantList.length !== 1 ? 's' : ''}
          </span>
          {participantList.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-slate-400 font-mono">{p.id.slice(-8)}</span>
              {p.isTyping && (
                <span className="text-xs text-emerald-400 animate-pulse">typing…</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
