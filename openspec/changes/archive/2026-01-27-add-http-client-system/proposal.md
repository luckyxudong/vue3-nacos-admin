# Change: 添加 HTTP 请求封装与 Mock 服务

## Why
项目需要统一的 HTTP 请求封装方案，以提供优雅的架构设计、统一的错误处理、请求拦截、取消请求、请求去重、重试等高级功能。同时需要 Mock 服务支持前端开发阶段的后端接口模拟，便于前后端并行开发和测试。

## What Changes
- 集成 Axios 作为 HTTP 请求库
- 创建 HTTP 请求核心封装层（`src/http/core/`），提供通用功能模块化设计
  - 实现 `HttpClient` 类，封装 Axios 实例和基础请求方法（GET、POST、PUT、DELETE、PATCH）
  - 实现 `Interceptors` 类，提供请求和响应拦截器管理
  - 实现插件化架构（`HttpPlugin` 接口、`PluginManager` 类）
  - 实现 `RequestCanceler` 插件，支持请求取消功能
  - 定义配置类型（`HttpClientConfig`、`InterceptorConfig`）
- 创建项目配置层（`src/http/index.ts`），组装核心模块并导出项目特定的 Axios 实例
- 创建 Service 层（`src/services/`），提供业务 API 调用接口和通用 CRUD 基类（`BaseService`）
- 集成 MockJS 和 vite-plugin-mock，搭建 Mock 服务（`mock/` 目录）
- 定义通用响应结构类型（`ApiResp`, `PageReq`, `PageData`）

## Impact
- Affected specs: `http-core`, `mock-service`, `http-config`, `service-layer`
- Affected code: 
  - `src/http/**` - HTTP 请求封装相关代码
  - `src/services/**` - Service 层代码
  - `mock/**` - Mock 服务代码
  - `vite.config.ts` - Mock 插件配置
  - `package.json` - 新增依赖（axios, mockjs, vite-plugin-mock）
