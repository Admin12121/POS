import path from "path"
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    logOverride: { 'ts(6133)': 'silent' }, // Suppress unused variable warnings
  },
  server: {
    host: true, // This will expose the server to the network
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
