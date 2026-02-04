# Design: 配置列表页面功能实现

## Context

配置列表页面是配置管理系统的核心功能之一，需要支持多条件查询、模糊搜索、分页排序、批量操作等功能。当前 Mock 数据不支持 tenant 隔离，查询功能不完整。需要优化 Mock 数据并实现完整的配置列表页面。

## Goals / Non-Goals

### Goals
- 实现完整的配置列表查询功能，支持多条件组合查询
- 支持 tenant（命名空间）数据隔离
- 支持模糊搜索和精确搜索两种模式
- 提供美观的 UI 界面，使用 shadcn-vue 组件
- 支持表格排序、行选择、分页等功能
- 支持批量操作（删除、克隆、导出）

### Non-Goals
- 不实现配置详情页面（后续实现）
- 不实现配置编辑页面（后续实现）
- 不实现配置导入导出功能（后续实现）

## Decisions

### Decision: Mock 数据结构优化
**What**: 将 `configList` 改为按 tenant 分组的结构 `configListByTenant: Record<string, Config[]>`

**Why**: 
- 支持不同 tenant 的数据隔离
- 便于管理和查询不同命名空间的配置数据
- 符合实际业务场景

**Alternatives considered**:
- 在数组中添加 tenant 字段，每次查询时过滤：性能较差，需要遍历整个数组
- 使用 Map 结构：功能类似，但 Record 更符合 TypeScript 习惯

### Decision: 模糊搜索实现方式
**What**: 当 `search=blur` 时，处理通配符 `*`，使用字符串包含匹配

**Why**:
- 符合用户使用习惯（如 `*keyword*` 或 `keyword`）
- 实现简单，性能可接受（Mock 数据量不大）

**Alternatives considered**:
- 使用正则表达式：功能更强大，但实现复杂，性能较差
- 使用第三方搜索库：过度设计，Mock 数据不需要

### Decision: 分页处理顺序
**What**: 先过滤，再分页

**Why**:
- 确保分页结果准确
- 符合后端 API 的实际行为

**Alternatives considered**:
- 先分页，再过滤：结果不准确，不符合实际场景

### Decision: shadcn-vue 组件选择
**What**: 使用 table、select、switch、pagination、form、dropdown-menu 等组件

**Why**:
- shadcn-vue 组件美观、可定制
- 组件代码在项目中，可自由修改
- 符合项目已有的技术栈

**Alternatives considered**:
- Element Plus：需要引入整个组件库，体积大
- Ant Design Vue：同上
- 自定义组件：开发成本高

## Risks / Trade-offs

### Risk: Mock 数据性能问题
**Mitigation**: Mock 数据量控制在合理范围（每个 tenant 30-50 条），如果数据量大，可以考虑使用索引或优化过滤算法

### Risk: 组件兼容性问题
**Mitigation**: 使用 shadcn-vue 官方组件，确保版本兼容性

### Risk: 命名空间切换时的状态管理
**Mitigation**: 切换命名空间时重置查询条件和分页，确保数据一致性

## Migration Plan

1. **Phase 1**: Mock 数据优化（不影响现有功能）
2. **Phase 2**: 安装 shadcn-vue 组件（新增组件，不影响现有代码）
3. **Phase 3**: 实现配置列表页面（新增页面，不影响现有页面）
4. **Phase 4**: 测试验证

**Rollback**: 如果出现问题，可以回退到之前的版本，Mock 数据优化可以保留向后兼容的代码

## Open Questions

- 是否需要支持配置列表的导出功能？（计划文档中提到，但标记为后续实现）
- 是否需要支持配置列表的导入功能？（计划文档中提到，但标记为后续实现）
- 表格排序是在客户端实现还是调用后端接口？（计划文档中提到"表格排序在客户端实现（或调用后端接口）"，需要确认）
