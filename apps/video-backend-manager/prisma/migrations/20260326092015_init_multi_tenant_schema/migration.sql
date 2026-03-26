-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('CREATED', 'ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "LeaveReason" AS ENUM ('INTENTIONAL', 'DISCONNECTED', 'KICKED');

-- CreateTable
CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "api_key" VARCHAR(100) NOT NULL,
    "api_secret" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "logical_name" VARCHAR(255) NOT NULL,
    "livekit_room_name" VARCHAR(255) NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'CREATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "room_id" UUID NOT NULL,
    "identity" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "joined_at" TIMESTAMP(3),
    "left_at" TIMESTAMP(3),
    "leave_reason" "LeaveReason",

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_api_key_key" ON "tenants"("api_key");

-- CreateIndex
CREATE INDEX "tenants_api_key_idx" ON "tenants"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_livekit_room_name_key" ON "rooms"("livekit_room_name");

-- CreateIndex
CREATE INDEX "rooms_livekit_room_name_idx" ON "rooms"("livekit_room_name");

-- CreateIndex
CREATE INDEX "participants_room_id_identity_idx" ON "participants"("room_id", "identity");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
