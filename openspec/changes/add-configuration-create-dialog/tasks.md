## 1. 创建 shadcn-vue 组件

- [x] 1.1 安装 Textarea 组件（`pnpm dlx shadcn-vue@latest add textarea`）
- [x] 1.2 安装 RadioGroup 组件（`pnpm dlx shadcn-vue@latest add radio-group`）
- [x] 1.3 验证组件自动注册和类型定义生成

## 2. 创建配置格式校验工具函数

- [x] 2.1 安装 js-yaml 依赖（`pnpm add js-yaml`）
- [x] 2.2 创建 `src/utils/validateContent.ts` 文件
- [x] 2.3 实现 `validateContent.validate()` 函数，支持 text/json/xml/yaml/html/properties 格式校验
- [x] 2.4 添加 TypeScript 类型定义（ValidateResult 接口）
- [x] 2.5 实现各格式的详细错误信息返回

## 3. 实现创建配置 Dialog

- [x] 3.1 在 `list.vue` 中添加 Dialog 组件结构（Dialog、DialogContent、DialogHeader、DialogTitle、DialogFooter）
- [x] 3.2 添加 Dialog 显示状态管理（dialogOpen ref）
- [x] 3.3 修改 `handleCreate` 方法，打开 Dialog 而非 console.log

## 4. 实现表单字段

- [x] 4.1 创建表单数据结构（formData ref）
- [x] 4.2 实现 Data ID 字段（Input 组件，必填）
- [x] 4.3 实现 Group 字段（Input 组件，必填，默认值 DEFAULT_GROUP）
- [x] 4.4 实现标签字段（Input 组件，可选）
- [x] 4.5 实现归属应用字段（Input 组件，可选，后续可扩展为 Select）
- [x] 4.6 实现描述字段（Textarea 组件，可选）
- [x] 4.7 实现配置格式字段（RadioGroup 组件，必填，默认 TEXT）
- [x] 4.8 实现配置内容字段（Textarea 组件，必填，深色主题样式）

## 5. 实现表单验证逻辑

- [x] 5.1 实现 Data ID 验证（必填、特殊字符验证）
- [x] 5.2 实现 Group 验证（必填、最大长度 127、特殊字符验证）
- [x] 5.3 实现配置内容必填验证
- [x] 5.4 实现配置格式语法验证（调用 validateContent.validate）
- [x] 5.5 添加表单验证错误提示显示

## 6. 实现提交前检查逻辑

- [x] 6.1 实现格式校验检查（调用 validateContent.validate）
- [x] 6.2 实现格式校验失败时的用户确认对话框
- [x] 6.3 实现配置存在性检查（调用 configService.getDetail）
- [x] 6.4 处理配置已存在的情况（显示错误提示）

## 7. 实现提交逻辑

- [x] 7.1 实现提交方法（调用 configService.createOrUpdate）
- [x] 7.2 实现参数转换（dataId、group、content、appName、desc、config_tags、type、tenant）
- [x] 7.3 实现提交成功后的处理（关闭 Dialog、刷新列表、显示成功提示）
- [x] 7.4 实现提交失败的错误处理

## 8. 样式和用户体验优化

- [x] 8.1 添加代码编辑器样式（等宽字体、深色背景、行号显示）
- [x] 8.2 优化表单布局和响应式设计
- [x] 8.3 实现 Dialog 关闭时重置表单数据
- [x] 8.4 添加加载状态显示（提交中禁用按钮）

## 9. 测试和验证

- [x] 9.1 测试各字段的验证逻辑
- [x] 9.2 测试各配置格式的校验功能
- [x] 9.3 测试提交成功和失败的场景
- [x] 9.4 验证组件自动注册和类型安全
