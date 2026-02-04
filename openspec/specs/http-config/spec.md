# http-config Specification

## Purpose
TBD - created by archiving change add-http-client-system. Update Purpose after archive.
## Requirements
### Requirement: HTTP 项目配置层
系统 SHALL 提供 HTTP 项目配置层（`src/http/index.ts`），通过配置和组装核心模块，导出具体的 Axios 实例对象和 CRUD 函数。

#### Scenario: 项目配置层创建
- **WHEN** 初始化 HTTP 项目配置层
- **THEN** 必须创建 `src/http/index.ts` 文件
- **AND** 该文件通过配置和组装 `core` 中的多个类，导出项目特定的 Axios 实例

#### Scenario: HttpClient 实例创建
- **WHEN** 查看 `src/http/index.ts`
- **THEN** 必须创建 `HttpClient` 实例（通常命名为 `api`）
- **AND** 可以通过传递 `HttpClientConfig` 配置自定义行为
- **AND** 如果不传递配置，使用默认配置

#### Scenario: 项目特定请求拦截器
- **WHEN** 查看 `src/http/index.ts`
- **THEN** 可以定义自定义请求拦截器函数
- **AND** 可以在请求拦截器中添加 token、设置请求头等
- **AND** 必须通过 `HttpClientConfig.interceptor.request.onFulfilled` 配置自定义拦截器

#### Scenario: 项目特定响应拦截器
- **WHEN** 查看 `src/http/index.ts`
- **THEN** 可以定义自定义响应拦截器函数
- **AND** 可以在响应拦截器中统一处理错误、使用 UI 展示错误信息等
- **AND** 必须通过 `HttpClientConfig.interceptor.response.onFulfilled` 或 `onRejected` 配置自定义拦截器

#### Scenario: Axios 实例导出
- **WHEN** 查看 `src/http/index.ts`
- **THEN** 必须导出 `HttpClient` 实例（如 `export const api`）
- **AND** 必须导出 Axios 实例（通过 `api.getInstance()` 获取，如 `export const instance`）
- **AND** 导出的 Axios 实例可用于文件上传下载等个性化需求

#### Scenario: Service 层调用接口
- **WHEN** Service 层需要调用后端接口
- **THEN** 必须通过 `src/http/index.ts` 导出的 `HttpClient` 实例（如 `api`）来调用
- **AND** 可以使用 `api.get()`、`api.post()` 等方法
- **AND** 可以使用导出的 Axios 实例进行特殊操作

