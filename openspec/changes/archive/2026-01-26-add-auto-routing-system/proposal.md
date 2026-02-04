# Change: 添加自动路由系统

## Why

当前项目使用手动配置路由的方式，每次新增页面都需要在 `router/index.ts` 中手动添加路由配置。这种方式存在以下问题：

1. **开发效率低**：新增页面需要在多个文件间切换，容易出错
2. **维护成本高**：路由配置分散，难以统一管理
3. **类型安全不足**：手动配置的路由缺少类型提示和检查

通过集成 `unplugin-vue-router` 和 `vite-plugin-vue-layouts`，可以实现：
- 基于文件系统的自动路由生成，新增页面只需创建文件即可
- 全局布局管理，支持多布局切换
- 完整的 TypeScript 类型支持，提供类型安全的路由使用体验

这将显著提升开发效率，让开发者更专注于业务逻辑而非繁琐的配置工作。

## What Changes

- **自动路由生成**：集成 `unplugin-vue-router`，基于 `src/pages` 目录自动生成路由
- **全局布局支持**：集成 `vite-plugin-vue-layouts`，支持默认布局和自定义布局
- **路由配置重构**：修改 `router/index.ts`，使用自动生成的路由替代手动配置
- **类型安全增强**：添加类型定义文件配置，支持路由的类型安全使用
- **目录结构调整**：创建 `src/pages` 目录用于存放页面文件，创建 `src/layouts` 目录用于存放布局文件

**BREAKING**: 路由配置方式从手动配置改为基于文件系统的自动生成，现有路由配置需要迁移到 `src/pages` 目录。

## Impact

- **新增依赖**：
  - `unplugin-vue-router`（开发依赖）
  - `vite-plugin-vue-layouts`（开发依赖）
- **配置文件修改**：
  - `vite.config.ts`：添加 `VueRouter` 和 `Layouts` 插件配置
  - `tsconfig.app.json`：添加 `typed-router.d.ts` 类型声明文件
  - `env.d.ts`：添加 `unplugin-vue-router/client` 类型引用
- **新增目录**：
  - `src/pages/`：页面文件目录
  - `src/layouts/`：布局文件目录
- **修改文件**：
  - `src/router/index.ts`：使用自动生成的路由和布局设置
- **迁移工作**：
  - 将 `src/views/demo.vue` 迁移到 `src/pages/demo.vue`
  - 创建 `src/pages/index.vue` 作为首页
