# routing-system Specification

## Purpose
路由系统为 Vue3 模板项目提供基于文件系统的自动路由生成和全局布局管理能力，支持：
- 基于 `src/pages` 目录自动生成路由，无需手动配置
- 全局布局管理，支持默认布局和自定义布局
- 完整的 TypeScript 类型支持，提供类型安全的路由使用体验
## Requirements
### Requirement: 自动路由生成
系统 SHALL 基于文件系统自动生成路由配置，无需手动在路由文件中添加路由定义。

#### Scenario: 页面文件自动生成路由
- **WHEN** 开发者在 `src/pages` 目录下创建 Vue 文件（如 `src/pages/demo.vue`）
- **THEN** 系统应自动生成对应的路由（如 `/demo`）
- **AND** 路由路径应与文件路径对应（文件名为 `demo.vue` 则路由为 `/demo`）
- **AND** 首页文件 `index.vue` 应映射到根路径 `/`

#### Scenario: 路由类型自动生成
- **WHEN** 开发服务器启动时
- **THEN** 系统应在项目根目录自动生成 `typed-router.d.ts` 类型定义文件
- **AND** 类型定义文件应包含所有自动生成的路由类型信息
- **AND** 类型定义文件应被包含在 TypeScript 编译配置中

#### Scenario: 路由类型安全使用
- **WHEN** 开发者使用 `router.push()` 或 `<router-link>` 组件
- **THEN** 系统应提供类型提示和类型检查
- **AND** 无效的路由路径应触发 TypeScript 类型错误
- **AND** 路由参数应具有正确的类型定义

### Requirement: 全局布局支持
系统 SHALL 支持全局布局管理，允许为所有页面或特定页面指定布局组件。

#### Scenario: 默认布局应用
- **WHEN** 页面未指定布局时
- **THEN** 系统应使用默认布局（`src/layouts/default.vue`）
- **AND** 布局文件应包含 `<router-view>` 组件用于渲染页面内容
- **AND** 布局应正常包裹页面内容

#### Scenario: 自定义布局指定
- **WHEN** 开发者在页面文件中使用 `definePage({ meta: { layout: 'blank' } })`
- **THEN** 系统应使用指定的布局文件（如 `src/layouts/blank.vue`）
- **AND** 布局切换应正常工作，不影响页面内容

#### Scenario: 布局目录配置
- **WHEN** 开发者在 `vite.config.ts` 中配置 `Layouts` 插件
- **THEN** 系统应使用配置的布局目录（默认：`src/layouts`）
- **AND** 系统应使用配置的默认布局文件名（默认：`default`）

### Requirement: 路由配置集成
系统 SHALL 将自动生成的路由与布局系统集成到 Vue Router 配置中，并支持路由守卫功能。

#### Scenario: 路由自动导入
- **WHEN** 开发者在 `src/router/index.ts` 中导入 `routes` from `vue-router/auto-routes`
- **THEN** 系统应提供自动生成的路由数组
- **AND** 路由数组应包含所有 `src/pages` 目录下的页面路由

#### Scenario: 布局路由包装
- **WHEN** 开发者在路由配置中使用 `setupLayouts(routes)`
- **THEN** 系统应将自动生成的路由包装在布局组件中
- **AND** 路由结构应正确，布局组件作为父路由，页面组件作为子路由

#### Scenario: 模块化注册保持
- **WHEN** 开发者使用 `installRouter` 函数注册路由
- **THEN** 函数应继续使用模块化注册模式
- **AND** 函数签名应保持不变，确保与现有代码兼容

#### Scenario: 路由守卫实现
- **WHEN** 用户在 `router.beforeEach` 中配置路由守卫
- **THEN** 未登录用户访问受保护页面时应重定向到 `/login`
- **AND** 已登录用户访问登录页时应重定向到首页 `/`
- **AND** 路由白名单（如登录页和公开页面）应不需要认证即可访问

#### Scenario: 路由守卫检查逻辑
- **WHEN** 路由守卫执行时
- **THEN** 应检查认证 Store 的 `isAuthenticated` 状态
- **AND** 应根据登录状态和目标路由决定是否允许访问或重定向

### Requirement: Vite 插件配置
系统 SHALL 正确配置 Vite 插件以支持自动路由和布局功能。

#### Scenario: VueRouter 插件配置
- **WHEN** 开发者在 `vite.config.ts` 中配置 `VueRouter` 插件
- **THEN** 插件应放在 `vue()` 插件之前（插件顺序要求）
- **AND** 插件应扫描 `src/pages` 目录生成路由
- **AND** 插件应生成类型定义文件

