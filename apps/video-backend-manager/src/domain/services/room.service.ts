import { AccessToken } from 'livekit-server-sdk';
import { RoomRepository } from '../repositories/room.repository.js';
import crypto from 'crypto';

export class RoomService {
    private roomRepository: RoomRepository;

    constructor() {
        this.roomRepository = new RoomRepository();
    }

    /**
     * Logika pembuatan Room baru dengan prefix Multi-tenant
     */
    async createRoom(tenantId: string, logicalName: string) {
        if (!logicalName) {
            throw new Error('Logical name is required');
        }

        // Generate unique LiveKit Room Name (Format: tenantId_slug_randomHex)
        const slug = logicalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const randomSuffix = crypto.randomBytes(4).toString('hex');
        const livekitRoomName = `${tenantId}_${slug}_${randomSuffix}`;

        // Delegasi penyimpanan ke Repository
        const room = await this.roomRepository.create({
            tenantId,
            logicalName,
            livekitRoomName,
        });

        return room;
    }

    /**
     * Logika pembuatan Token LiveKit yang aman
     */
    async generateToken(params: {
        tenantId: string;
        roomId: string;
        participantIdentity: string;
        participantName: string;
        isAdmin?: boolean;
    }) {
        const { tenantId, roomId, participantIdentity, participantName, isAdmin = false } = params;

        // 1. Validasi eksistensi Room dan kepemilikan Tenant (Insecure Direct Object Reference Mitigation)
        const room = await this.roomRepository.findByIdAndTenant(roomId, tenantId);
        if (!room) {
            throw new Error('Room not found or you do not have permission to access it');
        }

        // 2. Load kredensial LiveKit dari Environment Variables
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new Error('LiveKit credentials are not configured properly');
        }

        // 3. Generate Token menggunakan LiveKit SDK
        const at = new AccessToken(apiKey, apiSecret, {
            identity: participantIdentity,
            name: participantName,
            // TTL Token diatur eksplisit, misal 2 jam (7200 detik) untuk keamanan
            ttl: 7200,
        });

        // 4. Inject Grants (Hak Akses WebRTC)
        at.addGrant({
            roomJoin: true,
            room: room.livekitRoomName, // Menunjuk ke physical room name di LiveKit Engine
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
            roomAdmin: isAdmin, // Memberikan hak kick/mute jika user adalah Admin/Guru
        });

        const token = await at.toJwt();

        return {
            livekitUrl: process.env.LIVEKIT_URL,
            token,
            roomInfo: {
                id: room.id,
                livekitRoomName: room.livekitRoomName,
            }
        };
    }
}