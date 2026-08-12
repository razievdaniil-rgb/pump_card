import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    base: '/pump_card/card/',
    plugins: [react()],
    build: {
        outDir: 'demo-dist/card',
        emptyOutDir: false,
        target: 'es2020',
        cssCodeSplit: false,
        rollupOptions: { output: { entryFileNames: 'apgs-product-card.js', assetFileNames: 'apgs-product-card.[ext]' } },
    },
});
