import { WebhookEvent } from 'livekit-server-sdk';
import { prisma } from '../../infrastructure/database/prisma.client.js';

export class WebhookService {
    /**
     * Mengevaluasi dan memproses event yang dikirim oleh LiveKit Engine
     */
    async processEvent(event: WebhookEvent): Promise<void> {
        console.log(`[Webhook] Menerima event: ${event.event} untuk room: ${event.room?.name}`);

        switch (event.event) {
            case 'room_started':
                await this.handleRoomStarted(event);
                break;
            case 'room_finished':
                await this.handleRoomFinished(event);
                break;
            case 'participant_joined':
                await this.handleParticipantJoined(event);
                break;
            case 'participant_left':
                await this.handleParticipantLeft(event);
                break;
            default:
                // Event lain diabaikan agar tidak membebani database
                break;
        }
    }

    private async handleRoomStarted(event: WebhookEvent) {
        if (!event.room?.name) return;
        await prisma.room.updateMany({
            where: { livekitRoomName: event.room.name },
            data: { status: 'ACTIVE' },
        });
    }

    private async handleRoomFinished(event: WebhookEvent) {
        if (!event.room?.name) return;
        await prisma.room.updateMany({
            where: { livekitRoomName: event.room.name },
            data: { status: 'ENDED', endedAt: new Date() },
        });
    }

    private async handleParticipantJoined(event: WebhookEvent) {
        if (!event.room?.name || !event.participant?.identity) return;

        const room = await prisma.room.findUnique({
            where: { livekitRoomName: event.room.name },
        });

        if (!room) return;

        await prisma.participant.create({
            data: {
                roomId: room.id,
                identity: event.participant.identity,
                name: event.participant.name || 'Unknown',
                joinedAt: new Date(),
            },
        });
    }

    private async handleParticipantLeft(event: WebhookEvent) {
        if (!event.room?.name || !event.participant?.identity) return;

        const room = await prisma.room.findUnique({
            where: { livekitRoomName: event.room.name },
        });

        if (!room) return;

        // Mencari partisipan yang sedang aktif (belum memiliki record leftAt)
        const participant = await prisma.participant.findFirst({
            where: {
                roomId: room.id,
                identity: event.participant.identity,
                leftAt: null,
            },
        });

        if (participant) {
            await prisma.participant.update({
                where: { id: participant.id },
                data: {
                    leftAt: new Date(),
                    // LiveKit tidak mengirim reason eksplisit untuk INTENTIONAL saat disconnect biasa
                    // Kita anggap DISCONNECTED, kecuali ada API khusus 'Leave' yang di-hit duluan
                    leaveReason: 'DISCONNECTED',
                },
            });
        }
    }
}