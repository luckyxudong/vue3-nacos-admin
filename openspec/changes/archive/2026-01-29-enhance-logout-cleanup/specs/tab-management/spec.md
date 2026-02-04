## ADDED Requirements

### Requirement: Tab状态重置
系统 SHALL 提供Tab状态重置功能，用于在登出时重置Tab状态到初始值。

#### Scenario: Tab状态重置方法
- **WHEN** 查看 `src/stores/modules/tabs.ts`
- **THEN** 必须提供 `reset()` 方法
- **AND** `reset()` 方法必须将 `tabs` 重置为仅包含首页的数组：`[{ title: 'layout.home', path: '/', closable: false }]`
- **AND** `reset()` 方法必须将 `activeTab` 重置为 `'/'`

#### Scenario: Tab状态重置使用
- **WHEN** 调用 Tabs Store 的 `reset()` 方法
- **THEN** Tab列表应重置为仅包含首页
- **AND** 当前激活的Tab应重置为首页
