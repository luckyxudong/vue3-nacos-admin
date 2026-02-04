# component-auto-registration Specification

## Purpose
组件自动注册系统为 Vue3 模板项目提供组件自动注册功能，自动注册 `src/components` 目录下的组件，无需手动导入即可使用，简化组件使用流程并确保 TypeScript 类型安全。
## Requirements
### Requirement: 组件自动注册插件配置
系统 SHALL 集成 `unplugin-vue-components` 插件，实现组件的自动注册功能。

#### Scenario: 插件安装和导入
- **WHEN** 开发者在项目中安装 `unplugin-vue-components` 开发依赖
- **THEN** 插件应作为开发依赖添加到 `package.json`
- **AND** 在 `vite.config.ts` 中应从 `unplugin-vue-components/vite` 导入 `Components`

#### Scenario: 插件基础配置
- **WHEN** 开发者在 `vite.config.ts` 中配置 `Components` 插件
- **THEN** 插件应配置 `deep: true`，支持扫描子目录
- **AND** 插件应配置 `directoryAsNamespace: false`，组件名不包含目录路径
- **AND** 插件默认应扫描 `src/components` 目录及子目录下的所有组件

### Requirement: 组件类型定义文件生成
系统 SHALL 自动生成组件类型声明文件，确保 TypeScript 类型安全。

#### Scenario: 类型文件自动生成
- **WHEN** 开发服务器启动时
- **THEN** 系统应在项目根目录自动生成 `components.d.ts` 类型定义文件
- **AND** 类型定义文件应包含所有 `src/components` 目录下组件的类型声明
- **AND** 类型定义文件应随组件的变化自动更新

#### Scenario: TypeScript 配置集成
- **WHEN** 开发者在 `tsconfig.app.json` 中配置 `include` 数组
- **THEN** 应包含 `components.d.ts` 文件
- **AND** TypeScript 编译器应识别自动注册组件的类型定义
- **AND** IDE 应提供组件的类型提示和自动补全

### Requirement: 组件自动注册
系统 SHALL 自动注册 `src/components` 目录下的组件，无需手动导入即可使用。

#### Scenario: 组件目录扫描
- **WHEN** 开发者在 `src/components` 目录下创建 Vue 组件文件（如 `src/components/icon/icon.vue`）
- **THEN** 系统应自动扫描并注册该组件
- **AND** 组件应可以在任何 Vue 文件中直接使用，无需手动导入

#### Scenario: 组件使用无需导入
- **WHEN** 开发者在 Vue 组件的模板中使用 `src/components` 目录下的组件（如 `<Icon />`）
- **THEN** 组件应正常渲染，无需在 `<script>` 中编写 `import Icon from '@/components/icon/icon.vue'`
- **AND** 浏览器控制台不应出现组件未解析的警告
- **AND** TypeScript 应提供组件的类型检查

#### Scenario: 子目录组件支持
- **WHEN** 开发者在 `src/components` 的子目录下创建组件（如 `src/components/form/input.vue`）
- **THEN** 系统应自动扫描并注册子目录下的组件
- **AND** 组件应可以直接使用，组件名不包含目录路径（如直接使用 `<Input />` 而非 `<FormInput />`）

#### Scenario: 组件名生成规则
- **WHEN** 组件文件名为 `icon.vue` 时
- **THEN** 组件名应为 `Icon`（PascalCase）
- **AND** 在模板中应使用 `<Icon />` 或 `<icon />`（Vue 支持两种写法）

### Requirement: 组件注册配置选项
系统 SHALL 支持组件自动注册的配置选项，允许自定义扫描行为。

#### Scenario: 深度扫描配置
- **WHEN** 开发者配置 `deep: true`
- **THEN** 系统应递归扫描 `src/components` 的所有子目录
- **AND** 嵌套目录下的组件应被正确注册

#### Scenario: 目录命名空间配置
- **WHEN** 开发者配置 `directoryAsNamespace: false`
- **THEN** 组件名不应包含目录路径
- **AND** 例如 `src/components/form/input.vue` 应注册为 `Input` 而非 `FormInput`

#### Scenario: 其他配置选项支持
- **WHEN** 开发者需要自定义组件扫描行为时
- **THEN** 系统应支持 `unplugin-vue-components` 提供的其他配置选项（如 `collapseSamePrefixes`）
- **AND** 配置应通过 `vite.config.ts` 中的 `Components` 插件配置传递

### Requirement: 组件类型安全
系统 SHALL 确保自动注册的组件具有完整的 TypeScript 类型支持。

#### Scenario: 组件类型声明
- **WHEN** 系统生成 `components.d.ts` 文件时
- **THEN** 文件应包含所有自动注册组件的类型声明
- **AND** 类型声明应正确引用组件的实际路径

#### Scenario: 组件 Props 类型检查
- **WHEN** 开发者使用自动注册的组件并传递 props
- **THEN** TypeScript 应提供 props 的类型检查
- **AND** 无效的 props 应触发类型错误

#### Scenario: 组件事件类型检查
- **WHEN** 开发者监听自动注册组件的事件
- **THEN** TypeScript 应提供事件类型的检查
- **AND** 事件处理函数的参数应具有正确的类型

