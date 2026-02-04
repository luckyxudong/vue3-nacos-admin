# Design: 登录页面与认证系统

## Context
项目需要添加用户认证功能，包括登录页面、认证状态管理、路由守卫和 Mock 登录接口。登录页面需要符合项目设计规范，使用 shadcn-vue 组件，支持国际化，并集成到现有的路由和状态管理系统中。

## Goals / Non-Goals

### Goals
- 提供简洁美观的登录页面，符合项目设计规范
- 实现完整的认证流程（登录、登出、状态管理）
- 提供路由守卫机制，保护应用资源
- 支持 Mock 服务，便于开发测试
- 支持国际化，提供中英文界面
- 登录状态持久化，提升用户体验

### Non-Goals
- 不实现注册功能（后续可扩展）
- 不实现密码重置功能（后续可扩展）
- 不实现多因素认证（后续可扩展）
- 不实现权限管理（后续可扩展）

## Decisions

### Decision: 使用 Pinia Store 管理认证状态
**What**: 创建独立的认证 Store（`src/stores/modules/auth.ts`）管理用户登录状态和用户信息
**Why**:
- 符合项目现有的状态管理架构（使用 Pinia）
- 支持状态持久化（使用 `pinia-plugin-persistedstate`）
- 便于在多个组件中共享认证状态
- 符合项目模块化设计规范

**Alternatives considered**:
- 使用 Vuex: 项目已采用 Pinia，无需切换
- 使用组合式函数: 无法实现状态持久化，不符合需求

### Decision: 创建空白布局用于登录页
**What**: 创建 `src/layouts/blank.vue` 布局，只包含 `<router-view>`，无导航栏等 UI 元素
**Why**:
- 登录页不应显示导航栏，需要独立的布局
- 符合项目布局系统设计（支持自定义布局）
- 其他页面（如错误页）也可以使用空白布局

**Alternatives considered**:
- 在登录页中直接使用无布局: 不符合项目布局系统规范
- 修改默认布局: 会影响其他页面，不符合单一职责原则

### Decision: 使用路由守卫保护页面
**What**: 在 `router.beforeEach` 中添加路由守卫逻辑，检查登录状态并重定向
**Why**:
- 符合 Vue Router 最佳实践
- 集中管理路由访问控制逻辑
- 便于维护和扩展

**Alternatives considered**:
- 在组件中检查: 代码重复，难以维护
- 使用路由元信息: 需要配合路由守卫使用，不能替代

### Decision: Mock 登录接口使用固定账号
**What**: Mock 登录接口只接受 `admin/admin` 作为有效账号
**Why**:
- 简化开发测试流程
- 符合项目 Mock 服务设计规范
- 后续可扩展支持更多账号或动态账号

**Alternatives considered**:
- 支持多个固定账号: 当前需求不需要，后续可扩展
- 使用 MockJS 生成动态账号: 增加复杂度，不符合当前需求

### Decision: 登录状态持久化到 localStorage
**What**: 使用 `pinia-plugin-persistedstate` 将认证状态持久化到 localStorage
**Why**:
- 符合项目现有状态持久化方案
- 刷新页面后保持登录状态，提升用户体验
- 配置简单，无需额外代码

**Alternatives considered**:
- 使用 sessionStorage: 关闭标签页后丢失，不符合需求
- 手动管理 localStorage: 增加代码复杂度，不符合项目规范

## Risks / Trade-offs

### Risk: 路由守卫可能影响性能
**Mitigation**: 路由守卫逻辑简单，只检查 Store 状态，性能影响可忽略

### Risk: Mock 接口与真实接口不一致
**Mitigation**: Mock 接口遵循 `ApiResp<T>` 结构，与真实接口保持一致

### Trade-off: 登录状态持久化 vs 安全性
- **选择**: 持久化登录状态到 localStorage
- **原因**: 提升用户体验，符合常见 Web 应用实践
- **风险**: Token 存储在客户端，存在安全风险
- **缓解**: 后续可扩展 Token 刷新机制和过期处理

## Migration Plan

### 步骤
1. 创建认证相关文件（Store、Service、Mock、页面）
2. 添加路由守卫逻辑
3. 更新国际化语言包
4. 测试验证功能

### 回滚
- 删除新增文件
- 恢复路由配置
- 恢复语言包

## Open Questions
- 是否需要支持记住密码功能？（当前计划中未包含）
- 是否需要 Token 刷新机制？（当前使用 Mock，暂不需要）
