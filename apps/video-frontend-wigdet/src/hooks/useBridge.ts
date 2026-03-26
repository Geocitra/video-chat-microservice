import { useCallback } from 'react';
import { useUrlParams } from './useUrlParams';

export const useBridge = () => {
    const { parentOrigin } = useUrlParams();

    const sendMessage = useCallback((action: string, payload?: Record<string, any>) => {
        // Memastikan skrip ini benar-benar berjalan di dalam sebuah Iframe
        if (window.parent && window.parent !== window) {
            // Jika parentOrigin tidak disertakan, gunakan '*' dengan peringatan, 
            // namun di lingkungan produksi, parentOrigin sangat diwajibkan.
            const targetOrigin = parentOrigin || '*';

            if (targetOrigin === '*') {
                console.warn('[Security Warning] Target origin for postMessage is "*". Malicious extensions might intercept this payload.');
            }

            window.parent.postMessage(
                {
                    type: 'VIDEO_WIDGET_EVENT',
                    action,
                    payload,
                },
                targetOrigin
            );
        }
    }, [parentOrigin]);

    return { sendMessage };
};