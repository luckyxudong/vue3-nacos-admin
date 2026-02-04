import { api } from '@/http'
import type { AxiosRequestConfig } from 'axios'

/**
 * 命名空间实体
 */
export interface Namespace {
  namespace: string
  namespaceShowName: string
  namespaceDesc?: string
  type?: number
  configCount?: number
  quota?: number
}

/**
 * 命名空间列表响应
 */
export interface NamespaceListResp {
  code: number
  data: Namespace[]
}

/**
 * 获取命名空间详情参数
 */
export interface NamespaceDetailReq {
  namespaceId: string
}

/**
 * 创建命名空间参数
 */
export interface NamespaceCreateReq {
  namespaceId?: string
  namespaceShowName: string
  namespaceDesc?: string
}

/**
 * 编辑命名空间参数
 */
export interface NamespaceEditReq {
  namespaceId: string
  namespaceShowName: string
  namespaceDesc?: string
}

/**
 * 删除命名空间参数
 */
export interface NamespaceDeleteReq {
  namespaceId: string
}

/**
 * 命名空间管理 Service
 * 封装命名空间管理相关的 API 调用
 */
export class NamespaceService {
  /**
   * 命名空间列表查询
   * @param params 查询参数
   * @returns 命名空间列表
   */
  async getList(params?: { namespaceId?: string }): Promise<Namespace[]> {
    return await api.get<Namespace[]>('/v1/console/namespaces', { params })
  }

  /**
   * 获取命名空间详情
   * @param params 查询参数
   * @returns 命名空间详情
   */
  async getDetail(params: NamespaceDetailReq): Promise<Namespace> {
    return await api.get<Namespace>('/v1/console/namespaces', {
      params: {
        ...params,
        show: 'all',
      },
    })
  }

  /**
   * 创建命名空间
   * @param params 创建参数
   */
  async create(params: NamespaceCreateReq): Promise<void> {
    const formData = new URLSearchParams()
    formData.append('customNamespaceId', params.namespaceId || '')
    formData.append('namespaceId', params.namespaceId || '')
    formData.append('namespaceName', params.namespaceShowName)
    if (params.namespaceDesc) formData.append('namespaceDesc', params.namespaceDesc)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    await api.post('/v1/console/namespaces', formData.toString(), config)
  }

  /**
   * 编辑命名空间
   * @param params 编辑参数
   */
  async edit(params: NamespaceEditReq): Promise<void> {
    const formData = new URLSearchParams()
    formData.append('namespaceId', params.namespaceId)
    formData.append('namespace', params.namespaceId)
    formData.append('namespaceShowName', params.namespaceShowName)
    if (params.namespaceDesc) formData.append('namespaceDesc', params.namespaceDesc)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    await api.put('/v1/console/namespaces', formData.toString(), config)
  }

  /**
   * 删除命名空间
   * @param params 删除参数
   */
  async delete(params: NamespaceDeleteReq): Promise<void> {
    await api.delete('/v1/console/namespaces', {
      params,
    })
  }

  /**
   * 检查命名空间 ID 是否已存在
   * @param namespaceId 命名空间 ID
   * @returns 是否存在
   */
  async checkIdExist(namespaceId: string): Promise<boolean> {
    return await api.get<boolean>('/v1/console/namespaces', {
      params: {
        checkNamespaceIdExist: true,
        customNamespaceId: namespaceId,
      },
    })
  }
}

// 导出单例
export const namespaceService = new NamespaceService()
