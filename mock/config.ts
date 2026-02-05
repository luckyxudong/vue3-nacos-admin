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

// 模拟配置数据
const configs: any[] = []

for (let i = 1; i <= 50; i++) {
  configs.push({
    id: i,
    dataId: `test-config-${i}`,
    group: i % 2 === 0 ? 'DEFAULT_GROUP' : 'DEV_GROUP',
    appName: i % 3 === 0 ? 'order-service' : 'user-service',
    type: i % 5 === 0 ? 'yaml' : 'properties',
    md5: `md5-${Math.random().toString(36).substr(2, 9)}`,
    content: i % 5 === 0 ? "server:\n  port: 8080" : "server.port=8080",
    desc: `Description for config ${i}`,
    configTags: i % 4 === 0 ? 'tag1,tag2' : '',
    tenant: i > 25 ? 'DEV-eaekahth-112233' : '',
  })
}

export default [
  // 配置列表查询
  {
    url: '/v1/cs/configs',
    method: 'get',
    response: ({ query }: any) => {
      // 如果带有 show=all，则是获取详情
      if (query.show === 'all') {
        const { dataId, group, tenant = '' } = query
        const cfg = configs.find((item: any) => item.dataId === dataId && item.group === group && item.tenant === tenant)
        if (cfg) return success(cfg)
        return error('配置不存在', 404)
      }

      // 如果带有 export=true，则是导出
      if (query.export === 'true') {
        return success("dummy-export-content")
      }

      const { dataId, group, tenant = '', pageNo = 1, pageSize = 10 } = query
      let filtered = configs.filter((item: any) => item.tenant === tenant)

      if (dataId) filtered = filtered.filter((item: any) => item.dataId.includes(dataId))
      if (group) filtered = filtered.filter((item: any) => item.group.includes(group))

      const totalCount = filtered.length
      const pageNum = parseInt(pageNo)
      const size = parseInt(pageSize)
      const pageItems = filtered.slice((pageNum - 1) * size, pageNum * size)

      return success({
        pageItems,
        totalCount,
        pageNumber: pageNum,
        pagesAvailable: Math.ceil(totalCount / size),
      })
    },
  },
  // 创建/更新配置
  {
    url: '/v1/cs/configs',
    method: 'post',
    response: ({ body, query }: any) => {
      // 克隆配置
      if (query && query.clone === 'true') {
        return success(true)
      }

      const { dataId, group, content, appName, desc, type, tenant = '' } = body
      const index = configs.findIndex((item: any) => item.dataId === dataId && item.group === group && item.tenant === tenant)

      if (index !== -1) {
        // 更新
        configs[index] = { ...configs[index], content, appName, desc, type, md5: `md5-${Date.now()}` }
      } else {
        // 创建
        configs.push({
          id: configs.length + 1,
          dataId,
          group,
          content,
          appName,
          desc,
          type: type || 'properties',
          tenant,
          md5: `md5-${Date.now()}`,
        })
      }
      return success(true)
    },
  },
  // 删除配置
  {
    url: '/v1/cs/configs',
    method: 'delete',
    response: ({ query }: any) => {
      const { dataId, group, tenant = '', delType, ids } = query
      if (delType === 'ids' && ids) {
        const idList = ids.split(',').map((id: string) => parseInt(id))
        idList.forEach((id: number) => {
          const index = configs.findIndex((item: any) => item.id === id)
          if (index !== -1) configs.splice(index, 1)
        })
        return success(true)
      }

      const index = configs.findIndex((item: any) => item.dataId === dataId && item.group === group && item.tenant === tenant)
      if (index !== -1) {
        configs.splice(index, 1)
        return success(true)
      }
      return error('配置不存在', 404)
    },
  },
]
