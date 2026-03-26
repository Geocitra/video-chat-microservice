import { useEffect, useRef } from 'react';
import { useLocalParticipant } from '@livekit/components-react';

export const useBackgroundOptimization = () => {
    const { localParticipant, isCameraEnabled } = useLocalParticipant();

    // Menggunakan useRef untuk mengingat apakah kamera menyala SEBELUM user pindah tab.
    // Ini mencegah kamera tiba-tiba menyala saat user kembali jika sebelumnya user memang mematikan kamera.
    const wasCameraOnRef = useRef<boolean>(false);

    useEffect(() => {
        // Menyimpan state terakhir setiap kali ada perubahan
        wasCameraOnRef.current = isCameraEnabled;
    }, [isCameraEnabled]);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'hidden') {
                // Fase 1: Iframe masuk ke background (Tab tidak aktif / App diminimize)
                if (localParticipant.isCameraEnabled) {
                    console.log('[System] Memasuki background state. Mematikan transmisi video...');
                    await localParticipant.setCameraEnabled(false);
                    // Kita set flag ini agar sistem tahu bahwa SITEM-lah yang mematikan, bukan user
                    wasCameraOnRef.current = true;
                }
            } else if (document.visibilityState === 'visible') {
                // Fase 2: Iframe kembali aktif di layar
                if (wasCameraOnRef.current && !localParticipant.isCameraEnabled) {
                    console.log('[System] Kembali ke foreground. Merenegosiasi transmisi video...');
                    await localParticipant.setCameraEnabled(true);
                }
            }
        };

        // Mendaftarkan event listener langsung ke lapisan dokumen peramban
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [localParticipant]);
};