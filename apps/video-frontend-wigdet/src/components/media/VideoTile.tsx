import React, { useEffect, useRef, useState } from 'react';
import { Participant, Track } from 'livekit-client';
// 1. Hapus AudioTrack dan useParticipant. Ganti dengan useIsSpeaking dan useTracks.
import { useIsSpeaking, VideoTrack, useTracks } from '@livekit/components-react';

interface VideoTileProps {
    participant: Participant;
}

export const VideoTile: React.FC<VideoTileProps> = ({ participant }) => {
    // 2. Menggunakan hook modern LiveKit v2 khusus untuk mendeteksi suara
    const isSpeaking = useIsSpeaking(participant);

    // 3. Mengambil referensi track kamera secara reaktif dan memfilternya khusus untuk partisipan ini
    const tracks = useTracks([Track.Source.Camera]);
    const cameraTrackRef = tracks.find((t) => t.participant.identity === participant.identity);

    // 4. Deteksi absolut apakah kamera aktif (ada track-nya dan tidak di-mute)
    const isCameraActive = cameraTrackRef && !cameraTrackRef.publication.isMuted;

    // State untuk melacak apakah elemen ini terlihat di viewport (layar) pengguna
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '50px',
                threshold: 0.1,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative h-full w-full overflow-hidden rounded-xl bg-surface transition-all duration-300 ${isSpeaking ? 'ring-4 ring-primary' : 'ring-1 ring-gray-700'
                }`}
        >
            {/* OPTIMASI VISIBILITAS: Render VideoTrack hanya jika terlihat di layar dan kamera sedang aktif */}
            {isVisible && isCameraActive ? (
                <VideoTrack
                    trackRef={cameraTrackRef}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-600 text-xl font-bold text-white uppercase shadow-lg">
                        {/* Fallback amanan jika participant.name kosong, gunakan identity */}
                        {participant.name ? participant.name.substring(0, 2) : participant.identity.substring(0, 2)}
                    </div>
                </div>
            )}

            {/* Identitas Partisipan di pojok kiri bawah */}
            <div className="absolute bottom-2 left-2 flex items-center gap-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                <span className="truncate max-w-[100px]">{participant.name || participant.identity}</span>
                {isCameraActive && (
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                )}
            </div>
        </div>
    );
};