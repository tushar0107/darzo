import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    host: '0.0.0.0', // This allows serving on your local IP address
    https: {
      key: fs.readFileSync('./.cert/localhost+1-key.pem'),
      cert: fs.readFileSync('./.cert/localhost+1.pem'),
    }
  }
})
