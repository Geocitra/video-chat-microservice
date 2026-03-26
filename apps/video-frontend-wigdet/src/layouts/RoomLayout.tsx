import React from 'react';
import { useParticipants } from '@livekit/components-react';
import { useGridMath } from '../hooks/useGridMath';
import { VideoTile } from '../components/media/VideoTile';
import { useBackgroundOptimization } from '../hooks/useBackgroundOptimization'; // IMPORT HOOK

export const RoomLayout: React.FC = () => {
    const participants = useParticipants();
    const gridClass = useGridMath(participants.length);

    // Mengaktifkan The Watcher (Mitigasi iOS Suspend) secara diam-diam di background
    useBackgroundOptimization();

    return (
        <div className="flex h-full w-full flex-col p-2 sm:p-4">
            <div className={`grid h-full w-full gap-2 sm:gap-4 ${gridClass}`}>
                {participants.map((participant) => (
                    <VideoTile key={participant.sid} participant={participant} />
                ))}
            </div>
        </div>
    );
};