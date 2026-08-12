import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({root:import.meta.dirname,base:'/pump_card/pumpselect/',plugins:[react()],build:{outDir:'../demo-dist/pumpselect',emptyOutDir:false,target:'es2020',cssCodeSplit:false,rollupOptions:{output:{entryFileNames:'apgs-pump-selector.js',assetFileNames:'apgs-pump-selector.[ext]'}}}});