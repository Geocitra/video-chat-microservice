import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../infrastructure/database/prisma.client.js';

// Ekstensi antarmuka Request Express untuk menampung data Tenant hasil injeksi
export interface TenantRequest extends Request {
    tenant?: {
        id: string;
        name: string;
    };
}

export const tenantAuthMiddleware = async (
    req: TenantRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Mengekstrak API Key dari header standar yang telah kita sepakati
        const apiKey = req.header('x-api-key');

        if (!apiKey) {
            res.status(401).json({
                status: 'error',
                message: 'Akses Ditolak: Header x-api-key tidak disertakan dalam request.',
            });
            return;
        }

        // Mencari Tenant di database menggunakan Prisma
        // Indexing pada kolom apiKey (yang kita buat di skema) membuat query ini beroperasi dalam O(log n)
        const tenant = await prisma.tenant.findUnique({
            where: { apiKey },
            select: { id: true, name: true, isActive: true } // Proyeksi data untuk optimasi memori
        });

        // Validasi eksistensi dan status aktif
        if (!tenant || !tenant.isActive) {
            res.status(401).json({
                status: 'error',
                message: 'Akses Ditolak: Kredensial tidak valid atau Tenant telah dinonaktifkan.',
            });
            return;
        }

        // Mutasi state request: Menyematkan konteks bisnis ke dalam alur eksekusi
        req.tenant = {
            id: tenant.id,
            name: tenant.name,
        };

        // Mendelegasikan kontrol ke lapisan berikutnya (Controller)
        next();
    } catch (error) {
        // Jika terjadi anomali (misal database putus), lempar ke Global Error Handler
        next(error);
    }
};