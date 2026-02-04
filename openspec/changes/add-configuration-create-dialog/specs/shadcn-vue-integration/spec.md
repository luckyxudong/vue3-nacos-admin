## ADDED Requirements

### Requirement: Textarea 组件
系统 SHALL 提供 Textarea 组件用于多行文本输入。

#### Scenario: 安装 Textarea 组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add textarea` 命令
- **THEN** Textarea 组件被安装到 `src/components/ui/textarea/` 目录
- **AND** 组件文件包含完整的 TypeScript 类型定义
- **AND** `components.d.ts` 自动更新

#### Scenario: Textarea 组件功能
- **WHEN** 使用 Textarea 组件
- **THEN** 组件支持 v-model 双向绑定
- **AND** 组件支持 placeholder 属性
- **AND** 组件支持 disabled 属性
- **AND** 组件无需手动导入即可在模板中使用
- **AND** 组件样式正确显示
- **AND** 组件支持深色/浅色主题切换

#### Scenario: Textarea 组件使用
- **WHEN** 在 Vue 组件模板中使用 `<Textarea v-model="value" placeholder="请输入内容" />`
- **THEN** 组件正确渲染为多行文本输入框
- **AND** 输入内容正确绑定到 v-model 变量
- **AND** TypeScript 提供完整的类型检查和 IDE 自动补全

### Requirement: RadioGroup 组件
系统 SHALL 提供 RadioGroup 组件用于单选组选择。

#### Scenario: 安装 RadioGroup 组件
- **WHEN** 运行 `pnpm dlx shadcn-vue@latest add radio-group` 命令
- **THEN** RadioGroup 和 RadioGroupItem 组件被安装到 `src/components/ui/radio-group/` 目录
- **AND** 组件文件包含完整的 TypeScript 类型定义
- **AND** `components.d.ts` 自动更新

#### Scenario: RadioGroup 组件功能
- **WHEN** 使用 RadioGroup 组件
- **THEN** 组件支持 v-model 双向绑定
- **AND** 组件支持多个 RadioGroupItem 子项
- **AND** 组件无需手动导入即可在模板中使用
- **AND** 组件样式正确显示
- **AND** 组件支持深色/浅色主题切换

#### Scenario: RadioGroup 组件使用
- **WHEN** 在 Vue 组件模板中使用 RadioGroup 组件
- **THEN** 组件正确渲染为单选组
- **AND** 选择项正确绑定到 v-model 变量
- **AND** TypeScript 提供完整的类型检查和 IDE 自动补全
- **AND** 组件支持键盘导航和可访问性
