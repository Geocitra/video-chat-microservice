import { PrismaClient } from '@prisma/client';

// Kita menginisialisasi client baru khusus untuk script independen ini
// agar terpisah dari lifecycle aplikasi utama.
const prisma = new PrismaClient();

async function main() {
    console.log('⏳ Memulai proses sinkronisasi data awal (Seeding)...');

    // Injeksi Tenant A (Aplikasi Utama Pertama)
    const tenantA = await prisma.tenant.upsert({
        where: {
            apiKey: 'dev_app_a_key_123'
        },
        update: {}, // Biarkan kosong agar tidak menimpa perubahan jika data sudah ada
        create: {
            name: 'Aplikasi KeuanganKu (Tenant A)',
            apiKey: 'dev_app_a_key_123',
            apiSecret: 'dev_app_a_secret_abc', // Akan digunakan untuk verifikasi signature kedepannya
            isActive: true,
        },
    });

    // Anda bisa menambahkan Tenant B di sini jika diperlukan untuk testing Multi-tenant
    const tenantB = await prisma.tenant.upsert({
        where: {
            apiKey: 'dev_app_b_key_999'
        },
        update: {},
        create: {
            name: 'Aplikasi SLIK-AUTOHUB (Tenant B)',
            apiKey: 'dev_app_b_key_999',
            apiSecret: 'dev_app_b_secret_xyz',
            isActive: true,
        },
    });

    console.log('✅ Seeding berhasil diselesaikan. Data Tenant Inisial:');
    console.table([
        { id: tenantA.id, name: tenantA.name, apiKey: tenantA.apiKey },
        { id: tenantB.id, name: tenantB.name, apiKey: tenantB.apiKey }
    ]);
}

main()
    .catch((e) => {
        console.error('❌ Terjadi kesalahan kritikal saat seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        // Memastikan koneksi database ditutup secara elegan
        await prisma.$disconnect();
    });