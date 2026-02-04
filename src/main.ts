import { createApp } from 'vue'

import App from './App.vue'
import { installRouter } from '@/router'
import { installPinia } from '@/stores'
import { installAssets } from '@/plugins/assets'
import { Env } from '@/utils/env'
import { installI18n } from '@/i18n'

// 获取当前模式（用于调试）
const currentMode = import.meta.env.MODE
console.log('当前模式:', currentMode)

// 环境变量使用示例
console.log('应用名称:', Env.get('VITE_APP_NAME'))
console.log('当前环境:', Env.env)
console.log('是否为开发环境:', Env.isDev)

async function bootstrap() {
  // 在生产环境中且开启 Mock 时，初始化 Mock 服务器
  if (import.meta.env.PROD && import.meta.env.VITE_USE_MOCK === 'true') {
    const { setupProdMockServer } = await import('./mockProdServer')
    setupProdMockServer()
  }

  const app = createApp(App)
  installAssets()
  installPinia(app)
  installI18n(app)
  installRouter(app)
  app.mount('#app')
}

bootstrap()
