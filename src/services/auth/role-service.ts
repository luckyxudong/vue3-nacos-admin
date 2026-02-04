import { api } from '@/http'
import type { AxiosRequestConfig } from 'axios'

/**
 * 角色实体
 */
export interface Role {
  role: string
  username: string
}

/**
 * 角色列表查询参数
 */
export interface RoleListReq {
  pageNo?: number
  pageSize?: number
  username?: string
  role?: string
  search?: 'blur' | 'accurate'
}

/**
 * 角色列表响应
 */
export interface RoleListResp {
  totalCount: number
  pageNumber: number
  pagesAvailable: number
  pageItems: Role[]
}

/**
 * 搜索角色参数
 */
export interface RoleSearchReq {
  role: string
}

/**
 * 创建角色参数
 */
export interface RoleCreateReq {
  role: string
  username: string
}

/**
 * 删除角色参数
 */
export interface RoleDeleteReq {
  role: string
  username: string
}

/**
 * 角色管理 Service
 * 封装角色管理相关的 API 调用
 */
export class RoleService {
  /**
   * 角色列表查询
   * @param params 查询参数
   * @returns 角色列表响应
   */
  async getList(params: RoleListReq): Promise<RoleListResp> {
    return await api.get<RoleListResp>('/v1/auth/roles', { params })
  }

  /**
   * 搜索角色
   * @param params 搜索参数
   * @returns 角色信息
   */
  async search(params: RoleSearchReq): Promise<Role> {
    return await api.get<Role>('/v1/auth/roles/search', { params })
  }

  /**
   * 创建角色
   * @param params 创建参数
   */
  async create(params: RoleCreateReq): Promise<void> {
    const formData = new URLSearchParams()
    formData.append('role', params.role)
    formData.append('username', params.username)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    await api.post('/v1/auth/roles', formData.toString(), config)
  }

  /**
   * 删除角色
   * @param params 删除参数
   */
  async delete(params: RoleDeleteReq): Promise<void> {
    await api.delete('/v1/auth/roles', {
      params,
    })
  }
}

// 导出单例
export const roleService = new RoleService()
