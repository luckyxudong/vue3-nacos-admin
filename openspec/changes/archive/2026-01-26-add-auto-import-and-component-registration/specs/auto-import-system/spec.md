## ADDED Requirements

### Requirement: 自动导入插件配置
系统 SHALL 集成 `unplugin-auto-import` 插件，实现 Vue、Vue Router、Pinia、VueUse 等库的 API 自动导入功能。

#### Scenario: 插件安装和导入
- **WHEN** 开发者在项目中安装 `unplugin-auto-import` 开发依赖
- **THEN** 插件应作为开发依赖添加到 `package.json`
- **AND** 在 `vite.config.ts` 中应从 `unplugin-auto-import/vite` 导入 `AutoImport`

#### Scenario: 插件基础配置
- **WHEN** 开发者在 `vite.config.ts` 中配置 `AutoImport` 插件
- **THEN** 插件应配置支持的文件类型：`.ts`, `.tsx`, `.js`, `.jsx`, `.vue`, `.md`
- **AND** 插件应配置 `imports` 数组，包含 `'vue'`、`VueRouterAutoImports`（从 `unplugin-vue-router` 导入）、`'pinia'`
- **AND** 插件应放在 Vite 插件数组的适当位置

#### Scenario: VueUse 集成
- **WHEN** 开发者在项目中安装 `@vueuse/core` 运行时依赖
- **THEN** 依赖应添加到 `package.json` 的 `dependencies` 中
- **AND** 在 `AutoImport` 插件的 `imports` 数组中应添加 `'@vueuse/core'`
- **AND** VueUse 提供的 hooks（如 `useDark`, `useToggle`）应支持自动导入

### Requirement: 类型定义文件生成
系统 SHALL 自动生成类型声明文件，确保 TypeScript 类型安全。

#### Scenario: 类型文件自动生成
- **WHEN** 开发服务器启动时
- **THEN** 系统应在项目根目录自动生成 `auto-imports.d.ts` 类型定义文件
- **AND** 类型定义文件应包含所有自动导入的 API 的类型声明
- **AND** 类型定义文件应随自动导入配置的变化自动更新

#### Scenario: TypeScript 配置集成
- **WHEN** 开发者在 `tsconfig.app.json` 中配置 `include` 数组
- **THEN** 应包含 `auto-imports.d.ts` 文件
- **AND** TypeScript 编译器应识别自动导入的类型定义
- **AND** IDE 应提供自动导入 API 的类型提示和自动补全

### Requirement: Vue API 自动导入
系统 SHALL 支持 Vue 核心 API 的自动导入，无需手动编写 import 语句。

#### Scenario: 组合式 API 自动导入
- **WHEN** 开发者在 Vue 组件的 `<script setup>` 中使用 Vue API（如 `ref`, `computed`, `watch`）
- **THEN** 系统应自动导入这些 API，无需手动编写 `import { ref } from 'vue'`
- **AND** 代码应正常编译和运行
- **AND** TypeScript 应提供正确的类型检查

#### Scenario: 生命周期钩子自动导入
- **WHEN** 开发者在组件中使用生命周期钩子（如 `onMounted`, `onUnmounted`）
- **THEN** 系统应自动导入这些钩子函数
- **AND** 无需手动编写 import 语句

### Requirement: Vue Router API 自动导入
系统 SHALL 支持 Vue Router（自动路由）API 的自动导入。

#### Scenario: 路由 API 自动导入
- **WHEN** 开发者在组件中使用路由相关 API（如 `useRouter`, `useRoute`）
- **THEN** 系统应自动导入这些 API，使用 `unplugin-vue-router` 提供的 `VueRouterAutoImports`
- **AND** 无需手动编写 import 语句
- **AND** 类型定义应正确识别路由 API

### Requirement: Pinia API 自动导入
系统 SHALL 支持 Pinia 状态管理 API 的自动导入。

#### Scenario: Store API 自动导入
- **WHEN** 开发者在组件中使用 Pinia API（如 `defineStore`, `storeToRefs`）
- **THEN** 系统应自动导入这些 API
- **AND** 无需手动编写 `import { defineStore } from 'pinia'`
- **AND** Store 定义和使用应正常工作

### Requirement: VueUse Hooks 自动导入
系统 SHALL 支持 VueUse 提供的组合式 API hooks 的自动导入。

#### Scenario: VueUse hooks 自动导入
- **WHEN** 开发者在组件中使用 VueUse hooks（如 `useDark`, `useToggle`, `useStorage`）
- **THEN** 系统应自动导入这些 hooks
- **AND** 无需手动编写 `import { useDark } from '@vueuse/core'`
- **AND** hooks 应正常工作，提供预期的功能

#### Scenario: VueUse 功能示例
- **WHEN** 开发者使用 `useDark` 和 `useToggle` 实现暗黑模式切换
- **THEN** `useDark` 应返回响应式的暗黑模式状态，并支持持久化
- **AND** `useToggle` 应返回切换函数
- **AND** 页面刷新后应保持暗黑模式状态

### Requirement: 文件类型支持
系统 SHALL 支持多种文件类型的自动导入。

#### Scenario: Vue 文件支持
- **WHEN** 开发者在 `.vue` 文件中使用自动导入的 API
- **THEN** 系统应正确识别并自动导入

#### Scenario: TypeScript/JavaScript 文件支持
- **WHEN** 开发者在 `.ts`、`.tsx`、`.js`、`.jsx` 文件中使用自动导入的 API
- **THEN** 系统应正确识别并自动导入

#### Scenario: Markdown 文件支持
- **WHEN** 开发者在 `.md` 文件中使用自动导入的 API（如 Vue 组件文档）
- **THEN** 系统应正确识别并自动导入
