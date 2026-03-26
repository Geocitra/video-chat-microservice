import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Target browser modern yang mendukung native ES Modules dan WebRTC
    target: 'esnext',
    // Meningkatkan batas peringatan chunk size karena WebRTC library memang besar
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Strategi Chunk Splitting Tingkat Lanjut
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Chunk 1: Engine LiveKit (Paling berat, jarang berubah)
            if (id.includes('livekit-client') || id.includes('@livekit')) {
              return 'livekit-vendor';
            }
            // Chunk 2: React Ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // Chunk 3: Sisa dependensi lainnya
            return 'general-vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Tetap pertahankan header ini agar Iframe bisa dirender di localhost port lain saat dev
    headers: {
      'X-Frame-Options': 'ALLOWALL',
    },
  }
});