# Change: 添加自动导入和组件自动注册功能

## Why

当前项目在开发过程中需要频繁手动编写 `import` 语句来导入 Vue、Vue Router、Pinia 等核心库的 API，以及手动导入组件。这些重复性的工作降低了开发效率，也容易产生遗漏和冲突。

通过集成 `unplugin-auto-import` 和 `unplugin-vue-components` 插件，可以实现：
- 自动导入 Vue、Vue Router、Pinia、VueUse 等库的 API，无需手动编写 import 语句
- 自动注册 `src/components` 目录下的组件，无需手动导入即可使用
- 提升开发效率，减少样板代码，降低出错概率

## What Changes

- **新增自动导入系统**：集成 `unplugin-auto-import` 插件，支持 Vue、Vue Router（自动路由）、Pinia、VueUse 的自动导入
- **新增组件自动注册系统**：集成 `unplugin-vue-components` 插件，自动注册 `src/components` 目录下的组件
- **集成 VueUse 工具集**：添加 `@vueuse/core` 依赖，通过自动导入机制提供丰富的组合式 API hooks
- **类型定义支持**：自动生成 `auto-imports.d.ts` 和 `components.d.ts` 类型声明文件，确保 TypeScript 类型安全
- **配置更新**：更新 `vite.config.ts`、`tsconfig.app.json` 等配置文件

## Impact

- **新增能力**：
  - `auto-import-system`：自动导入系统能力
  - `component-auto-registration`：组件自动注册能力
- **受影响代码**：
  - `vite.config.ts`：添加插件配置
  - `tsconfig.app.json`：添加类型定义文件包含
  - `package.json`：添加新依赖
  - 所有 Vue 组件文件：可以移除手动 import 语句
- **开发体验提升**：
  - 减少样板代码，提升开发效率
  - 降低手动导入导致的错误
  - 提供更好的类型安全支持
