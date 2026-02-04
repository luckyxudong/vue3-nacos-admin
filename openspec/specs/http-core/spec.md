# http-core Specification

## Purpose
TBD - created by archiving change add-http-client-system. Update Purpose after archive.
## Requirements
### Requirement: HTTP 请求核心封装
系统 SHALL 提供 HTTP 请求核心封装层（`src/http/core/`），对 Axios 进行强大的封装，包括拦截器、取消请求、请求去重、重试等功能。

#### Scenario: 核心封装目录结构
- **WHEN** 初始化 HTTP 核心封装层
- **THEN** 必须包含以下文件：
  - `src/http/core/http-client.ts` - HTTP 客户端类
  - `src/http/core/interceptors.ts` - 拦截器管理类
  - `src/http/core/types.ts` - 类型定义
  - `src/http/core/plugin.ts` - 插件接口定义
  - `src/http/core/plugin-manager.ts` - 插件管理器
  - `src/http/core/request-canceler.ts` - 请求取消插件
  - `src/http/core/index.ts` - 统一导出

#### Scenario: 核心封装模块化设计
- **WHEN** 查看核心封装层代码
- **THEN** 每个功能都应该是独立的类
- **AND** 最后在 `core/index.ts` 中导出所有内容
- **AND** 核心封装层与具体项目无关，可提取为独立 lib

### Requirement: 通用类型定义
系统 SHALL 定义通用响应结构类型，包括 `ApiResp<T>`、`PageReq`、`PageData<T>`。

#### Scenario: 通用响应结构类型
- **WHEN** 查看 `src/http/core/types.ts`
- **THEN** 必须定义 `ApiResp<T>` 接口，包含 `code: number`、`message: string`、`data: T` 三个字段

#### Scenario: 分页请求和响应类型
- **WHEN** 查看 `src/http/core/types.ts`
- **THEN** 必须定义 `PageReq` 接口，包含 `pageNum: number`、`pageSize: number` 两个字段
- **AND** 必须定义 `PageData<T>` 接口，包含 `list: T[]`、`total: number` 两个字段

#### Scenario: HTTP 客户端配置类型
- **WHEN** 查看 `src/http/core/types.ts`
- **THEN** 必须定义 `HttpClientConfig` 接口，包含以下字段：
  - `baseURL?: string` - 请求基础路径
  - `timeout?: number` - 超时时间
  - `headers?: Record<string, string>` - 公共请求头
  - `interceptor?: InterceptorConfig` - 拦截器配置
  - `enableCancel?: boolean` - 是否开启请求取消

#### Scenario: 拦截器配置类型
- **WHEN** 查看 `src/http/core/types.ts`
- **THEN** 必须定义 `InterceptorConfig` 接口，包含：
  - `request?: { onFulfilled?, onRejected? }` - 请求拦截器配置
  - `response?: { onFulfilled?, onRejected? }` - 响应拦截器配置

#### Scenario: 类型导出
- **WHEN** 查看 `src/http/core/index.ts`
- **THEN** 必须导出所有类型定义（`export * from './types'`）

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

### Requirement: Interceptors 类实现
系统 SHALL 实现 `Interceptors` 类，管理请求和响应拦截器。

#### Scenario: Interceptors 类结构
- **WHEN** 查看 `src/http/core/interceptors.ts`
- **THEN** 必须定义 `Interceptors` 类
- **AND** 构造函数必须接收 `InterceptorConfig` 配置参数
- **AND** 必须提供 `applyInterceptors(instance)` 方法应用拦截器

#### Scenario: 默认请求拦截器
- **WHEN** 查看 `src/http/core/interceptors.ts`
- **THEN** 必须导出默认请求拦截器函数：
  - `defaultRequestOnFulfilled` - 成功处理函数（开发环境输出请求日志）
  - `defaultRequestOnRejected` - 失败处理函数（返回 Promise.reject）

