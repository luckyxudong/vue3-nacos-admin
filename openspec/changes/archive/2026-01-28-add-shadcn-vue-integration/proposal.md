# Change: 集成 shadcn-vue 组件系统

## Why

shadcn-vue 是一个基于 Vue 3 的组件代码分发平台，它不是一个传统的组件库，而是将组件代码直接复制到项目中，让开发者拥有完全的代码控制权。集成 shadcn-vue 可以为项目提供：

- **开放代码**：组件代码直接存在于项目中，可以自由修改和定制
- **组合式设计**：所有组件使用统一的组合式接口，与 Vue 3 最佳实践一致
- **美观的默认样式**：精心设计的默认样式，开箱即用
- **AI 友好**：开放的代码结构，便于 AI 工具理解和改进
- **类型安全**：完整的 TypeScript 类型定义支持

## What Changes

- **新增依赖**：安装 `clsx` 和 `tailwind-merge` 用于类名合并工具
- **初始化配置**：运行 shadcn-vue CLI 初始化命令，生成 `components.json` 配置文件
- **工具函数**：创建 `cn` 工具函数（`src/lib/utils.ts`）用于智能合并类名
- **CSS 变量**：添加 shadcn-vue 所需的 CSS 变量定义（`src/assets/scss/settings/_shadcn.scss`）
- **UnoCSS 配置**：可选地更新 UnoCSS 配置，映射 shadcn-vue CSS 变量到主题系统
- **组件自动注册**：确保 shadcn-vue 组件能够被现有的组件自动注册系统识别
- **组件安装和使用**：支持通过 CLI 安装组件，组件自动注册，无需手动导入

## Impact

- **受影响的规范**：
  - `shadcn-vue-integration`（新增）
  - `component-auto-registration`（可能需要验证兼容性）
- **受影响的代码**：
  - `src/lib/utils.ts`（新增）
  - `src/assets/scss/settings/_shadcn.scss`（新增）
  - `src/assets/scss/settings/index.scss`（修改）
  - `uno.config.ts`（可选修改）
  - `components.json`（新增）
  - `package.json`（新增依赖）
- **新增目录**：
  - `src/components/ui/`（shadcn-vue 组件安装目录）
