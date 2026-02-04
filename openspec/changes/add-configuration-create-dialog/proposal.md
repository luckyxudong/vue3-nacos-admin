# Change: 添加配置创建对话框功能

## Why

配置列表页面已有"创建配置"按钮，但当前仅输出 console.log，缺少实际的创建功能。用户需要通过弹出框表单来创建新配置，包括完整的字段输入、格式验证和提交逻辑。

## What Changes

- 在配置列表页面添加创建配置的 Dialog 弹出框
- 创建 Textarea 和 RadioGroup 组件（shadcn-vue 组件）
- 实现配置格式校验工具函数（支持 JSON/XML/YAML/HTML/Properties 格式）
- 实现表单验证逻辑（必填字段、特殊字符验证、格式校验）
- 实现提交前检查配置是否存在的逻辑
- 实现提交逻辑（调用 createOrUpdate 接口，成功后刷新列表）

## Impact

- **Affected specs**: 
  - `configuration-list-page` - 添加创建配置 Dialog 功能
  - `shadcn-vue-integration` - 添加 Textarea 和 RadioGroup 组件
- **Affected code**: 
  - `src/pages/config/list.vue` - 添加 Dialog 弹出框和相关逻辑
  - `src/components/ui/textarea/` - 新建 Textarea 组件
  - `src/components/ui/radio-group/` - 新建 RadioGroup 组件
  - `src/utils/validateContent.ts` - 新建配置格式校验工具函数
- **Dependencies**: 
  - 需要安装 `js-yaml` 库用于 YAML 格式校验
