function success(data: any) {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

function error(message: any, code = 401) {
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
    response: (request: any) => {
      // 在 Mock 模式下记录请求，方便排查问题
      console.log('Mock Login Request:', request)

      const body = request.body
      let username = ''
      let password = ''

      if (typeof body === 'string') {
        // 处理 x-www-form-urlencoded 字符串
        const params = new URLSearchParams(body)
        username = params.get('username') || ''
        password = params.get('password') || ''
      } else if (body && typeof body === 'object') {
        // 处理 JSON 对象
        username = body.username
        password = body.password
      }

      console.log('Parsed Credentials:', { username, password })

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
