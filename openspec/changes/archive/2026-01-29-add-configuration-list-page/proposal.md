# Change: 添加配置列表页面功能

## Why

根据配置管理系统的需求，需要实现配置列表页面功能，包括多条件查询、模糊搜索、分页排序等。当前 Mock 数据不支持 tenant（命名空间）隔离，且查询功能不完整。同时需要集成 shadcn-vue 组件以提供美观的 UI 界面。

## What Changes

- **Mock 数据优化**：重构 `mock/config.ts`，支持 tenant 隔离、模糊搜索、多条件组合查询
- **shadcn-vue 组件安装**：安装 table、select、switch、pagination、form、dropdown-menu 等组件
- **配置列表页面**：创建配置列表页面，实现查询表单、表格展示、分页、批量操作等功能
- **命名空间集成**：集成命名空间切换功能，支持数据隔离

## Impact

- **Affected specs**: 
  - `mock-service` - 需要增强 Mock 数据功能
  - `shadcn-vue-integration` - 需要添加新组件支持
  - 新增 `configuration-list-page` capability
- **Affected code**: 
  - `mock/config.ts` - Mock 数据重构
  - `src/pages/configuration/list.vue` - 新建配置列表页面
  - `src/services/configuration/config-service.ts` - 已存在，无需修改
  - shadcn-vue 组件安装到 `src/components/ui/`
