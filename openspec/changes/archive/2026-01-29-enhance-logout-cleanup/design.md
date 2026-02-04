# Design: 完善登出清理逻辑

## Context
当前登出逻辑仅清理了认证 Store 的基本状态，但系统使用了 Pinia 持久化插件，状态会被保存到 localStorage。此外，Menu Store 和 Tabs Store 的状态也会持久化，这些状态在登出时应该被重置。同时，进行中的 HTTP 请求也应该被取消，避免资源浪费和安全风险。

## Goals / Non-Goals

### Goals
- 登出时清理所有用户相关的状态和缓存
- 重置 Menu Store 和 Tabs Store 到初始状态
- 取消所有进行中的 HTTP 请求
- 清理 localStorage 中的 Pinia 持久化数据
- 保留用户偏好设置（如语言设置）

### Non-Goals
- 不清理用户偏好设置（locale）
- 不实现服务端登出接口调用（当前为前端清理）
- 不改变现有的认证流程

## Decisions

### Decision 1: 在 Auth Store 中统一处理清理逻辑
**What**: 在 `auth.ts` 的 `logout()` 方法中统一处理所有清理逻辑
**Why**: 
- 登出是认证相关的操作，应该在认证 Store 中处理
- 集中管理清理逻辑，便于维护和扩展
- 避免在多个地方重复清理逻辑

**Alternatives considered**:
- 创建独立的清理工具函数：增加了代码复杂度，且清理逻辑与认证紧密相关
- 在各个 Store 中分别处理：可能导致清理不完整，且难以保证执行顺序

### Decision 2: 为 Menu Store 和 Tabs Store 添加 reset() 方法
**What**: 在 menu.ts 和 tabs.ts 中添加 `reset()` 方法，用于重置状态到初始值
**Why**:
- 提供清晰的 API，使代码更易读和维护
- 便于测试和复用
- 符合单一职责原则

**Alternatives considered**:
- 直接在 logout 中重置状态：代码可读性较差，且不利于测试

### Decision 3: 使用 HTTP 客户端的 cancelAll() 方法
**What**: 在登出时调用 `api.cancelAll()` 取消所有进行中的请求
**Why**:
- HttpClient 已经提供了 `cancelAll()` 方法
- 直接使用现有 API，无需额外修改
- 符合现有架构设计

**Alternatives considered**:
- 导出 RequestCanceler 实例：破坏了封装性，增加了耦合度

### Decision 4: 保留 locale 设置
**What**: 登出时不删除 localStorage 中的 `locale` 键
**Why**:
- locale 是用户偏好设置，不应随登出清除
- 提升用户体验，避免每次登录都需要重新设置语言

## Risks / Trade-offs

### Risk 1: 清理顺序问题
**Risk**: 如果清理顺序不当，可能导致某些状态无法正确清理
**Mitigation**: 按照依赖关系确定清理顺序：HTTP 请求 → 其他 Store → Auth Store → localStorage → 路由跳转

### Risk 2: 错误处理
**Risk**: 清理过程中如果出现错误，可能影响登出流程
**Mitigation**: 使用 try-catch 包裹清理逻辑，确保即使部分清理失败，也能完成登出流程

### Risk 3: 异步操作
**Risk**: 如果有服务端登出接口，需要先调用接口再清理本地状态
**Mitigation**: 当前为前端清理，如果未来需要服务端登出，可以在 logout 方法中添加异步调用

## Migration Plan

### 步骤
1. 在 Menu Store 中添加 `reset()` 方法
2. 在 Tabs Store 中添加 `reset()` 方法
3. 增强 Auth Store 的 `logout()` 方法，添加完整清理逻辑
4. 测试登出功能，确保所有状态和缓存被正确清理

### 回滚
如果出现问题，可以回滚到之前的简单 logout 实现。

## Open Questions
- 是否需要添加服务端登出接口调用？（当前为前端清理，未来可能需要）
