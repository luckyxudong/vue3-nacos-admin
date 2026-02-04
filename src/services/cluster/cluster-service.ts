import { api } from '@/http'

/**
 * 集群节点实体
 */
export interface ClusterNode {
  address: string
  state?: string
  extendInfo?: Record<string, any>
  voteFor?: string
}

/**
 * 集群节点列表查询参数
 */
export interface ClusterNodeListReq {
  pageNo?: number
  pageSize?: number
  keyword?: string
  withInstances?: boolean
  namespaceId?: string
}

/**
 * 集群节点列表响应 (支持直接返回数组或带 count 的对象)
 */
export type ClusterNodeListResp = ClusterNode[] | {
  count: number
  data: ClusterNode[]
}

/**
 * 节点下线参数
 */
export interface ClusterNodeLeaveReq {
  nodes: string[] // ip:port 数组
}

/**
 * 集群管理 Service
 * 封装集群管理相关的 API 调用
 */
export class ClusterService {
  /**
   * 集群节点列表查询
   * @param params 查询参数
   * @returns 集群节点列表响应
   */
  async getNodeList(params: ClusterNodeListReq): Promise<ClusterNodeListResp> {
    const query = {
      withInstances: false,
      ...params,
    }
    return await api.get<ClusterNodeListResp>('/v1/core/cluster/nodes', { params: query })
  }

  /**
   * 节点下线
   * @param params 下线参数
   */
  async leave(params: ClusterNodeLeaveReq): Promise<void> {
    await api.post('/v1/core/cluster/server/leave', params.nodes)
  }
}

// 导出单例
export const clusterService = new ClusterService()
