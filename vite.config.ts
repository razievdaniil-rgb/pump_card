import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pump_card/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'apgs-product-card.js',
        assetFileNames: 'apgs-product-card.[ext]',
      },
    },
  },
});
