import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

// 创建 Pinia 实例
const pinia = createPinia()

// 配置持久化插件
pinia.use(
  createPersistedState({
    // 全局持久化配置
    storage: localStorage,
    // 可以在这里配置其他全局选项
  }),
)

/**
 * 安装 Pinia
 * @param app Vue 应用实例
 */
export const installPinia = (app: App) => {
  app.use(pinia)
}

// 导出 Pinia 实例，方便在组件中直接使用
export default pinia

// 导出类型，方便在其他文件中使用
export * from 'pinia'

// 导出所有 store 模块（模块化注册）
// 使用时：import { useDemoStore, useAuthStore } from '@/stores'
export * from './modules/user'
export * from './modules/auth'
export * from './modules/menu'
export * from './modules/tabs'