import Mock from 'mockjs'
import { userList } from './user'

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

// 生成角色列表数据
export const roleList: any[] = []

// 为预置用户分配角色
roleList.push({ role: 'ROLE_ADMIN', username: 'admin' })

// 随机生成一些角色关联
const randomRoles = Mock.mock({
  'list|20': [
    {
      'role': '@pick(["ROLE_ADMIN", "ROLE_USER", "ROLE_GUEST", "ROLE_DEVELOPER"])',
      'username': () => Mock.Random.pick(userList).username,
    },
  ],
}).list

if (randomRoles) {
  roleList.push(...randomRoles)
}

export default [
  // 角色列表查询
  {
    url: '/v1/auth/roles',
    method: 'get',
    response: ({ query }: any) => {
      const { pageNo = 1, pageSize = 10 } = query
      const totalCount = roleList.length
      const pageNumber = parseInt(pageNo)
      const size = parseInt(pageSize)
      const pageItems = roleList.slice((pageNumber - 1) * size, pageNumber * size)

      return success({
        totalCount,
        pageNumber,
        pagesAvailable: Math.ceil(totalCount / size),
        pageItems,
      })
    },
  },
  // 搜索角色
  {
    url: '/v1/auth/roles/search',
    method: 'get',
    response: ({ query }: any) => {
      const { role } = query
      return success(roleList.filter((item: any) => item.role.includes(role)).map((item: any) => item.role))
    },
  },
  // 创建角色
  {
    url: '/v1/auth/roles',
    method: 'post',
    response: ({ body }: any) => {
      const { role, username } = body
      if (!userList.some((item: any) => item.username === username)) {
        return error('用户不存在', 400)
      }
      roleList.push({ role, username })
      return success(null)
    },
  },
  // 删除角色
  {
    url: '/v1/auth/roles',
    method: 'delete',
    response: ({ query }: any) => {
      const { role } = query
      const index = roleList.findIndex((item: any) => item.role === role)
      if (index !== -1) {
        roleList.splice(index, 1)
        return success(null)
      }
      return error('角色不存在', 404)
    },
  },
]
