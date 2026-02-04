import Mock from 'mockjs'
import type { ApiResp } from '../src/http/core/types'
import type { MockMethod } from 'vite-plugin-mock'

function success<T>(data: T): ApiResp<T> {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

function error(message: string): ApiResp<null> {
  return {
    code: 500,
    message,
    data: null,
  }
}

const demoList = Mock.mock({
  'list|100': [
    {
      'id|+1': 1,
      title: '@ctitle(5, 10)',
      author: '@cname',
      createdAt: '@datetime',
    },
  ],
}).list

const demoMock: MockMethod[] = [
  {
    url: '/v1/demo/list',
    method: 'get',
    response: () => {
      return success(demoList)
    },
  },
  {
    url: '/v1/demo/detail',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const index = demoList.findIndex((item: any) => item.id === parseInt(query.id || '0'))
      if (index !== -1) {
        return success(demoList[index])
      } else {
        return error('Item not found')
      }
    },
  },
]

export default demoMock
