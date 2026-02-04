import { api } from '@/http'
import type { AxiosRequestConfig } from 'axios'

/**
 * 配置实体
 */
export interface Config {
  id: number
  dataId: string
  group: string
  appName?: string
  content?: string
  type?: string
  md5?: string
  desc?: string
  configTags?: string
}

/**
 * 配置列表查询参数
 */
export interface ConfigListReq {
  dataId?: string
  group?: string
  appName?: string
  config_tags?: string
  config_detail?: string
  types?: string
  pageNo?: number
  pageSize?: number
  tenant?: string
  search?: 'blur' | 'accurate'
  username?: string
}

/**
 * 配置列表响应
 */
export interface ConfigListResp {
  pageItems: Config[]
  totalCount: number
  pageNumber: number
  pagesAvailable: number
}

/**
 * 配置详情查询参数
 */
export interface ConfigDetailReq {
  dataId: string
  group: string
  tenant?: string
  namespaceId?: string
}

/**
 * 创建/更新配置参数
 */
export interface ConfigCreateReq {
  dataId: string
  group: string
  content: string
  appName?: string
  desc?: string
  config_tags?: string
  type?: string
  tenant?: string
  md5?: string
}

/**
 * 删除配置参数
 */
export interface ConfigDeleteReq {
  dataId: string
  group: string
}

/**
 * 批量删除配置参数
 */
export interface ConfigBatchDeleteReq {
  ids: string // 逗号分隔的 ID 列表
  tenant: string
}

/**
 * 配置历史实体
 */
export interface ConfigHistory {
  id: number
  dataId: string
  group: string
  srcUser?: string
  opType?: string
  md5?: string
  lastModifiedTime?: number
}

/**
 * 配置历史列表查询参数
 */
export interface ConfigHistoryListReq {
  dataId: string
  group: string
  pageNo?: number
  pageSize?: number
  search?: string
}

/**
 * 配置历史列表响应
 */
export interface ConfigHistoryListResp {
  pageItems: ConfigHistory[]
  totalCount: number
  pageNumber: number
}

/**
 * 获取历史配置详情参数
 */
export interface ConfigHistoryDetailReq {
  dataId: string
  group: string
  nid: string
}

/**
 * 配置回滚参数
 */
export interface ConfigRollbackReq {
  dataId: string
  group: string
  content: string
  appName?: string
  tenant?: string
}

/**
 * 配置监听查询响应
 */
export interface ConfigListenerResp {
  collectStatus: number
  lisentersGroupkeyStatus: Record<string, string> // ip:port -> md5值
}

/**
 * 监听查询（按配置）参数
 */
export interface ConfigListenerByConfigReq {
  dataId: string
  group: string
  tenant?: string
  namespaceId?: string
}

/**
 * 监听查询（按 IP）参数
 */
export interface ConfigListenerByIpReq {
  ip: string
  tenant?: string
  namespaceId?: string
}

/**
 * 导出配置参数
 */
export interface ConfigExportReq {
  tenant?: string
  group?: string
  appName?: string
  dataId?: string
  ids?: string // 逗号分隔的配置 ID 列表
}

/**
 * 导入配置参数
 */
export interface ConfigImportReq {
  file: File
  policy: 'ABORT' | 'SKIP' | 'OVERWRITE'
  tenant: string
  namespace: string
}

/**
 * 克隆配置项
 */
export interface ConfigCloneItem {
  cfgId: number
  dataId: string
  group: string
}

/**
 * 克隆配置参数
 */
export interface ConfigCloneReq {
  configs: ConfigCloneItem[]
  tenant: string
  policy: string
  namespaceId?: string
}

/**
 * 配置管理 Service
 * 封装配置管理相关的 API 调用
 */
export class ConfigService {
  /**
   * 配置列表查询
   * @param params 查询参数
   * @returns 配置列表响应
   */
  async getList(params: ConfigListReq): Promise<ConfigListResp> {
    return await api.get<ConfigListResp>('/v1/cs/configs', { params })
  }

  /**
   * 获取单个配置详情
   * @param params 查询参数
   * @returns 配置详情
   */
  async getDetail(params: ConfigDetailReq): Promise<Config> {
    return await api.get<Config>('/v1/cs/configs', {
      params: {
        ...params,
        show: 'all',
      },
    })
  }

  /**
   * 创建/更新配置
   * @param params 配置参数
   * @returns 配置详情
   */
  async createOrUpdate(params: ConfigCreateReq): Promise<Config> {
    const formData = new URLSearchParams()
    formData.append('dataId', params.dataId)
    formData.append('group', params.group)
    formData.append('content', params.content)
    if (params.appName) formData.append('appName', params.appName)
    if (params.desc) formData.append('desc', params.desc)
    if (params.config_tags) formData.append('config_tags', params.config_tags)
    if (params.type) formData.append('type', params.type)
    if (params.tenant) formData.append('tenant', params.tenant)

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }

