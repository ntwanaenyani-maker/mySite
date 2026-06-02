import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      jsxImportSource: 'react',
    }),
    // Gzip compression for smaller bundle sizes
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Support for older browsers
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  
  // Build optimization
  build: {
    // Modern output for smaller bundle
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['react-bootstrap', 'bootstrap', 'bootstrap-icons'],
          'carousel': ['react-slick', 'slick-carousel'],
          'email': ['@emailjs/browser'],
        },
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]',
      },
    },
    // Disable source maps in production to reduce bundle
    sourcemap: false,
    // Report compressed size
    reportCompressedSize: true,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },

  // Server optimization
  server: {
    middlewareMode: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },

  // Performance hints
  ssr: false,
})
