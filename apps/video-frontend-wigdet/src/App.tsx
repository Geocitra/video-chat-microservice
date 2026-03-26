import { useState } from 'react';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { useUrlParams } from './hooks/useUrlParams';
import { PreJoinScreen } from './components/overlays/PreJoinScreen';
import { RoomLayout } from './layouts/RoomLayout';
import { Toolbar } from './components/controls/Toolbar';
import '@livekit/components-styles';

function App() {
    const { token, livekitUrl, isValid } = useUrlParams();
    const [hasJoined, setHasJoined] = useState(false);

    // State 1: Parameter tidak valid (Mencegah blank screen jika token hilang)
    if (!isValid) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-textHighlight">
                <div className="max-w-md rounded-lg border border-red-500 bg-surface p-6 text-center">
                    <h2 className="mb-2 text-xl font-bold text-red-500">Akses Ditolak</h2>
                    <p className="text-sm text-gray-300">
                        Token otorisasi atau URL server tidak ditemukan.
                    </p>
                </div>
            </div>
        );
    }

    if (!hasJoined) {
        return <PreJoinScreen onJoin={() => setHasJoined(true)} />;
    }

    // State 3: Active WebRTC Session
    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token!}
            serverUrl={livekitUrl!}
            connect={true}
            className="relative flex h-screen w-full flex-col overflow-hidden bg-background"
        >
            {/* The Smart Grid */}
            <RoomLayout />

            {/* Kontrol Media Melayang (Floating Toolbar) */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center w-full px-4 pointer-events-none">
                {/* pointer-events-auto dipasang di dalam elemen agar area di luar toolbar tetap bisa di-klik (tidak menghalangi grid) */}
                <div className="pointer-events-auto">
                    <Toolbar />
                </div>
            </div>

            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}

export default App;