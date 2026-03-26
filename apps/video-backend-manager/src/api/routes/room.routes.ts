import { Router } from 'express';
import { RoomController } from '../controllers/room.controller.js';
import { tenantAuthMiddleware } from '../middlewares/tenant-auth.middleware.js';

const router = Router();
const roomController = new RoomController();

// ==========================================
// MIDDLEWARE INJECTION (Protected Variations)
// ==========================================
// Dengan menggunakan router.use() di posisi ini, kita memastikan bahwa 
// SEMUA route yang didefinisikan di bawahnya wajib melewati gerbang tol otentikasi.
// Ini mencegah kelalaian human-error di masa depan jika ada endpoint baru yang ditambahkan.
router.use(tenantAuthMiddleware);

// ==========================================
// PROTECTED ROUTES
// ==========================================

// Route untuk membuat Room baru (Formalisasi Sesi di DB)
router.post('/', roomController.createRoom);

// Route untuk men-generate Token masuk (Otorisasi WebRTC LiveKit)
router.post('/tokens', roomController.generateToken);

export default router;