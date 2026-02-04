import { api } from '@/http'
import type { AxiosRequestConfig } from 'axios'

/**
 * 权限实体
 */
export interface Permission {
  role: string
  resource: string
  action: string
}

/**
 * 权限列表查询参数
 */
export interface PermissionListReq {
  role?: string
  pageNo?: number
  pageSize?: number
  search?: 'blur' | 'accurate'
}

/**
 * 权限列表响应
 */
export interface PermissionListResp {
  totalCount: number
  pageNumber: number
  pagesAvailable: number
  pageItems: Permission[]
}

/**
 * 创建权限参数
 */
export interface PermissionCreateReq {
  role: string
  resource: string
  action: string
}

/**
 * 删除权限参数
 */
export interface PermissionDeleteReq {
  role: string
  resource: string
  action: string
}

/**
 * 权限管理 Service
 * 封装权限管理相关的 API 调用
 */
export class PermissionService {
  /**
   * 权限列表查询
   * @param params 查询参数
   * @returns 权限列表响应
   */
  async getList(params: PermissionListReq): Promise<PermissionListResp> {
    return await api.get<PermissionListResp>('/v1/auth/permissions', { params })
  }

  /**
   * 创建权限
   * @param params 创建参数
   */
  async create(params: PermissionCreateReq): Promise<void> {
    const formData = new URLSearchParams()
    formData.append('role', params.role)
    formData.append('resource', params.resource)
    formData.append('action', params.action)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    await api.post('/v1/auth/permissions', formData.toString(), config)
  }

  /**
   * 删除权限
   * @param params 删除参数
   */
  async delete(params: PermissionDeleteReq): Promise<void> {
    await api.delete('/v1/auth/permissions', {
      params,
    })
  }
}

// 导出单例
export const permissionService = new PermissionService()
