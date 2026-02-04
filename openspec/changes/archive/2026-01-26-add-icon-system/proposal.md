# Change: 添加图标系统支持

## Why

项目需要一套完整的图标解决方案，以支持多种图标使用场景：
1. 通过 UnoCSS 使用 Iconify 图标库，提供丰富的图标选择
2. 支持本地 SVG 图标，满足 UI 设计师提供的自定义图标需求
3. 提供统一的 Icon 组件，简化图标使用方式，支持多种图标类型（UnoCSS、Iconify、本地 SVG、Iconfont）

这将为模板项目提供灵活、高效的图标使用能力，满足不同场景下的图标需求。

## What Changes

- **UnoCSS 图标支持**：集成 `@iconify/json` 和 `presetIcons`，通过类名使用 Iconify 图标库
- **本地 SVG 图标支持**：集成 `vite-plugin-svg-icons`，支持使用本地 SVG 图标文件
- **Icon 组件**：创建统一的图标组件，支持四种使用方式（UnoCSS、Iconify、本地 SVG、Iconfont）
- **配置更新**：更新 `uno.config.ts` 和 `vite.config.ts` 以支持图标功能
- **目录结构**：创建 `src/components/icon/` 目录和 `src/assets/icons/` 目录

## Impact

- **新增依赖**：
  - `@iconify/json`（开发依赖）
  - `vite-plugin-svg-icons`（开发依赖）
  - `@iconify/vue`（可选，运行时依赖）
- **配置文件**：
  - `uno.config.ts`：添加 `presetIcons` 配置
  - `vite.config.ts`：添加 SVG 图标插件配置
- **新增文件**：
  - `src/components/icon/icon.vue`：Icon 组件
  - `src/assets/icons/`：本地 SVG 图标目录
- **修改文件**：
  - `src/main.ts`：可能需要导入 SVG 图标注册代码（`virtual:svg-icons-register`）
