## MODIFIED Requirements

### Requirement: 认证状态管理
系统 SHALL 提供认证 Store 管理用户登录状态和用户信息。

#### Scenario: 认证 Store 创建
- **WHEN** 查看 `src/stores/modules/auth.ts`
- **THEN** 必须定义 `isAuthenticated` 状态（ref，布尔类型）
- **AND** 必须定义 `user` 状态（ref，包含用户名等信息，可为 null）
- **AND** 必须实现 `login(username, password)` 方法，调用认证 Service
- **AND** 必须实现 `logout()` 方法，清除登录状态和用户信息
- **AND** 必须配置 `persist: true` 启用状态持久化

#### Scenario: 认证 Store 导出
- **WHEN** 查看 `src/stores/index.ts`
- **THEN** 必须导出认证 Store（`export * from './modules/auth'`）
- **AND** 其他模块可以通过 `import { useAuthStore } from '@/stores'` 使用认证 Store

#### Scenario: 登录状态持久化
- **WHEN** 用户登录成功后刷新页面
- **THEN** 登录状态应保持，`isAuthenticated` 仍为 `true`
- **AND** 用户信息应保持，`user` 仍包含用户信息

#### Scenario: 登出清理逻辑
- **WHEN** 用户调用 `logout()` 方法
- **THEN** 必须取消所有进行中的 HTTP 请求（调用 `api.cancelAll()`）
- **AND** 必须重置 Menu Store 的状态（调用 `useMenuStore().reset()`）
- **AND** 必须重置 Tabs Store 的状态（调用 `useTabsStore().reset()`）
- **AND** 必须清除 `isAuthenticated`、`user`、`token` 状态
- **AND** 必须清理 localStorage 中的 Pinia 持久化数据（`auth`、`menu`、`tabs`）
- **AND** 必须保留 localStorage 中的 `locale`（语言设置）
- **AND** 必须跳转到登录页（`router.push('/login')`）
- **AND** 清理过程中的错误不应阻止登出流程完成
