import { prisma } from '../../infrastructure/database/prisma.client.js';
import { Room } from '@prisma/client';

export class RoomRepository {
    /**
     * Membuat record Room baru di database
     */
    async create(data: { tenantId: string; logicalName: string; livekitRoomName: string }): Promise<Room> {
        return await prisma.room.create({
            data: {
                tenantId: data.tenantId,
                logicalName: data.logicalName,
                livekitRoomName: data.livekitRoomName,
                status: 'CREATED',
            },
        });
    }

    /**
     * Mencari Room berdasarkan ID dan memastikan Room tersebut milik Tenant yang memintanya
     */
    async findByIdAndTenant(roomId: string, tenantId: string): Promise<Room | null> {
        return await prisma.room.findFirst({
            where: {
                id: roomId,
                tenantId: tenantId,
            },
        });
    }
}