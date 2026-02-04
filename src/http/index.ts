import { HttpClient } from '@/http/core/http-client'
import type { AxiosRequestConfig } from 'axios'

// 自定义请求拦截处理函数
const customRequestOnFulfilled = (config: AxiosRequestConfig) => {
  try {
    const authStoreStr = localStorage.getItem('auth')
    if (authStoreStr) {
      const authState = JSON.parse(authStoreStr)
      if (authState && authState.token) {
        // Nacos 支持在 Header 中传递 accessToken
        config.headers = config.headers || {}
        config.headers.accessToken = authState.token
      }
    }
  } catch (e) {
    console.error('Failed to get token from storage', e)
  }
  return config
}

// 创建并导出 HttpClient 对象 api
export const api = new HttpClient({
  interceptor: {
    request: {
      onFulfilled: customRequestOnFulfilled,
    },
  },
})

// 导出 Axios 实例
export const instance = api.getInstance()