#### Scenario: Layouts 插件配置
- **WHEN** 开发者在 `vite.config.ts` 中配置 `Layouts` 插件
- **THEN** 插件应扫描 `src/layouts` 目录
- **AND** 插件应生成虚拟模块 `virtual:generated-layouts` 供路由配置使用
- **AND** 插件应支持默认布局配置

### Requirement: 类型定义配置
系统 SHALL 正确配置 TypeScript 类型定义以支持路由类型安全。

#### Scenario: 类型定义文件包含
- **WHEN** 开发者在 `tsconfig.app.json` 中配置 `include` 数组
- **THEN** 应包含 `typed-router.d.ts` 文件
- **AND** TypeScript 编译器应识别自动生成的路由类型

#### Scenario: 类型引用配置
- **WHEN** 开发者在 `env.d.ts` 中添加类型引用
- **THEN** 应添加 `/// <reference types="unplugin-vue-router/client" />`
- **AND** 类型引用应放在文件末尾
- **AND** TypeScript 应正确解析路由类型定义

### Requirement: 页面目录结构
系统 SHALL 使用标准的页面目录结构以支持自动路由生成。

#### Scenario: 页面目录创建
- **WHEN** 系统初始化时
- **THEN** 应创建 `src/pages` 目录用于存放页面文件
- **AND** 目录结构应清晰，便于开发者理解和使用

#### Scenario: 首页文件支持
- **WHEN** 开发者在 `src/pages` 目录下创建 `index.vue` 文件
- **THEN** 系统应将其映射到根路径 `/`
- **AND** 访问根路径时应显示 `index.vue` 的内容

#### Scenario: 嵌套路由支持（可选）
- **WHEN** 开发者在 `src/pages` 目录下创建嵌套目录（如 `src/pages/user/profile.vue`）
- **THEN** 系统应生成对应的嵌套路由（如 `/user/profile`）
- **AND** 路由结构应与目录结构对应

### Requirement: 配置管理页面路由
系统 SHALL 为配置管理模块提供页面路由，支持配置列表、历史版本、监听查询三个页面。

#### Scenario: 配置列表页面路由
- **WHEN** 开发者在 `src/pages/config/list.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/config/list`
- **AND** 路由应正确映射到页面组件

#### Scenario: 历史版本页面路由
- **WHEN** 开发者在 `src/pages/config/history.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/config/history`
- **AND** 路由应正确映射到页面组件

#### Scenario: 监听查询页面路由
- **WHEN** 开发者在 `src/pages/config/listen.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/config/listen`
- **AND** 路由应正确映射到页面组件

### Requirement: 服务管理页面路由
系统 SHALL 为服务管理模块提供页面路由，支持服务列表、订阅者列表两个页面。

#### Scenario: 服务列表页面路由
- **WHEN** 开发者在 `src/pages/service/list.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/service/list`
- **AND** 路由应正确映射到页面组件

#### Scenario: 订阅者列表页面路由
- **WHEN** 开发者在 `src/pages/service/subscribers.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/service/subscribers`
- **AND** 路由应正确映射到页面组件

### Requirement: 权限控制页面路由
系统 SHALL 为权限控制模块提供页面路由，支持用户列表、角色管理、权限管理三个页面。

#### Scenario: 用户列表页面路由
- **WHEN** 开发者在 `src/pages/permission/users.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/permission/users`
- **AND** 路由应正确映射到页面组件

#### Scenario: 角色管理页面路由
- **WHEN** 开发者在 `src/pages/permission/roles.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/permission/roles`
- **AND** 路由应正确映射到页面组件

#### Scenario: 权限管理页面路由
- **WHEN** 开发者在 `src/pages/permission/permissions.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/permission/permissions`
- **AND** 路由应正确映射到页面组件

### Requirement: 命名空间页面路由
系统 SHALL 为命名空间模块提供页面路由。

#### Scenario: 命名空间页面路由
- **WHEN** 开发者在 `src/pages/namespace.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/namespace`
- **AND** 路由应正确映射到页面组件

### Requirement: 集群管理页面路由
系统 SHALL 为集群管理模块提供页面路由，支持节点列表页面。

#### Scenario: 节点列表页面路由
- **WHEN** 开发者在 `src/pages/cluster/nodes.vue` 创建页面文件
- **THEN** 系统应自动生成路由 `/cluster/nodes`
- **AND** 路由应正确映射到页面组件

