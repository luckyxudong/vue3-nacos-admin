# routing-system Specification

## ADDED Requirements

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
系统 SHALL 将自动生成的路由与布局系统集成到 Vue Router 配置中。

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
