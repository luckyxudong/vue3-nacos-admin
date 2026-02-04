# 创建配置功能设计文档

## Context

在配置列表页面实现创建配置功能，用户点击"创建配置"按钮时，通过 Dialog 弹出框展示表单，用户可以输入配置信息并提交创建。

## Goals / Non-Goals

### Goals
- 提供完整的创建配置表单界面
- 支持多种配置格式（TEXT/JSON/XML/YAML/HTML/Properties）
- 实现严格的格式校验，确保配置内容符合所选格式
- 提供友好的用户交互体验（验证提示、错误处理）

### Non-Goals
- 代码编辑器集成（Monaco Editor/CodeMirror）- 暂时使用 Textarea，后续扩展
- 配置内容自动格式化功能 - 后续优化
- 归属应用字段的搜索下拉功能 - 暂时使用 Input，后续扩展

## Decisions

### Decision: 使用 Dialog 而非跳转页面
**What**: 创建配置功能通过 Dialog 弹出框实现，而非跳转到独立页面。

**Why**: 
- 保持用户在列表页面的上下文
- 减少页面跳转，提升用户体验
- Dialog 模式更适合快速创建操作

**Alternatives considered**:
- 跳转到独立创建页面：需要额外的路由和页面维护，用户体验不如 Dialog 流畅

### Decision: 使用 shadcn-vue 组件
**What**: Textarea 和 RadioGroup 组件通过 shadcn-vue CLI 安装。

**Why**:
- 与项目现有的 shadcn-vue 组件系统保持一致
- 组件自动注册，无需手动导入
- 完整的 TypeScript 类型支持
- 可以自由修改和定制组件代码

**Alternatives considered**:
- 自定义组件：需要额外开发时间，且与现有组件系统不一致

### Decision: 配置格式校验工具函数独立实现
**What**: 创建独立的 `validateContent.ts` 工具函数文件，提供配置格式校验功能。

**Why**:
- 工具函数可复用，后续编辑配置等功能也可使用
- 职责清晰，便于测试和维护
- 支持多种格式的统一接口

**Alternatives considered**:
- 在组件内实现：代码耦合度高，不利于复用

### Decision: 格式校验失败允许用户继续提交
**What**: 格式校验失败时，显示错误提示并询问用户是否继续提交。

**Why**:
- 某些情况下用户可能确实需要提交格式不正确的配置（如测试场景）
- 提供灵活性，避免过度限制用户操作

**Alternatives considered**:
- 严格阻止提交：可能在某些场景下过于严格

### Decision: 使用 js-yaml 库进行 YAML 校验
**What**: 安装 `js-yaml` 库用于 YAML 格式校验。

**Why**:
- YAML 格式复杂，需要专业的解析库
- js-yaml 是成熟稳定的库，广泛使用
- 提供详细的错误信息

**Alternatives considered**:
- 正则表达式校验：YAML 格式复杂，正则难以准确校验

## Risks / Trade-offs

### Risk: YAML 校验依赖外部库
**Mitigation**: js-yaml 是成熟稳定的库，维护良好，风险较低。

### Risk: 配置格式校验可能影响性能
**Mitigation**: 
- 校验仅在提交时进行，不影响输入体验
- JSON/XML 使用浏览器原生 API，性能良好
- YAML 解析库经过优化，性能可接受

### Risk: 格式校验错误信息可能不够详细
**Mitigation**: 
- 提供基本的错误信息
- 后续可扩展显示详细错误位置（行号、列号）

## Migration Plan

无需迁移，这是新功能添加。

## Open Questions

- [ ] 后续是否需要集成 Monaco Editor 作为代码编辑器？
- [ ] 是否需要支持配置内容的自动格式化功能？
- [ ] 归属应用字段是否需要改为带搜索的 Combobox 组件？
