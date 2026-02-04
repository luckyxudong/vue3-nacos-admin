import type { ApiResp } from '../src/http/core/types'
import type { MockMethod } from 'vite-plugin-mock'

function success<T>(data: T): ApiResp<T> {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

function error(message: string, code: number = 400): ApiResp<null> {
  return {
    code,
    message,
    data: null,
  }
}

const serviceList: any[] = []
for (let i = 1; i <= 30; i++) {
  serviceList.push({
    name: `service-${i}`,
    groupName: i % 2 === 0 ? 'DEFAULT_GROUP' : 'DEV_GROUP',
    clusterCount: 1,
    ipCount: i % 5 + 1,
    healthyInstanceCount: i % 5 + 1,
    triggerFlag: 'false',
  })
}

const serviceMocks: MockMethod[] = [
  // 服务列表查询
  {
    url: '/v1/ns/catalog/services',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { serviceNameParam, groupNameParam, pageNo = 1, pageSize = 10 } = query
      let filtered = [...serviceList]
      
      if (serviceNameParam) filtered = filtered.filter(item => item.name.includes(serviceNameParam))
      if (groupNameParam) filtered = filtered.filter(item => item.groupName.includes(groupNameParam))

      const total = filtered.length
      const pageNum = parseInt(pageNo)
      const size = parseInt(pageSize)
      const list = filtered.slice((pageNum - 1) * size, pageNum * size)

      return success({
        count: total,
        serviceList: list,
      })
    },
  },
  // 删除服务
  {
    url: '/v1/ns/service',
    method: 'delete',
    response: ({ query }: { query: any }) => {
      const { serviceName, groupName } = query
      const index = serviceList.findIndex(item => item.name === serviceName && item.groupName === groupName)
      if (index !== -1) {
        serviceList.splice(index, 1)
        return success(true)
      }
      return error('服务不存在', 404)
    },
  },
]

export default serviceMocks
