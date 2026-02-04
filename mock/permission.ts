import Mock from 'mockjs'
import type { ApiResp } from '../src/http/core/types'
import type { MockMethod } from 'vite-plugin-mock'

import { roleList } from './role'

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

// 生成权限列表数据
const permissionList: any[] = []

// 预置一些权限
permissionList.push({ role: 'ROLE_ADMIN', resource: '*', action: '*' })

// 随机生成一些权限
const randomPermissions = Mock.mock({
  'list|20': [
    {
      'role': () => Mock.Random.pick(roleList).role,
      'resource': '@pick(["config", "service", "namespace", "user", "role"])',
      'action': '@pick(["read", "write", "delete"])',
    },
  ],
}).list

permissionList.push(...randomPermissions)

const permissionMocks: MockMethod[] = [
  // 权限列表查询
  {
    url: '/v1/auth/permissions',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { pageNo = 1, pageSize = 10 } = query
      const totalCount = permissionList.length
      const pageNumber = parseInt(pageNo)
      const size = parseInt(pageSize)
      const pageItems = permissionList.slice((pageNumber - 1) * size, pageNumber * size)

      return success({
        totalCount,
        pageNumber,
        pagesAvailable: Math.ceil(totalCount / size),
        pageItems,
      })
    },
  },
  // 创建权限
  {
    url: '/v1/auth/permissions',
    method: 'post',
    response: ({ body }: { body: any }) => {
      const { role, resource, action } = body
      permissionList.push({ role, resource, action })
      return success(null)
    },
  },
  // 删除权限
  {
    url: '/v1/auth/permissions',
    method: 'delete',
    response: ({ query }: { query: any }) => {
      const { role, resource, action } = query
      const index = permissionList.findIndex(
        item => item.role === role && item.resource === resource && item.action === action
      )
      if (index !== -1) {
        permissionList.splice(index, 1)
        return success(null)
      } else {
        return error('权限不存在', 404)
      }
    },
  },
]

export default permissionMocks
