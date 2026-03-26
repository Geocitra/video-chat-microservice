import { useState, useEffect } from 'react';
import { themeManager } from '../services/themeManager';

interface UrlParams {
    token: string | null;
    livekitUrl: string | null;
    primaryColor: string | null;
    parentOrigin: string | null;
    isValid: boolean;
}

export const useUrlParams = (): UrlParams => {
    const [params, setParams] = useState<UrlParams>({
        token: null,
        livekitUrl: null,
        primaryColor: null,
        parentOrigin: null,
        isValid: false,
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const token = searchParams.get('token');
        const livekitUrl = searchParams.get('url') || import.meta.env.VITE_LIVEKIT_URL || null;
        const parentOrigin = searchParams.get('origin');
        const primaryColor = searchParams.get('primaryColor');

        // Delegasi injeksi tema ke Service khusus
        themeManager.applyPrimaryColor(primaryColor);

        setParams({
            token,
            livekitUrl,
            primaryColor,
            parentOrigin,
            isValid: !!token && !!livekitUrl,
        });
    }, []);

    return params;
};