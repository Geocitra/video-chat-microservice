import React from 'react';

interface PreJoinScreenProps {
    onJoin: () => void;
}

export const PreJoinScreen: React.FC<PreJoinScreenProps> = ({ onJoin }) => {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-textHighlight">
            <div className="mx-4 w-full max-w-md text-center rounded-xl bg-surface p-8 shadow-2xl">
                <h1 className="mb-4 text-2xl font-bold">Siap untuk Bergabung?</h1>
                <p className="mb-8 text-sm text-gray-400">
                    Browser membutuhkan izin Anda untuk memulai sesi. Kamera dan mikrofon dapat Anda atur di dalam ruangan.
                </p>
                <button
                    onClick={onJoin}
                    className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                >
                    Masuk ke Sesi Video
                </button>
            </div>
        </div>
    );
};