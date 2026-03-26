import { PrismaClient } from '@prisma/client';

/**
 * Mendeklarasikan tipe global agar TypeScript tidak komplain
 * saat kita menyisipkan instance Prisma ke object global Node.js.
 */
declare global {
    // eslint-disable-next-line no-var
    var prismaGlobal: PrismaClient | undefined;
}

/**
 * Menerapkan pola Singleton untuk Prisma Client.
 * Mencegah error "Too many connections" pada PostgreSQL akibat hot-reloading di environment development.
 */
const prismaClientSingleton = () => {
    return new PrismaClient({
        // Log query aktif di environment development untuk keperluan debugging dan observabilitas analisis
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

// Mengambil instance dari global scope jika sudah ada, atau membuat baru jika belum.
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Menyimpan instance ke global scope hanya jika BUKAN di environment production
if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma;
}

export default prisma;