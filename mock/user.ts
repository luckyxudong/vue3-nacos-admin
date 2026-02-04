import Mock from 'mockjs'

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

// 生成用户列表数据
export const userList = Mock.mock({
  'list|20': [
    {
      'username': '@word(5, 10)',
      'password': '@string(10)',
    },
  ],
}).list

// 预置管理员
userList.unshift({
  username: 'admin',
  password: '***',
})

export default [
  // 用户列表查询
  {
    url: '/v1/auth/users',
    method: 'get',
    response: ({ query }) => {
      const { pageNo = 1, pageSize = 10, username, search = 'blur' } = query
      let filteredList = [...userList]

      if (username) {
        if (search === 'blur') {
          filteredList = filteredList.filter(item => item.username.includes(username))
        } else {
          filteredList = filteredList.filter(item => item.username === username)
        }
      }

      const totalCount = filteredList.length
      const pageNumber = parseInt(pageNo)
      const size = parseInt(pageSize)
      const pageItems = filteredList.slice((pageNumber - 1) * size, pageNumber * size)

      return success({
        totalCount,
        pageNumber,
        pagesAvailable: Math.ceil(totalCount / size),
        pageItems,
      })
    },
  },
  // 创建用户
  {
    url: '/v1/auth/users',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (userList.some((item) => item.username === username)) {
        return error('用户已存在')
      }
      userList.push({ username, password })
      return success(null)
    },
  },
  // 搜索用户
  {
    url: '/v1/auth/users/search',
    method: 'get',
    response: ({ query }) => {
      const { username } = query
      return success(userList.filter((item) => item.username.includes(username)).map((item) => item.username))
    },
  },
  // 删除用户
  {
    url: '/v1/auth/users',
    method: 'delete',
    response: ({ query }) => {
      const { username } = query
      const index = userList.findIndex((item) => item.username === username)
      if (index !== -1) {
        userList.splice(index, 1)
        return success(null)
      }
      return error('用户不存在', 404)
    },
  },
  // 重置密码
  {
    url: '/v1/auth/users',
    method: 'put',
    response: ({ body }) => {
      const { username, newPassword } = body
      const user = userList.find((item) => item.username === username)
      if (user) {
        user.password = newPassword
        return success(null)
      }
      return error('用户不存在', 404)
    },
  },
]
