import { Request, Response } from 'express';
import { WebhookReceiver } from 'livekit-server-sdk';
import { WebhookService } from '../../domain/services/webhook.service.js';

export class WebhookController {
    private webhookReceiver: WebhookReceiver;
    private webhookService: WebhookService;

    constructor() {
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new Error('LiveKit credentials are not configured properly');
        }

        // Menginisialisasi receiver dengan secret key untuk validasi kriptografi
        this.webhookReceiver = new WebhookReceiver(apiKey, apiSecret);
        this.webhookService = new WebhookService();
    }

    /**
     * Endpoint: POST /api/v1/webhook/livekit
     */
    handleWebhook = async (req: Request, res: Response): Promise<void> => {
        try {
            // LiveKit SDK membutuhkan body dalam format raw string untuk verifikasi signature
            const body = req.body;
            const authHeader = req.get('Authorization');

            if (!authHeader) {
                res.status(401).send('Authorization header missing');
                return;
            }

            // 1. Verifikasi Signature dan Ekstrak Event
            const event = await this.webhookReceiver.receive(body, authHeader);

            // 2. Delegasi Logika ke Service
            await this.webhookService.processEvent(event);

            // 3. Merespons 200 OK dengan cepat.
            // Aturan Emas Webhook: Jangan biarkan pengirim menunggu terlalu lama (timeout),
            // jika tidak LiveKit akan melakukan retry yang berujung pada data ganda.
            res.status(200).send('OK');
        } catch (error: any) {
            console.error('[Webhook Error]', error.message);
            // Tolak dengan 401 jika validasi HMAC gagal (potensi serangan spoofing)
            res.status(401).send('Invalid webhook signature');
        }
    };
}