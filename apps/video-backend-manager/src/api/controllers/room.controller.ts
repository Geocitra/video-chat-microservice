import { Request, Response } from 'express';
import { RoomService } from '../../domain/services/room.service.js';

// Interface kustom untuk Request yang memiliki tenantId dari Middleware Auth
interface TenantRequest extends Request {
    tenant?: {
        id: string;
        name: string;
    };
}

export class RoomController {
    private roomService: RoomService;

    constructor() {
        this.roomService = new RoomService();
    }

    /**
     * Endpoint: POST /api/v1/rooms
     */
    createRoom = async (req: TenantRequest, res: Response): Promise<void> => {
        try {
            const tenantId = req.tenant?.id;
            const { logicalName } = req.body;

            if (!tenantId) {
                res.status(401).json({ status: 'error', message: 'Unauthorized: Tenant missing' });
                return;
            }

            const room = await this.roomService.createRoom(tenantId, logicalName);

            res.status(201).json({
                status: 'success',
                data: room,
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'error',
                message: error.message || 'Failed to create room',
            });
        }
    };

    /**
     * Endpoint: POST /api/v1/tokens
     */
    generateToken = async (req: TenantRequest, res: Response): Promise<void> => {
        try {
            const tenantId = req.tenant?.id;
            const { roomId, participantIdentity, participantName, isAdmin } = req.body;

            if (!tenantId) {
                res.status(401).json({ status: 'error', message: 'Unauthorized: Tenant missing' });
                return;
            }

            if (!roomId || !participantIdentity || !participantName) {
                res.status(400).json({ status: 'error', message: 'Missing required fields' });
                return;
            }

            const tokenData = await this.roomService.generateToken({
                tenantId,
                roomId,
                participantIdentity,
                participantName,
                isAdmin,
            });

            res.status(200).json({
                status: 'success',
                data: tokenData,
            });
        } catch (error: any) {
            // Jika error spesifik karena tidak ditemukan/hak akses
            if (error.message.includes('not found')) {
                res.status(404).json({ status: 'error', message: error.message });
                return;
            }

            res.status(500).json({
                status: 'error',
                message: error.message || 'Internal server error during token generation',
            });
        }
    };
}