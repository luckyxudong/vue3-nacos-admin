# Design: HTTP 请求封装与 Mock 服务

## Context
Vue3 模板项目需要统一的 HTTP 请求封装方案，以支持：
- 统一的错误处理和响应拦截
- 请求拦截器（如添加 token、设置请求头）
- 响应拦截器（如统一处理错误码、数据转换）
- 请求取消、去重、重试等高级功能
- Mock 服务支持前端开发阶段的后端接口模拟

## Goals / Non-Goals

### Goals
- 提供模块化的 HTTP 请求核心封装，每个功能独立为类，便于复用和测试
- 支持项目特定的配置和自定义，通过配置层组装核心模块
- 提供 Service 层基类，简化业务 API 调用
- 支持 Mock 服务，便于前后端并行开发

### Non-Goals
- 不实现请求缓存功能（后续可扩展）
- 不实现请求队列管理（后续可扩展）
- 不实现请求优先级（后续可扩展）

## Decisions

### Decision: 使用 Axios 而非 Alova
**What**: 选择 Axios 作为 HTTP 请求库
**Why**: 
- Axios 是业界广泛使用的成熟库，社区支持好
- 项目团队熟悉 Axios，学习成本低
- Alova 虽然功能强大，但团队缺乏实际项目经验

**Alternatives considered**:
- Alova: 功能强大，但团队不熟悉，存在学习成本

### Decision: 分层架构设计
**What**: 采用四层架构设计
1. **Mock 服务层**：项目根目录下的 `mock/` 目录
2. **请求核心封装层**：`src/http/core/` 目录，通用功能模块化
3. **项目配置层**：`src/http/index.ts`，项目特定配置和组装
4. **Service 层**：`src/services/` 目录，业务 API 调用

**Why**:
- 核心封装层与项目无关，可提取为独立 lib 在不同项目复用
- 配置层支持项目特定的需求（如错误处理、超时设置）
- Service 层与业务相关，提供通用 CRUD 基类

### Decision: 通用响应结构设计
**What**: 定义 `ApiResp<T>` 结构，包含 `code`, `message`, `data` 三个字段
**Why**:
- 符合大多数后端接口的响应格式
- 将请求错误与业务错误分开处理
- 前端需要先判断 HTTP 状态码，再判断业务状态码

**Alternatives considered**:
- 请求成功只返回业务数据：更简洁，但需要统一错误处理机制

### Decision: Mock 服务使用 vite-plugin-mock
**What**: 使用 `vite-plugin-mock` 和 `mockjs` 搭建 Mock 服务
**Why**:
- 与 Vite 构建工具深度集成
- 支持开发时自动启用，生产环境自动禁用
- MockJS 提供丰富的数据生成能力

### Decision: 插件化架构设计
**What**: 采用插件化架构，将请求取消、请求去重、请求重试等功能作为插件实现
**Why**:
- 代码更加模块化、可扩展
- 每个功能独立为插件，便于维护和测试
- 支持按需启用或禁用插件功能
- 便于后续扩展新的功能插件

**实现方式**:
- 定义 `HttpPlugin` 接口，所有插件必须实现该接口
- 创建 `PluginManager` 类，统一管理插件的注册和应用
- 在 `HttpClient` 中集成 `PluginManager`，根据配置动态注册插件

### Decision: 使用 AbortController 实现请求取消
**What**: 使用浏览器原生 `AbortController` API 实现请求取消功能
**Why**:
- Axios v0.22.0+ 推荐使用 `AbortController` 替代已弃用的 `CancelToken`
- 浏览器原生 API，无需额外依赖
- 标准化的取消异步操作的方案

**实现方式**:
- 创建 `RequestCanceler` 插件，实现 `HttpPlugin` 接口
- 使用 Map 存储请求配置与 AbortController 的映射关系
- 在请求拦截器中创建 AbortController 并设置到请求配置
- 在响应拦截器中移除已完成的请求
- 提供 `cancelAll()` 方法取消所有请求

## Risks / Trade-offs

### 风险：核心封装层与项目耦合
**风险**: 核心封装层可能包含项目特定的逻辑
**缓解**: 严格遵循分层设计，核心层只包含通用功能，项目特定逻辑放在配置层

### 风险：Mock 服务与真实接口不一致
**风险**: Mock 数据可能与真实后端接口结构不一致
**缓解**: 使用 TypeScript 类型定义，确保 Mock 数据与真实接口类型一致

## Migration Plan
无需迁移，这是新功能添加。

## Open Questions
- [x] 是否需要支持请求缓存功能？ → 后续可扩展为插件
- [x] 是否需要支持请求队列管理？ → 后续可扩展为插件
- [x] 是否需要支持请求优先级？ → 后续可扩展为插件
- [ ] 是否需要支持请求去重功能？
- [ ] 是否需要支持请求重试功能？
