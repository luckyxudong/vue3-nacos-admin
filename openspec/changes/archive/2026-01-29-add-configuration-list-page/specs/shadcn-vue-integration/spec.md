## MODIFIED Requirements

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
