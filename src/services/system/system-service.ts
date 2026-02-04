import { api } from '@/http'

/**
 * 系统状态实体
 */
export interface SystemState {
  version?: string
  standalone_mode?: string
  function_mode?: string
  login_page_enabled?: string
  auth_enabled?: string
  console_ui_enabled?: string
  auth_admin_request?: string
  startup_mode?: string
  config_retention_days?: number
}

/**
 * 系统引导信息响应
 */
export interface SystemGuideResp {
  data: string
}

/**
 * 系统公告查询参数
 */
export interface SystemAnnouncementReq {
  language: 'zh-CN' | 'en-US'
}

/**
 * 系统状态 Service
 * 封装系统状态相关的 API 调用
 */
export class SystemService {
  /**
   * 系统状态查询
   * @returns 系统状态
   */
  async getState(): Promise<SystemState> {
    return await api.get<SystemState>('/v1/console/server/state')
  }

  /**
   * 系统引导信息
   * @returns 系统引导信息
   */
  async getGuide(): Promise<SystemGuideResp> {
    return await api.get<SystemGuideResp>('/v1/console/server/guide')
  }

  /**
   * 系统公告
   * @param params 查询参数
   * @returns 系统公告内容
   */
  async getAnnouncement(params: SystemAnnouncementReq): Promise<string> {
    return await api.get<string>('/v1/console/server/announcement', { params })
  }
}

// 导出单例
export const systemService = new SystemService()
