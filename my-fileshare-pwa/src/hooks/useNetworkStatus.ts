import { useEffect, useState } from 'react';

export interface NetworkStatus {
  online: boolean;
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown';
  downlink: number;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => ({
    online: navigator.onLine,
    effectiveType: getEffectiveType(),
    downlink: getDownlink(),
  }));

  useEffect(() => {
    const update = () => {
      setStatus({
        online: navigator.onLine,
        effectiveType: getEffectiveType(),
        downlink: getDownlink(),
      });
    };

    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    const conn = getNetworkConnection();
    if (conn) {
      conn.addEventListener('change', update);
    }

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      if (conn) conn.removeEventListener('change', update);
    };
  }, []);

  return status;
}

function getNetworkConnection(): EventTarget | null {
  const nav = navigator as Navigator & {
    connection?: EventTarget;
    mozConnection?: EventTarget;
    webkitConnection?: EventTarget;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection ?? null;
}

function getEffectiveType(): NetworkStatus['effectiveType'] {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };
  const et = nav.connection?.effectiveType;
  if (et === '4g' || et === '3g' || et === '2g' || et === 'slow-2g') return et;
  return 'unknown';
}

function getDownlink(): number {
  const nav = navigator as Navigator & {
    connection?: { downlink?: number };
  };
  return nav.connection?.downlink ?? 0;
}
