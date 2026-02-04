## MODIFIED Requirements

### Requirement: 认证 Service
系统 SHALL 提供认证 Service 封装登录 API 调用。

#### Scenario: 认证 Service 创建
- **WHEN** 查看 `src/services/auth-service.ts`
- **THEN** 必须定义登录请求参数类型（包含 `username` 和 `password`）
- **AND** 必须定义登录响应数据类型（包含 `accessToken` 和 `username`，匹配 API 文档规范）
- **AND** 必须实现 `login(username, password)` 方法，调用 `POST /v1/auth/users/login` 接口
- **AND** 必须使用表单格式请求（`application/x-www-form-urlencoded`）
- **AND** 必须返回类型化的响应数据

#### Scenario: 认证 Service 使用
- **WHEN** 认证 Store 调用 `login` 方法
- **THEN** 应调用认证 Service 的 `login` 方法
- **AND** 应处理登录成功和失败的情况
- **AND** 登录成功后应保存 `accessToken` 和 `username` 到 Store
