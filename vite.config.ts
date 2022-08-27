import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3002,
    // proxy: {
    //   api: {
    //     target: 'http://43.138.26.158:3000',
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/api/, '')
    //   },
    // },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/theme/style.scss";`
      }
    }
  }
});
