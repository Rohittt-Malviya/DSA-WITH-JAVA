import { useEffect, useState } from 'react';

interface NetworkState {
  online: boolean;
  reconnecting: boolean;
}

export default function NetworkStatus() {
  const [state, setState] = useState<NetworkState>({
    online: navigator.onLine,
    reconnecting: false,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const handleOffline = () => {
      setState({ online: false, reconnecting: false });
      setVisible(true);
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
    };

    const handleOnline = () => {
      setState({ online: true, reconnecting: true });
      reconnectTimer = setTimeout(() => {
        setState({ online: true, reconnecting: false });
        setTimeout(() => setVisible(false), 2000);
      }, 1500);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (reconnectTimer !== null) clearTimeout(reconnectTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-xl text-sm font-medium transition-all duration-300 ${
        state.online
          ? 'bg-emerald-900/90 border border-emerald-700 text-emerald-300'
          : 'bg-red-900/90 border border-red-700 text-red-300'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          state.reconnecting ? 'bg-yellow-400 animate-pulse' : state.online ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'
        }`}
      />
      {!state.online && 'You are offline'}
      {state.reconnecting && 'Reconnecting…'}
      {state.online && !state.reconnecting && 'Back online ✓'}
    </div>
  );
}