#### Scenario: 默认响应拦截器
- **WHEN** 查看 `src/http/core/interceptors.ts`
- **THEN** 必须导出默认响应拦截器函数：
  - `defaultResponseOnFulfilled` - 成功处理函数（开发环境输出响应日志、解析 API 响应格式）
  - `defaultResponseOnRejected` - 失败处理函数（错误处理和日志输出）

#### Scenario: API 响应解析
- **WHEN** 响应数据符合 `ApiResp<T>` 格式（包含 `code`、`message`、`data`）
- **THEN** 如果 `code === 0` 或 `code === 200`，必须直接返回 `data` 字段
- **AND** 如果 `code` 不等于 0 或 200，必须抛出错误（使用 `message` 作为错误信息）
- **WHEN** 响应数据不符合标准格式
- **THEN** 必须直接返回响应数据

#### Scenario: 拦截器应用
- **WHEN** 调用 `Interceptors` 实例的 `applyInterceptors(instance)` 方法
- **THEN** 必须将拦截器应用到 Axios 实例
- **AND** 如果配置中提供了自定义拦截器函数，必须使用自定义函数
- **AND** 如果配置中未提供，必须使用默认拦截器函数

### Requirement: 插件化架构
系统 SHALL 提供插件化架构，支持将功能模块作为插件实现。

#### Scenario: HttpPlugin 接口定义
- **WHEN** 查看 `src/http/core/plugin.ts`
- **THEN** 必须定义 `HttpPlugin` 接口
- **AND** 接口必须包含 `apply(instance: AxiosInstance): void` 方法

#### Scenario: PluginManager 类实现
- **WHEN** 查看 `src/http/core/plugin-manager.ts`
- **THEN** 必须定义 `PluginManager` 类
- **AND** 必须提供 `register(plugin: HttpPlugin)` 方法注册插件
- **AND** 必须提供 `applyAll(instance: AxiosInstance)` 方法应用所有插件
- **AND** 必须提供 `clear()` 方法清除所有插件

#### Scenario: HttpClient 集成插件系统
- **WHEN** 创建 `HttpClient` 实例
- **THEN** 必须创建 `PluginManager` 实例
- **AND** 必须根据配置注册插件（如 `enableCancel` 为 true 时注册 `RequestCanceler`）
- **AND** 必须在创建 Axios 实例后应用所有插件

### Requirement: 请求取消功能
系统 SHALL 提供请求取消功能，支持取消单个请求或所有请求。

#### Scenario: RequestCanceler 插件实现
- **WHEN** 查看 `src/http/core/request-canceler.ts`
- **THEN** 必须定义 `RequestCanceler` 类
- **AND** 必须实现 `HttpPlugin` 接口
- **AND** 必须使用 Map 存储请求配置与 AbortController 的映射关系

#### Scenario: 请求唯一标识生成
- **WHEN** `RequestCanceler` 需要生成请求唯一标识
- **THEN** 必须基于请求的 `method`、`url`、`params`、`data` 生成唯一字符串

#### Scenario: 请求添加和移除
- **WHEN** 请求发送前
- **THEN** 必须在请求拦截器中创建 `AbortController` 并设置到请求配置的 `signal`
- **AND** 必须将请求配置和控制器添加到 Map 中
- **AND** 如果存在相同请求，必须先取消之前的请求
- **WHEN** 请求完成（成功或失败）
- **THEN** 必须在响应拦截器中从 Map 中移除该请求

#### Scenario: 取消所有请求
- **WHEN** 调用 `RequestCanceler` 实例的 `clear()` 方法
- **THEN** 必须遍历 Map 中的所有控制器并调用 `abort()` 方法
- **AND** 必须清空 Map

#### Scenario: HttpClient 集成请求取消
- **WHEN** `HttpClientConfig` 中 `enableCancel` 为 `true`
- **THEN** 必须注册 `RequestCanceler` 插件
- **AND** 必须提供 `cancelAll()` 方法，调用 `RequestCanceler` 的 `clear()` 方法

