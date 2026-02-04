# auth-system Specification

## Purpose
TBD - created by archiving change add-login-page. Update Purpose after archive.
## Requirements
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

### Requirement: 登录页面
系统 SHALL 提供登录页面，包含用户名、密码输入框和登录按钮。

#### Scenario: 登录页面创建
- **WHEN** 查看 `src/pages/login.vue`
- **THEN** 必须使用 `definePage` 指定 `blank` 布局
- **AND** 必须包含用户名输入框（使用 Input 组件）
- **AND** 必须包含密码输入框（使用 Input 组件，type="password"）
- **AND** 必须包含登录按钮（使用 Button 组件）
- **AND** 页面标题必须显示 "Nova Admin"

#### Scenario: 登录页面样式
- **WHEN** 查看登录页面
- **THEN** 背景应为浅蓝色渐变
- **AND** 表单应位于居中白色圆角卡片中
- **AND** 样式应使用 UnoCSS 工具类和 SCSS，符合项目设计令牌

#### Scenario: 登录页面表单验证
- **WHEN** 用户提交登录表单
- **THEN** 如果用户名为空，应显示错误提示
- **AND** 如果密码为空，应显示错误提示
- **AND** 如果用户名和密码都不为空，应调用登录方法

#### Scenario: 登录页面交互
- **WHEN** 用户点击登录按钮
- **THEN** 应显示加载状态
- **AND** 应调用认证 Store 的 `login` 方法
- **AND** 登录成功时应跳转到首页 `/`
- **AND** 登录失败时应显示错误提示

### Requirement: 空白布局
系统 SHALL 提供空白布局，用于登录页等无需导航栏的页面。

#### Scenario: 空白布局创建
- **WHEN** 查看 `src/layouts/blank.vue`
- **THEN** 必须只包含 `<router-view>` 组件
- **AND** 必须设置全屏布局样式
- **AND** 背景可设置渐变效果

#### Scenario: 空白布局使用
- **WHEN** 页面使用 `definePage({ meta: { layout: 'blank' } })`
- **THEN** 应使用空白布局渲染页面
- **AND** 不应显示导航栏等 UI 元素

