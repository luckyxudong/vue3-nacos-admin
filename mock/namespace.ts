function success(data) {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

function error(message, code = 400) {
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
  // 命名空间列表查询
  {
    url: '/v1/console/namespaces',
    method: 'get',
    response: () => {
      return success(namespaces)
    },
  },
  // 获取命名空间详情
  {
    url: '/v1/console/namespaces',
    method: 'get',
    params: { show: 'all' },
    response: ({ query }) => {
      const { namespaceId } = query
      const ns = namespaces.find(item => item.namespace === namespaceId)
      if (ns) {
        return success(ns)
      }
      return error('命名空间不存在', 404)
    },
  },
  // 创建命名空间
  {
    url: '/v1/console/namespaces',
    method: 'post',
    response: ({ body }) => {
      const { namespaceId, namespaceShowName, namespaceDesc } = body
      const id = namespaceId || `NS-${Math.random().toString(36).substr(2, 9)}`
      if (namespaces.some(item => item.namespace === id)) {
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
    response: ({ body }) => {
      const { namespaceId, namespaceShowName, namespaceDesc } = body
      const ns = namespaces.find(item => item.namespace === namespaceId)
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
    response: ({ query }) => {
      const { namespaceId } = query
      const index = namespaces.findIndex(item => item.namespace === namespaceId)
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
    response: ({ query }) => {
      const { customNamespaceId } = query
      return namespaces.some(item => item.namespace === customNamespaceId)
    },
  },
]
