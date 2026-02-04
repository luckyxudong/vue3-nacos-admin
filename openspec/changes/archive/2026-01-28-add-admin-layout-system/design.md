# Design: 后台管理系统Layout布局架构设计

## Context

项目需要实现一个完整的后台管理系统Layout，包括左侧菜单、顶部工具栏、页面Tab管理和首页问候卡片。该布局需要符合项目现有的UI风格（shadcn-vue组件、UnoCSS样式、SCSS变量系统），支持主题切换、国际化，并与现有的路由系统、状态管理系统集成。

## Goals / Non-Goals

### Goals
- 提供完整的后台管理系统布局结构
- 支持多级菜单导航，菜单可展开/折叠
- 支持页面Tab管理，方便多页面切换
- 提供面包屑导航，清晰展示页面层级
- 集成主题切换、语言切换、用户信息展示
- 首页提供友好的问候卡片
- 符合项目UI风格和设计规范
- 支持响应式设计（移动端菜单可折叠）

### Non-Goals
- 不实现复杂的权限控制（后续可扩展）
- 不实现菜单的动态加载（当前使用Mock数据）
- 不实现Tab的拖拽排序（基础功能即可）
- 不实现天气API集成（使用Mock数据）

## Decisions

### Decision: 使用Pinia Store管理菜单和Tab状态
**What**: 创建独立的Store模块（`menu.ts`和`tabs.ts`）管理菜单配置和Tab列表
**Why**:
- 符合项目现有的状态管理架构（使用Pinia）
- 支持状态持久化（菜单展开状态、Tab列表）
- 便于在多个组件中共享状态
- 符合项目模块化设计规范

**Alternatives considered**:
- 使用组件内状态：无法在多个组件间共享，不符合需求
- 使用Vuex：项目已采用Pinia，无需切换

### Decision: 菜单配置使用Mock数据
**What**: 菜单数据硬编码在Store中，包含多级菜单结构
**Why**:
- 简化实现，快速满足需求
- 符合当前项目阶段（模板项目）
- 后续可扩展为从API加载

**Alternatives considered**:
- 从API加载：增加复杂度，当前阶段不需要
- 使用配置文件：增加文件管理复杂度，当前不需要

### Decision: Tab管理自动监听路由变化
**What**: Tab Store监听路由变化，自动添加新页面到Tab列表
**Why**:
- 自动化管理，减少手动操作
- 符合用户使用习惯
- 与路由系统深度集成

**Alternatives considered**:
- 手动添加Tab：增加用户操作，不符合现代后台系统习惯
- 使用路由配置：不够灵活，无法动态管理

### Decision: 面包屑基于路由和菜单配置生成
**What**: 根据当前路由路径和菜单配置生成面包屑路径
**Why**:
- 自动生成，无需手动配置
- 与菜单结构保持一致
- 支持动态路由

**Alternatives considered**:
- 路由meta配置：需要为每个路由配置，增加维护成本
- 固定配置：不够灵活，无法适应动态路由

### Decision: 使用shadcn-vue组件构建UI
**What**: 使用项目已有的shadcn-vue组件（Card、Button等）构建布局组件
**Why**:
- 符合项目UI风格
- 组件已集成，无需额外依赖
- 支持主题切换和自定义样式

**Alternatives considered**:
- 使用Element Plus：项目已选择shadcn-vue，无需切换
- 完全自定义：增加开发成本，不符合项目规范

### Decision: 菜单折叠后只显示图标
**What**: 菜单折叠时隐藏文字，只显示图标，节省空间
**Why**:
- 符合现代后台系统设计规范
- 节省屏幕空间
- 提升用户体验

**Alternatives considered**:
- 完全隐藏：用户无法看到菜单，不符合需求
- 显示部分文字：空间占用仍然较大

## Risks / Trade-offs

### Risk: 菜单和Tab状态持久化可能影响性能
**Mitigation**: 使用Pinia的持久化插件，性能影响可忽略

### Risk: 多级菜单嵌套过深可能影响渲染性能
**Mitigation**: 当前菜单层级不超过2级，性能影响可忽略；后续可考虑虚拟滚动

### Trade-off: Tab自动管理 vs 用户控制
- **选择**: Tab自动管理
- **原因**: 符合现代后台系统习惯，提升用户体验
- **风险**: 用户可能打开过多Tab
- **缓解**: 提供关闭功能，支持关闭其他Tab（可选）

### Trade-off: Mock菜单数据 vs API加载
- **选择**: Mock数据
- **原因**: 简化实现，快速满足需求
- **风险**: 后续需要重构
- **缓解**: Store设计支持后续扩展为API加载

## Migration Plan

### 步骤
1. 创建菜单和Tab Store
2. 创建布局组件（Sidebar、Header、Tabs、GoodMorningCard）
3. 重构主布局，集成所有组件
4. 更新首页，添加早安卡片
5. 添加国际化文本
6. 测试验证功能

### 回滚
- 恢复 `src/layouts/default.vue` 到原始版本
- 删除新增的Store和组件文件
- 恢复首页到原始版本
- 恢复语言包

## Open Questions
- 是否需要支持菜单权限控制？（当前计划中未包含）
- 是否需要支持Tab固定功能？（当前计划中未包含）
- 是否需要支持菜单搜索功能？（当前计划中未包含）
