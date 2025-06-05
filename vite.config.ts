import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@reduxjs/toolkit')) {
              return 'vendor-rtk';
            }
            if (id.includes('lucide-react') || id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('date-fns') || id.includes('sonner')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
          
          // Admin pages
          if (id.includes('src/pages/admin')) {
            return 'admin';
          }
          
          // User pages
          if (id.includes('src/pages/orders') || 
              id.includes('src/pages/product/cart') ||
              id.includes('src/pages/payment') ||
              id.includes('src/pages/profile')) {
            return 'user';
          }
        },
      },
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
