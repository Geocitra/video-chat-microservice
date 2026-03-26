import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    // Parameter next wajib ada meski tidak dipanggil, agar Express mengenali fungsi ini sebagai Error Handler
    next: NextFunction
): void => {
    // Observabilitas internal: Mencatat error ke stdout untuk ditangkap oleh tools monitoring (seperti PM2/Docker logs)
    console.error(`[System Exception] ${err.name}: ${err.message}`);

    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment && err.stack) {
        console.error(err.stack);
    }

    // Jika status code belum diset oleh Controller, default ke 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        status: 'error',
        message: isDevelopment
            ? err.message // Transparan di fase development
            : 'Terjadi anomali pada sistem. Permintaan tidak dapat diproses saat ini.', // Opaque di fase produksi
    });
};