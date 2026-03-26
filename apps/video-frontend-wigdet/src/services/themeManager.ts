/**
 * Service khusus untuk mengelola injeksi tema dinamis ke dalam DOM.
 * Bertindak sebagai Information Expert untuk aturan white-labeling.
 */
class ThemeManagerService {
    // Regex untuk memvalidasi warna hex (3 atau 6 karakter)
    private readonly hexRegex = /^#([0-9A-F]{3}){1,2}$/i;

    /**
     * Menyesuaikan format string menjadi format Hex yang valid
     */
    private normalizeHex(color: string): string {
        const hex = color.startsWith('#') ? color : `#${color}`;
        return hex.toUpperCase();
    }

    /**
     * Menginjeksi warna utama ke dalam CSS Variables root
     */
    public applyPrimaryColor(colorParam: string | null): void {
        if (!colorParam) return;

        const normalizedHex = this.normalizeHex(colorParam);

        if (this.hexRegex.test(normalizedHex)) {
            document.documentElement.style.setProperty('--theme-primary', normalizedHex);

            // Mengkalkulasi warna sekunder secara sederhana (opsional, untuk hover states)
            // Dalam sistem enterprise, Anda bisa menambahkan fungsi darken/lighten di sini
            document.documentElement.style.setProperty('--theme-secondary', normalizedHex);
        } else {
            console.warn(`[ThemeManager] Format warna tidak valid: ${colorParam}. Menggunakan fallback bawaan.`);
        }
    }

    // Ruang untuk ekspansi di masa depan (misal: font family, logo URL)
    public applyCustomFont(fontFamily: string | null): void {
        if (fontFamily) {
            document.documentElement.style.setProperty('--theme-font', fontFamily);
        }
    }
}

// Mengekspor sebagai Singleton
export const themeManager = new ThemeManagerService();