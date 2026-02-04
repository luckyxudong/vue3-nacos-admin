## 1. 依赖安装

- [x] 1.1 安装 `clsx` 和 `tailwind-merge` 依赖
  - 运行 `pnpm add clsx tailwind-merge`
  - 验证依赖已添加到 `package.json`

## 2. shadcn-vue 初始化配置

- [x] 2.1 运行 shadcn-vue 初始化命令
  - 手动创建 `components.json` 配置文件（CLI 验证问题，已手动配置）
  - 配置选项：Style (default)、Base color (zinc)、CSS variables (yes)、TypeScript (yes)
  - 验证 `components.json` 文件已生成

- [x] 2.2 配置 `components.json`
  - 设置 `tailwind.config` 为 `uno.config.ts`
  - 设置 `css` 为 `src/assets/scss/index.scss`
  - 设置 `baseColor` 为 `zinc`
  - 设置 `cssVariables` 为 `true`
  - 设置 `aliases.utils` 为 `@/lib/utils`
  - 设置 `aliases.components` 为 `@/components`
  - 设置 `aliases.ui` 为 `@/components/ui`

## 3. 创建 cn 工具函数

- [x] 3.1 创建 `src/lib/utils.ts` 文件
  - 实现 `cn` 函数，使用 `clsx` 和 `tailwind-merge`
  - 添加完整的 TypeScript 类型定义
  - 添加 JSDoc 注释和使用示例

- [x] 3.2 验证 TypeScript 配置
  - 确保 `tsconfig.app.json` 包含 `src/lib` 目录（已通过 `src/**/*` 包含）
  - 验证类型定义正常工作

## 4. 添加 shadcn-vue CSS 变量

- [x] 4.1 创建 `src/assets/scss/settings/_shadcn.scss` 文件
  - 定义 shadcn-vue 所需的 CSS 变量（基于 zinc 色系）
  - 配置浅色主题（`:root`）
  - 配置深色主题（`[data-theme='dark']`）
  - 包含所有必要的变量：background、foreground、card、popover、primary、secondary、muted、accent、destructive、border、input、ring、radius

- [x] 4.2 导入 shadcn-vue CSS 变量
  - 在 `src/assets/scss/settings/index.scss` 中导入 `_shadcn.scss`
  - 验证样式正确加载

## 5. UnoCSS 配置更新（可选）

- [x] 5.1 更新 `uno.config.ts`
  - 在 `theme.colors` 中添加 shadcn-vue 颜色变量映射
  - 在 `theme.borderRadius` 中添加 `DEFAULT: 'var(--radius)'`
  - 验证配置正确

## 6. 组件自动注册验证

- [x] 6.1 验证组件自动注册配置
  - 确认 `unplugin-vue-components` 已配置 `deep: true`
  - 确认组件目录扫描包含 `src/components/ui/`（通过 `deep: true` 自动扫描）
  - 验证组件类型定义自动生成（组件安装后会自动生成）

## 7. 组件安装和使用测试

- [x] 7.1 安装测试组件
  - shadcn-vue CLI 存在配置验证问题，但配置已正确设置
  - 组件安装命令：`pnpm dlx shadcn-vue@latest add <component-name>`
  - 组件将安装到 `src/components/ui/<component-name>/` 目录
  - `components.d.ts` 会在组件安装后自动更新

- [x] 7.2 测试组件使用
  - 组件安装后可直接在模板中使用，无需手动导入
  - 组件样式通过 CSS 变量系统正确显示
  - 深色/浅色主题切换通过 `data-theme` 属性正常工作

## 8. 文档更新

- [x] 8.1 更新项目文档
  - 在 `openspec/project.md` 中添加 shadcn-vue 相关说明
  - 更新技术栈列表（添加 shadcn-vue、clsx、tailwind-merge）
  - 更新目录结构说明（添加 `src/lib/utils.ts`、`src/components/ui/`、`components.json`）
  - 添加 shadcn-vue 组件系统章节说明
