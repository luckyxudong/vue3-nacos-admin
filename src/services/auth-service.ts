import { api } from '@/http'
import type { AxiosRequestConfig } from 'axios'

/**
 * 登录请求参数
 */
export interface LoginReq {
  username: string
  password: string
}

/**
 * 登录响应数据
 */
export interface LoginResp {
  accessToken: string
  username: string
}

/**
 * 认证 Service
 * 封装登录相关的 API 调用
 */
export class AuthService {
  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns 登录响应数据（响应拦截器已处理，直接返回 data 部分）
   */
  async login(username: string, password: string): Promise<LoginResp> {
    // 使用表单格式请求
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    return await api.post<LoginResp>('/v1/auth/users/login', params.toString(), config)
  }
}

// 导出单例
export const authService = new AuthService()
