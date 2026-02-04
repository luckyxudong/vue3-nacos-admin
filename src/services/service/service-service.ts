import { api } from '@/http'

/**
 * 服务实体
 */
export interface Service {
  name: string
  groupName: string
  clusterCount?: number
  ipCount?: number
  healthyInstanceCount?: number
  triggerFlag?: string
}

/**
 * 服务列表查询参数
 */
export interface ServiceListReq {
  serviceNameParam?: string
  groupNameParam?: string
  pageNo?: number
  pageSize?: number
  hasIpCount?: boolean
  withInstances?: boolean
}

/**
 * 服务列表响应
 */
export interface ServiceListResp {
  count: number
  serviceList: Service[]
}

/**
 * 删除服务参数
 */
export interface ServiceDeleteReq {
  serviceName: string
  groupName: string
}

/**
 * 服务管理 Service
 * 封装服务管理相关的 API 调用
 */
export class ServiceService {
  /**
   * 服务列表查询
   * @param params 查询参数
   * @returns 服务列表响应
   */
  async getList(params: ServiceListReq): Promise<ServiceListResp> {
    return await api.get<ServiceListResp>('/v1/ns/catalog/services', { params })
  }

  /**
   * 删除服务
   * @param params 删除参数
   */
  async delete(params: ServiceDeleteReq): Promise<void> {
    await api.delete('/v1/ns/service', {
      params,
    })
  }
}

// 导出单例
export const serviceService = new ServiceService()
