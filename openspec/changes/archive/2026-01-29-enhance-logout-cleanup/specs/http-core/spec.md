## MODIFIED Requirements

### Requirement: HttpClient 类实现
系统 SHALL 实现 `HttpClient` 类，封装 Axios 实例和基础请求方法。

#### Scenario: HttpClient 类结构
- **WHEN** 查看 `src/http/core/http-client.ts`
- **THEN** 必须定义 `HttpClient` 类
- **AND** 构造函数必须接收 `HttpClientConfig` 配置参数
- **AND** 必须创建并管理 Axios 实例

#### Scenario: HttpClient 默认配置
- **WHEN** 创建 `HttpClient` 实例时未提供配置
- **THEN** 必须使用默认配置：
  - `baseURL` 从环境变量 `VITE_API_BASE_URL` 读取，默认为 `/api`
  - `timeout` 默认为 `3000` 毫秒
  - `headers` 默认包含 `Content-Type: application/json;charset=utf-8`
  - `enableCancel` 默认为 `true`

#### Scenario: HttpClient 请求方法
- **WHEN** 查看 `HttpClient` 类
- **THEN** 必须提供以下请求方法：
  - `get(url, config?)` - GET 请求
  - `post(url, data?, config?)` - POST 请求
  - `put(url, data?, config?)` - PUT 请求
  - `delete(url, config?)` - DELETE 请求
  - `patch(url, data?, config?)` - PATCH 请求

#### Scenario: HttpClient 实例获取
- **WHEN** 调用 `HttpClient` 实例的 `getInstance()` 方法
- **THEN** 必须返回内部的 Axios 实例

#### Scenario: HttpClient 取消所有请求
- **WHEN** 调用 `HttpClient` 实例的 `cancelAll()` 方法
- **THEN** 必须取消所有正在进行的请求
- **AND** `cancelAll()` 方法必须可以从导出的 `api` 实例访问（`src/http/index.ts` 中导出的实例）
