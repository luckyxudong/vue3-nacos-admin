import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Layouts from 'vite-plugin-vue-layouts'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Vite Mode:', mode)
  console.log('VITE_USE_MOCK:', env.VITE_USE_MOCK)
  return {
    plugins: [
      VueRouter({}),
      // ⚠️ Vue must be placed after VueRouter()
      vue(),
      vueJsx(),
      vueDevTools(),
      vueI18n({
        include: path.resolve(fileURLToPath(new URL('./src/i18n/locales', import.meta.url)), '**'),
        runtimeOnly: false,
        compositionOnly: true,
        fullInstall: true,
      }),
      UnoCSS(),
      // 配置 SVG 图标插件
      createSvgIconsPlugin({
        // SVG 图标目录
        iconDirs: [fileURLToPath(new URL('./src/assets/icons', import.meta.url))],
        // 生成的 symbol ID 格式
        symbolId: 'icon-[dir]-[name]',
      }),
      // 配置布局插件
      Layouts({
        layoutsDirs: 'src/layouts',
        defaultLayout: 'default',
      }),
      // 配置自动导入插件
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],
        imports: ['vue', VueRouterAutoImports, 'pinia', '@vueuse/core'],
      }),
      // 配置组件自动注册插件
      Components({
        deep: true,
        directoryAsNamespace: false,
      }),
      // 配置 Mock 插件
      viteMockServe({
        mockPath: 'mock',
        enable: env.VITE_USE_MOCK === 'true',
        logger: true,
      }),
    ],
    server: {
      port: 8000,
      open: true,
      host: true,
      proxy: {
        '/v1': {
          target: 'http://localhost:8848',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/v1/, '/nacos/v1'),
        },
        '/v2': {
          target: 'http://localhost:8848',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/v2/, '/nacos/v2'),
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      include: [
        'monaco-editor',
        'monaco-editor-vue3',
        'axios',
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        'vue-i18n',
      ],
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('monaco-editor')) {
                return 'monaco-vendor'
              }
              if (id.includes('codemirror')) {
                return 'codemirror-vendor'
              }
              return 'vendor'
            }
          },
        },
      },
    },
  }
})
