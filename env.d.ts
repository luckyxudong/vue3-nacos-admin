/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />
/// <reference types="vite-plugin-vue-layouts/client" />
import './auto-imports.d.ts'
import './components.d.ts'

/**
 * 环境变量类型定义
 * 所有自定义环境变量必须以 VITE_ 前缀开头
 */
interface ImportMetaEnv {
  /** 应用名称 */
  readonly VITE_APP_NAME: string
  /** 当前环境：dev | uat | prod */
  readonly VITE_ENV: 'dev' | 'uat' | 'prod'
  /** 数字类型示例 */
  readonly VITE_NUMBER_DEMO?: string
  /** 布尔类型示例 */
  readonly VITE_BOOLEAN_DEMO?: string
  /** API 基础路径 */
  readonly VITE_API_BASE_URL?: string
  /** 是否开启 Mock */
  readonly VITE_USE_MOCK?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
