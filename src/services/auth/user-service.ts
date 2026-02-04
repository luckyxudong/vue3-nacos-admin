import { api } from '@/http'
import type { AxiosRequestConfig } from 'axios'

/**
 * 用户实体
 */
export interface User {
  username: string
  password?: string
}

/**
 * 用户列表查询参数
 */
export interface UserListReq {
  pageNo?: number
  pageSize?: number
  username?: string
  search?: 'blur' | 'accurate'
}

/**
 * 用户列表响应
 */
export interface UserListResp {
  totalCount: number
  pageNumber: number
  pagesAvailable: number
  pageItems: User[]
}

/**
 * 创建用户参数
 */
export interface UserCreateReq {
  username: string
  password: string
}

/**
 * 搜索用户参数
 */
export interface UserSearchReq {
  username: string
}

/**
 * 删除用户参数
 */
export interface UserDeleteReq {
  username: string
}

/**
 * 重置密码参数
 */
export interface UserResetPasswordReq {
  username: string
  newPassword: string
}

/**
 * 用户管理 Service
 * 封装用户管理相关的 API 调用
 */
export class UserService {
  /**
   * 用户列表查询
   * @param params 查询参数
   * @returns 用户列表响应
   */
  async getList(params: UserListReq): Promise<UserListResp> {
    return await api.get<UserListResp>('/v1/auth/users', { params })
  }

  /**
   * 创建用户
   * @param params 创建参数
   */
  async create(params: UserCreateReq): Promise<void> {
    const formData = new URLSearchParams()
    formData.append('username', params.username)
    formData.append('password', params.password)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    await api.post('/v1/auth/users', formData.toString(), config)
  }

  /**
   * 搜索用户
   * @param params 搜索参数
   * @returns 用户信息
   */
  async search(params: UserSearchReq): Promise<User> {
    return await api.get<User>('/v1/auth/users/search', { params })
  }

  /**
   * 删除用户
   * @param params 删除参数
   */
  async delete(params: UserDeleteReq): Promise<void> {
    await api.delete('/v1/auth/users', {
      params,
    })
  }

  /**
   * 重置密码
   * @param params 重置密码参数
   */
  async resetPassword(params: UserResetPasswordReq): Promise<void> {
    const formData = new URLSearchParams()
    formData.append('username', params.username)
    formData.append('newPassword', params.newPassword)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    await api.put('/v1/auth/users', formData.toString(), config)
  }
}

// 导出单例
export const userService = new UserService()
