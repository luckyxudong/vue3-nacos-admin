function success(data: any) {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

function error(message: any, code = 400) {
  return {
    code,
    message,
    data: null,
  }
}

// 命名空间初始数据
const namespaces = [
  {
    namespace: '',
    namespaceShowName: 'public',
    namespaceDesc: 'Public namespace for default configurations',
    type: 0,
    configCount: 11,
    quota: 188,
  },
  {
    namespace: 'DEV-eaekahth-112233',
    namespaceShowName: 'DEV-eaekahth',
    namespaceDesc: 'Development environment for team A',
    type: 1,
    configCount: 37,
    quota: 411,
  },
  {
    namespace: 'PROD-xyz-789',
    namespaceShowName: 'PROD-xyz',
    namespaceDesc: 'Production environment',
    type: 2,
    configCount: 88,
    quota: 895,
  },
]

export default [
  // 命名空间 GET 请求处理 (列表、详情、检查存在)
  {
    url: '/v1/console/namespaces',
    method: 'get',
    response: (request: any) => {
      const { query } = request
      const { show, namespaceId, checkNamespaceIdExist, customNamespaceId } = query

      console.log('Mock Namespace GET Request:', { query })

      // 1. 检查是否存在
      if (checkNamespaceIdExist === 'true' || checkNamespaceIdExist === true) {
        return namespaces.some((item: any) => item.namespace === customNamespaceId)
      }

      // 2. 获取详情
      if (show === 'all' && namespaceId !== undefined) {
        const ns = namespaces.find((item: any) => item.namespace === namespaceId)
        if (ns) {
          return success(ns)
        }
        return error('命名空间不存在', 404)
      }

      // 3. 默认返回列表
      return success(namespaces)
    },
  },
  // 创建命名空间
  {
    url: '/v1/console/namespaces',
    method: 'post',
    response: ({ body }: any) => {
      const { namespaceId, namespaceShowName, namespaceDesc } = body
      const id = namespaceId || `NS-${Math.random().toString(36).substr(2, 9)}`
      if (namespaces.some((item: any) => item.namespace === id)) {
        return error('命名空间 ID 已存在')
      }
      namespaces.push({
        namespace: id,
        namespaceShowName,
        namespaceDesc,
        type: 2,
        configCount: 0,
        quota: 200,
      })
      return success(null)
    },
  },
  // 编辑命名空间
  {
    url: '/v1/console/namespaces',
    method: 'put',
    response: ({ body }: any) => {
      const { namespaceId, namespaceShowName, namespaceDesc } = body
      const ns = namespaces.find((item: any) => item.namespace === namespaceId)
      if (ns) {
        ns.namespaceShowName = namespaceShowName
        ns.namespaceDesc = namespaceDesc
        return success(null)
      }
      return error('命名空间不存在', 404)
    },
  },
  // 删除命名空间
  {
    url: '/v1/console/namespaces',
    method: 'delete',
    response: ({ query }: any) => {
      const { namespaceId } = query
      const index = namespaces.findIndex((item: any) => item.namespace === namespaceId)
      if (index !== -1) {
        namespaces.splice(index, 1)
        return success(null)
      }
      return error('命名空间不存在', 404)
    },
  },
  // 检查命名空间 ID 是否存在
  {
    url: '/v1/console/namespaces',
    method: 'get',
    params: { checkNamespaceIdExist: true },
    response: ({ query }: any) => {
      const { customNamespaceId } = query
      return namespaces.some((item: any) => item.namespace === customNamespaceId)
    },
  },
]
