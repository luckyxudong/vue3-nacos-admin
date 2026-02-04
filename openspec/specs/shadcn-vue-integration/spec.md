# shadcn-vue-integration Specification

## Purpose
提供 shadcn-vue 组件系统的完整集成，包括依赖安装、配置初始化、工具函数、CSS 变量定义、UnoCSS 主题映射、组件自动注册以及组件安装和使用功能。shadcn-vue 是一个基于 Vue 3 的组件代码分发平台，将组件代码直接复制到项目中，让开发者拥有完全的代码控制权。
## Requirements
### Requirement: shadcn-vue 依赖安装
系统 SHALL 安装 shadcn-vue 组件系统所需的依赖包。

#### Scenario: 安装 clsx 和 tailwind-merge
- **WHEN** 执行依赖安装命令
- **THEN** `clsx` 和 `tailwind-merge` 包被安装到项目中
- **AND** 依赖被添加到 `package.json` 的 `dependencies` 中

### Requirement: shadcn-vue 初始化配置
系统 SHALL 提供 shadcn-vue 初始化配置功能。

#### Scenario: 运行初始化命令生成配置文件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest init` 命令
- **THEN** `components.json` 配置文件被生成在项目根目录
- **AND** 配置文件包含必要的配置项：style、tailwind、typescript、aliases

#### Scenario: 配置 components.json
- **WHEN** 配置 `components.json` 文件
- **THEN** `tailwind.config` 设置为 `uno.config.ts`
- **AND** `css` 设置为 `src/assets/scss/index.scss`
- **AND** `baseColor` 设置为 `zinc`
- **AND** `cssVariables` 设置为 `true`
- **AND** `aliases.utils` 设置为 `@/lib/utils`
- **AND** `aliases.components` 设置为 `@/components`

### Requirement: cn 工具函数
系统 SHALL 提供 `cn` 工具函数用于智能合并类名。

#### Scenario: 创建 cn 工具函数
- **WHEN** 创建 `src/lib/utils.ts` 文件
- **THEN** 文件包含 `cn` 函数实现
- **AND** `cn` 函数使用 `clsx` 合并类名
- **AND** `cn` 函数使用 `tailwind-merge` 处理 Tailwind/UnoCSS 类名冲突
- **AND** 函数提供完整的 TypeScript 类型定义
- **AND** 函数包含 JSDoc 注释和使用示例

#### Scenario: cn 函数使用
- **WHEN** 调用 `cn('px-2 py-1', 'bg-red-500', { 'text-white': true })`
- **THEN** 返回合并后的类名字符串
- **AND** 冲突的类名被智能合并（如 `cn('px-2', 'px-4')` 返回 `'px-4'`）

### Requirement: shadcn-vue CSS 变量定义
系统 SHALL 定义 shadcn-vue 组件所需的 CSS 变量。

#### Scenario: 创建 shadcn-vue CSS 变量文件
- **WHEN** 创建 `src/assets/scss/settings/_shadcn.scss` 文件
- **THEN** 文件定义基于 zinc 色系的颜色变量
- **AND** 文件在 `:root` 中定义浅色主题的 CSS 变量
- **AND** 文件在 `[data-theme='dark']` 中定义深色主题的 CSS 变量
- **AND** 包含所有必要的变量：background、foreground、card、popover、primary、secondary、muted、accent、destructive、border、input、ring、radius

#### Scenario: 导入 shadcn-vue CSS 变量
- **WHEN** 在 `src/assets/scss/settings/index.scss` 中导入 `_shadcn.scss`
- **THEN** shadcn-vue CSS 变量在应用中可用
- **AND** 主题切换时变量值正确更新

### Requirement: UnoCSS 主题映射（可选）
系统 SHALL 支持可选地将 shadcn-vue CSS 变量映射到 UnoCSS 主题配置。

#### Scenario: 更新 UnoCSS 配置
- **WHEN** 更新 `uno.config.ts` 配置
- **THEN** `theme.colors` 中包含 shadcn-vue 颜色变量映射
- **AND** `theme.borderRadius.DEFAULT` 设置为 `var(--radius)`
- **AND** 映射后的变量可以在 UnoCSS 工具类中使用

### Requirement: 组件自动注册集成
系统 SHALL 确保 shadcn-vue 组件能够被现有的组件自动注册系统识别。

#### Scenario: 组件自动扫描
- **WHEN** shadcn-vue 组件安装在 `src/components/ui/` 目录
- **THEN** 组件自动注册系统扫描并识别这些组件
- **AND** 组件类型定义自动生成在 `components.d.ts` 中
- **AND** 组件无需手动导入即可在模板中使用

#### Scenario: 组件类型安全
- **WHEN** 使用 shadcn-vue 组件
- **THEN** TypeScript 提供完整的类型检查和 IDE 自动补全
- **AND** 组件 props 和事件都有类型提示

### Requirement: 组件安装和使用
系统 SHALL 支持通过 CLI 安装 shadcn-vue 组件，并支持直接使用。

#### Scenario: 安装组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add <component-name>` 命令
- **THEN** 组件被安装到 `src/components/ui/<component-name>/` 目录
- **AND** 组件文件包含完整的 TypeScript 类型定义
- **AND** `components.d.ts` 自动更新

#### Scenario: 使用组件
- **WHEN** 在 Vue 组件模板中使用 shadcn-vue 组件
- **THEN** 组件无需手动导入即可使用
- **AND** 组件样式正确显示
- **AND** 组件支持深色/浅色主题切换
- **AND** 组件可以自由修改和定制

#### Scenario: 组件自定义
- **WHEN** 修改 shadcn-vue 组件代码
- **THEN** 修改后的代码在项目中生效
- **AND** 组件保持类型安全
- **AND** 组件更新时需要注意保留自定义修改

#### Scenario: 安装 table 组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add table` 命令
- **THEN** table 组件被安装到 `src/components/ui/table/` 目录
- **AND** 组件支持表格展示、排序、行选择等功能

#### Scenario: 安装 select 组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add select` 命令
- **THEN** select 组件被安装到 `src/components/ui/select/` 目录
- **AND** 组件支持下拉选择、搜索、多选等功能

#### Scenario: 安装 switch 组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add switch` 命令
- **THEN** switch 组件被安装到 `src/components/ui/switch/` 目录
- **AND** 组件支持开关切换功能

#### Scenario: 安装 pagination 组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add pagination` 命令
- **THEN** pagination 组件被安装到 `src/components/ui/pagination/` 目录
- **AND** 组件支持页码切换、每页数量选择等功能

#### Scenario: 安装 form 组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add form` 命令
- **THEN** form 组件被安装到 `src/components/ui/form/` 目录
- **AND** 组件支持表单布局、验证等功能

#### Scenario: 安装 dropdown-menu 组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add dropdown-menu` 命令
- **THEN** dropdown-menu 组件被安装到 `src/components/ui/dropdown-menu/` 目录
- **AND** 组件支持下拉菜单、菜单项点击事件等功能

