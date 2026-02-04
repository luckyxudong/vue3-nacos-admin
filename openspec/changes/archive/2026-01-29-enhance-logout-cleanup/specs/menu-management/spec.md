## ADDED Requirements

### Requirement: 菜单状态重置
系统 SHALL 提供菜单状态重置功能，用于在登出时重置菜单状态到初始值。

#### Scenario: 菜单状态重置方法
- **WHEN** 查看 `src/stores/modules/menu.ts`
- **THEN** 必须提供 `reset()` 方法
- **AND** `reset()` 方法必须将 `expandedMenus` 重置为 `['/overview']`
- **AND** `reset()` 方法必须将 `isCollapsed` 重置为 `false`

#### Scenario: 菜单状态重置使用
- **WHEN** 调用 Menu Store 的 `reset()` 方法
- **THEN** 菜单展开状态应重置为默认值（仅概览菜单展开）
- **AND** 侧边栏折叠状态应重置为展开状态
