import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// The website calls the backend under /api. In development Vite proxies it to
// API_PROXY_TARGET (mahmya-back, default http://localhost:3001).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: { proxy: { '/api': { target: env.API_PROXY_TARGET || 'http://localhost:3001', changeOrigin: true } } },
  };
});
