const XIRSYS_URL = import.meta.env.VITE_XIRSYS_URL as string | undefined;
const XIRSYS_USER = import.meta.env.VITE_XIRSYS_USER as string | undefined;
const XIRSYS_CRED = import.meta.env.VITE_XIRSYS_CRED as string | undefined;

export async function getIceServers(): Promise<RTCIceServer[]> {
  const stun: RTCIceServer = { urls: 'stun:stun.l.google.com:19302' };

  if (XIRSYS_URL && XIRSYS_USER && XIRSYS_CRED) {
    try {
      const res = await fetch(XIRSYS_URL, {
        method: 'PUT',
        headers: {
          Authorization: 'Basic ' + btoa(`${XIRSYS_USER}:${XIRSYS_CRED}`),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ format: 'urls' }),
      });
      if (res.ok) {
        const data = (await res.json()) as { v?: { iceServers?: RTCIceServer[] } };
        const servers = data?.v?.iceServers;
        if (servers && servers.length > 0) {
          return [stun, ...servers];
        }
      }
    } catch {
      console.warn('[webrtc] Failed to fetch Xirsys TURN servers, using STUN only');
    }
  }

  return [stun];
}

export function createPeerConnection(iceServers: RTCIceServer[]): RTCPeerConnection {
  return new RTCPeerConnection({
    iceServers,
    iceTransportPolicy: 'all',
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
  });
}

export async function logWebRTCStats(pc: RTCPeerConnection): Promise<void> {
  const stats = await pc.getStats();
  stats.forEach((report) => {
    if (report.type === 'data-channel' || report.type === 'transport') {
      console.debug('[webrtc stats]', report.type, report);
    }
  });
}
