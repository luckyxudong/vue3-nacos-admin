import type { ApiResp } from '../src/http/core/types'
import type { MockMethod } from 'vite-plugin-mock'

function success<T>(data: T): ApiResp<T> {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

const systemMocks: MockMethod[] = [
  // 系统状态查询
  {
    url: '/v1/console/server/state',
    method: 'get',
    response: () => {
      return success({
        version: 'Nacos 2.2.0',
        standalone_mode: 'true',
        function_mode: 'All',
        login_page_enabled: 'true',
        auth_enabled: 'true',
        console_ui_enabled: 'true',
        auth_admin_request: 'true',
        startup_mode: 'standalone',
        config_retention_days: 30,
      })
    },
  },
  // 系统引导信息
  {
    url: '/v1/console/server/guide',
    method: 'get',
    response: () => {
      return success({
        data: 'Welcome to Nova Admin',
      })
    },
  },
  // 系统公告
  {
    url: '/v1/console/server/announcement',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { language = 'zh-CN' } = query
      if (language === 'zh-CN') {
        return success('欢迎使用 Nova Admin 控制台')
      }
      return success('Welcome to Nova Admin Console')
    },
  },
]

export default systemMocks
