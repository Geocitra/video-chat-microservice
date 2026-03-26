import { useMemo } from 'react';

/**
 * Algoritma untuk menentukan susunan CSS Grid optimal.
 * Memastikan rasio aspek video (16:9 atau 4:3) tetap proporsional 
 * tanpa ada ruang kosong yang tidak wajar di layar.
 */
export const useGridMath = (participantCount: number): string => {
    return useMemo(() => {
        if (participantCount === 0 || participantCount === 1) {
            return 'grid-cols-1 grid-rows-1';
        }
        if (participantCount === 2) {
            return 'grid-cols-1 sm:grid-cols-2 grid-rows-2 sm:grid-rows-1';
        }
        if (participantCount <= 4) {
            return 'grid-cols-2 grid-rows-2';
        }
        if (participantCount <= 6) {
            return 'grid-cols-2 sm:grid-cols-3 grid-rows-3 sm:grid-rows-2';
        }
        if (participantCount <= 9) {
            return 'grid-cols-3 grid-rows-3';
        }
        if (participantCount <= 12) {
            return 'grid-cols-3 sm:grid-cols-4 grid-rows-4 sm:grid-rows-3';
        }
        // Maksimal standar grid untuk 13-16 partisipan
        return 'grid-cols-4 grid-rows-4';
    }, [participantCount]);
};