function success(data) {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

function error(message, code = 401) {
  return {
    code,
    message,
    data: null,
  }
}

export default [
  {
    url: '/v1/auth/users/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === 'admin') {
        return success({
          accessToken: 'mock-token-' + Date.now(),
          username: 'admin',
        })
      } else {
        return error('用户名或密码错误', 401)
      }
    },
  },
]
