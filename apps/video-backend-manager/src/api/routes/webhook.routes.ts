import { Router } from 'express';
import express from 'express';
import { WebhookController } from '../controllers/webhook.controller.js';

const router = Router();
const webhookController = new WebhookController();

/**
 * PENTING: Middleware express.text() disematkan secara spesifik di sini.
 * Jika kita membiarkan express.json() mem-parsing body ini menjadi objek secara global,
 * proses verifikasi HMAC di LiveKit SDK akan gagal karena hilangnya karakter spasi/newline asli.
 */
router.post(
    '/livekit',
    express.text({ type: 'application/webhook+json' }),
    webhookController.handleWebhook
);

export default router;