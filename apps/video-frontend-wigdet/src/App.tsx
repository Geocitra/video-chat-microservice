import { useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

export default function App() {
    const [token, setToken] = useState<string | null>(null);

    // --- KONFIGURASI URL DEV TUNNELS ---
    // Gunakan URL yang kamu dapatkan dari VS Code tadi
    const BACKEND_TUNNEL_URL = "https://lft3zq8l-5000.asse.devtunnels.ms";
    const LIVEKIT_TUNNEL_URL = "wss://lft3zq8l-7880.asse.devtunnels.ms";
    // Catatan: Port 7880 wajib pakai wss:// (WebSocket Secure) agar bisa jalan di Tunnel

    const handleJoin = async () => {
        try {
            // 1. Buat ID Random agar tidak bentrok (Saling tendang)
            const randomId = 'user-' + Math.floor(Math.random() * 1000);

            // 2. Minta Token ke Backend Manager (Port 5000)
            console.log("Meminta token ke:", BACKEND_TUNNEL_URL);
            const response = await fetch(`${BACKEND_TUNNEL_URL}/get-token?room=kelas-fisika&user=${randomId}`);

            if (!response.ok) throw new Error("Gagal mengambil token");

            const data = await response.json();
            setToken(data.token);
            console.log("Token berhasil didapat!");
        } catch (e) {
            console.error(e);
            alert("Gagal konek ke Backend! Pastikan tab Ports di VS Code Backend sudah PUBLIC.");
        }
    };

    // TAMPILAN SEBELUM JOIN (TOMBOL)
    if (!token) {
        return (
            <div style={{
                display: 'grid',
                placeItems: 'center',
                height: '100vh',
                backgroundColor: '#111',
                color: 'white',
                fontFamily: 'sans-serif'
            }}>
                <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #333', borderRadius: '12px' }}>
                    <h1 style={{ marginBottom: '20px' }}>Video Microservice</h1>
                    <button
                        onClick={handleJoin}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Join Meeting
                    </button>
                    <p style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
                        Testing via VS Code Dev Tunnels
                    </p>
                </div>
            </div>
        );
    }

    // TAMPILAN SAAT VIDEO AKTIF
    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={LIVEKIT_TUNNEL_URL} // Menggunakan URL Port 7880 (wss://)
                onDisconnected={() => setToken(null)}
                data-lk-theme="default"
            >
                {/* UI Standar LiveKit: Grid Video, Tombol Mute, Leave, dll */}
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
}