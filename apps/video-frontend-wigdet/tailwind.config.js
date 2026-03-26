/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--theme-primary)',
                secondary: 'var(--theme-secondary)',
                surface: 'var(--theme-surface)',
                background: 'var(--theme-background)',
                textHighlight: 'var(--theme-text)',
            },
            fontFamily: {
                // Jika Anda ingin mengekspansi white-labeling hingga ke level typography
                sans: ['var(--theme-font)', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            }
        },
    },
    plugins: [],
}