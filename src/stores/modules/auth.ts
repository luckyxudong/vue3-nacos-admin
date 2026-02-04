import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/auth-service'
import router from '@/router'
import { useMenuStore } from './menu'
import { useTabsStore } from './tabs'
import { api } from '@/http'

/**
 * 用户信息类型
 */
export interface UserInfo {
  username: string
}

/**
 * 认证 Store
 * 管理用户登录状态和用户信息
 */
export const useAuthStore = defineStore(
  'auth',
  () => {
    // 登录状态
    const isAuthenticated = ref<boolean>(false)

    // 用户信息
    const user = ref<UserInfo | null>(null)

    // Token
    const token = ref<string>('')

    /**
     * 登录
     * @param username 用户名
     * @param password 密码
     */
    const login = async (username: string, password: string) => {
      try {
        // 响应拦截器已经处理了 ApiResp 结构，直接返回 data 部分
        const data = await authService.login(username, password)
        if (data && data.accessToken && data.username) {
          isAuthenticated.value = true
          user.value = { username: data.username }
          token.value = data.accessToken
          return { success: true }
        } else {
          return { success: false, message: '登录失败：响应数据格式错误' }
        }
      } catch (error: any) {
        return {
          success: false,
          message: error?.message || error?.response?.data?.message || '登录失败，请稍后重试',
        }
      }
    }

    /**
     * 登出
     */
    const logout = () => {
      try {
        // 1. 取消所有进行中的 HTTP 请求
        api.cancelAll()

        // 2. 重置其他 Store 状态
        const menuStore = useMenuStore()
        const tabsStore = useTabsStore()
        menuStore.reset()
        tabsStore.reset()

        // 3. 清理 auth store 状态
        isAuthenticated.value = false
        user.value = null
        token.value = ''

        // 4. 清理 localStorage 中的 Pinia 持久化数据（保留 locale）
        localStorage.removeItem('auth')
        localStorage.removeItem('menu')
        localStorage.removeItem('tabs')
        // 注意：不删除 'locale'，保留用户语言偏好

        // 5. 路由跳转
        router.push('/login')
      } catch (error) {
        // 即使清理过程中出现错误，也要完成登出流程
        console.error('登出清理过程中出现错误:', error)
        // 确保基本状态被清理
        isAuthenticated.value = false
        user.value = null
        token.value = ''
        router.push('/login')
      }
    }

    return {
      isAuthenticated,
      user,
      token,
      login,
      logout,
    }
  },
  {
    persist: true,
  },
)
