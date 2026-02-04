import type { ApiResp } from '../src/http/core/types'
import type { MockMethod } from 'vite-plugin-mock'

function success<T>(data: T): ApiResp<T> {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

const nodeList = [
  {
    address: '127.0.0.1:8848',
    state: 'UP',
    extendInfo: {
      version: '2.2.0',
      lastRefreshTime: Date.now(),
    },
    voteFor: '127.0.0.1:8848',
  },
  {
    address: '127.0.0.1:8849',
    state: 'UP',
    extendInfo: {
      version: '2.2.0',
      lastRefreshTime: Date.now(),
    },
    voteFor: '127.0.0.1:8848',
  },
]

const clusterMock: MockMethod[] = [
  // 集群节点列表查询
  {
    url: '/v1/core/cluster/nodes',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { pageNo = 1, pageSize = 10 } = query
      const pageNum = parseInt(pageNo)
      const size = parseInt(pageSize)
      const list = nodeList.slice((pageNum - 1) * size, pageNum * size)

      return success({
        count: nodeList.length,
        data: list,
      })
    },
  },
  // 节点下线
  {
    url: '/v1/core/cluster/server/leave',
    method: 'post',
    response: ({ body }: { body: string[] }) => {
      body.forEach(addr => {
        const node = nodeList.find(n => n.address === addr)
        if (node) node.state = 'DOWN'
      })
      return success(null)
    },
  },
]

export default clusterMock
