import React from 'react';
import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { useBridge } from '../../hooks/useBridge';

export const Toolbar: React.FC = () => {
    // Mengekstrak fungsi mutasi dan state dari partisipan lokal (user kita sendiri)
    const { localParticipant, isMicrophoneEnabled, isCameraEnabled, isScreenShareEnabled } = useLocalParticipant();

    // Mengambil konteks room untuk melakukan diskoneksi
    const room = useRoomContext();
    const { sendMessage } = useBridge();

    const toggleMic = () => {
        localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    };

    const toggleCamera = () => {
        localParticipant.setCameraEnabled(!isCameraEnabled);
    };

    const toggleScreenShare = () => {
        localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
    };

    const handleLeave = async () => {
        // 1. Putuskan koneksi WebRTC secara elegan dari sisi mesin LiveKit
        await room.disconnect();

        // 2. Beri tahu Aplikasi Utama bahwa user telah keluar, 
        // agar Aplikasi Utama bisa menghapus/menutup Iframe dari DOM.
        sendMessage('LEAVE', { reason: 'USER_INITIATED' });
    };

    // Utility class untuk tombol agar DRY (Don't Repeat Yourself)
    const btnBaseClass = "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 active:scale-90 shadow-lg";

    return (
        <div className="flex items-center gap-4 rounded-2xl bg-surface/80 px-6 py-3 backdrop-blur-md border border-gray-700">

            {/* Tombol Mikrofon */}
            <button
                onClick={toggleMic}
                className={`${btnBaseClass} ${isMicrophoneEnabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                title={isMicrophoneEnabled ? "Matikan Mikrofon" : "Nyalakan Mikrofon"}
            >
                {isMicrophoneEnabled ? '🎙️' : '🔇'}
            </button>

            {/* Tombol Kamera */}
            <button
                onClick={toggleCamera}
                className={`${btnBaseClass} ${isCameraEnabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                title={isCameraEnabled ? "Matikan Kamera" : "Nyalakan Kamera"}
            >
                {isCameraEnabled ? '📷' : '🚫'}
            </button>

            {/* Tombol Screen Share */}
            <button
                onClick={toggleScreenShare}
                className={`${btnBaseClass} ${isScreenShareEnabled ? 'bg-primary hover:opacity-80 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                title={isScreenShareEnabled ? "Hentikan Presentasi" : "Bagikan Layar"}
            >
                💻
            </button>

            {/* Separator */}
            <div className="h-8 w-px bg-gray-600 mx-2"></div>

            {/* Tombol Leave Room */}
            <button
                onClick={handleLeave}
                className="flex h-12 items-center justify-center rounded-full bg-red-600 px-6 font-bold text-white shadow-lg transition-all hover:bg-red-700 active:scale-95"
            >
                Keluar
            </button>

        </div>
    );
};