import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

// Load variabel dari .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/get-token', async (req, res) => {
    const roomName = (req.query.room as string) || 'default-room';
    const participantName = (req.query.user as string) || 'user-' + Math.floor(Math.random() * 100);

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
        res.status(500).json({ error: 'Server misconfigured: API Key/Secret missing' });
        return;
    }

    try {
        // Membuat token akses
        const at = new AccessToken(apiKey, apiSecret, {
            identity: participantName,
        });

        // Memberikan izin ke user
        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true,
        });

        const token = await at.toJwt();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend Manager jalan di http://localhost:${PORT}`);
});