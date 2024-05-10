import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
//import * as fs from 'node:fs'
//import * as path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifestFilename: 'manifest.json',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      workbox:{
        sourcemap: true,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Expoll',
        short_name: 'Expoll',
        theme_color: '#2c3e50',
        background_color: '#2c3e50',
        start_url: '/#/polls?version=' + process.env.VUE_APP_VERSION,
        icons: [],
        shortcuts: [
          {
            name: 'Poll list',
            short_name: 'Polls',
            description: 'List of all polls',
            url: '/#/polls'
          },
          {
            name: 'User info',
            short_name: 'User',
            description: 'User info',
            url: '/#/account'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '^/api': {
        target: 'http://localhost:6060',
        changeOrigin: true,
        ws: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '^/swagger': {
        target: 'http://localhost:6060',
        changeOrigin: true,
        ws: true,
        secure: false,
      }
    },
    host: '0.0.0.0',
    /*https: {
      cert: fs.readFileSync(path.resolve(__dirname, "local/certificate.pem")),
      key: fs.readFileSync(path.resolve(__dirname, "local/privateKey.pem"))
    },*/
    port: 8080
  }
})