    if (params.md5) {
      config.headers = config.headers || {}
      // Nacos CAS 更新需要传递 casMd5 请求头
      config.headers['Cas-Md5'] = params.md5
    }

    return await api.post<Config>('/v1/cs/configs', formData.toString(), config)
  }

  /**
   * 删除配置
   * @param params 删除参数
   */
  async delete(params: ConfigDeleteReq): Promise<void> {
    await api.delete('/v1/cs/configs', {
      params,
    })
  }

  /**
   * 批量删除配置
   * @param params 批量删除参数
   */
  async batchDelete(params: ConfigBatchDeleteReq): Promise<void> {
    await api.delete('/v1/cs/configs', {
      params: {
        ...params,
        delType: 'ids',
      },
    })
  }

  /**
   * 配置历史列表
   * @param params 查询参数
   * @returns 配置历史列表响应
   */
  async getHistoryList(params: ConfigHistoryListReq): Promise<ConfigHistoryListResp> {
    return await api.get<ConfigHistoryListResp>('/v1/cs/history', { params })
  }

  /**
   * 获取历史配置详情
   * @param params 查询参数
   * @returns 历史配置详情
   */
  async getHistoryDetail(params: ConfigHistoryDetailReq): Promise<Config> {
    return await api.get<Config>('/v1/cs/history', { params })
  }

  /**
   * 配置历史列表（所有有历史的配置）
   * @param tenant 命名空间 ID
   * @returns 配置列表
   */
  async getHistoryConfigs(tenant?: string): Promise<Config[]> {
    return await api.get<Config[]>('/v1/cs/history/configs', {
      params: tenant ? { tenant } : undefined,
    })
  }

  /**
   * 配置回滚
   * @param params 回滚参数
   * @param opType 原操作类型：I(INSERT) 使用 DELETE，U/D(UPDATE/DELETE) 使用 POST
   */
  async rollback(params: ConfigRollbackReq, opType: string): Promise<void> {
    const isInsert = opType.trim() === 'I'

    if (isInsert) {
      // 插入类型的回滚是删除该配置
      await api.delete('/v1/cs/configs', {
        params: {
          dataId: params.dataId,
          group: params.group,
          tenant: params.tenant,
        },
      })
    } else {
      // 更新/删除类型的回滚是重新发布配置内容
      const formData = new URLSearchParams()
      formData.append('dataId', params.dataId)
      formData.append('group', params.group)
      formData.append('content', params.content)
      if (params.appName) formData.append('appName', params.appName)
      if (params.tenant) formData.append('tenant', params.tenant)

      await api.post('/v1/cs/configs', formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    }
  }

  /**
   * 监听查询（按配置查询）
   * @param params 查询参数
   * @returns 监听查询响应
   */
  async getListenerByConfig(params: ConfigListenerByConfigReq): Promise<ConfigListenerResp> {
    return await api.get<ConfigListenerResp>('/v1/cs/configs/listener', { params })
  }

  /**
   * 监听查询（按 IP 查询）
   * @param params 查询参数
   * @returns 监听查询响应
   */
  async getListenerByIp(params: ConfigListenerByIpReq): Promise<ConfigListenerResp> {
    return await api.get<ConfigListenerResp>('/v1/cs/listener', { params })
  }

  /**
   * 导出配置
   * @param params 导出参数
   * @param v2 是否使用 V2 接口
   * @returns Blob 文件数据
   */
  async export(params: ConfigExportReq, v2 = false): Promise<Blob> {
    const queryParams: any = { ...params }
    if (v2) {
      queryParams.exportV2 = 'true'
    } else {
      queryParams.export = 'true'
    }
    return await api.get<Blob>('/v1/cs/configs', {
      params: queryParams,
      responseType: 'blob',
    })
  }

  /**
   * 导入配置
   * @param params 导入参数
   */
  async import(params: ConfigImportReq & { username?: string }): Promise<any> {
    const formData = new FormData()
    if (params.file) {
      formData.append('file', params.file)
    }
    formData.append('policy', params.policy)

    return await api.post('/v1/cs/configs', formData, {
      params: {
        import: 'true',
        namespace: params.namespace,
        tenant: params.tenant,
        username: params.username,
        policy: params.policy,
      },
      headers: {
        // 关键：设置为 undefined 让 axios 自动根据 FormData 设置 Content-Type 和 boundary
        'Content-Type': undefined,
      },
    })
  }

  /**
   * 克隆配置
   * @param params 克隆参数
   */
  async clone(params: ConfigCloneReq): Promise<void> {
    await api.post(
      '/v1/cs/configs',
      params.configs,
      {
        params: {
          clone: 'true',
          tenant: params.tenant,
          policy: params.policy,
          namespaceId: params.namespaceId,
        },
      },
    )
  }
}

// 导出单例
export const configService = new ConfigService()
