# tab-management Specification

## Purpose
TBD - created by archiving change add-admin-layout-system. Update Purpose after archive.
## Requirements
### Requirement: Tab管理Store
系统 SHALL 提供一个Tab管理Store，管理打开的页面列表和激活状态。

#### Scenario: Tab管理Store创建
- **WHEN** 系统初始化时
- **THEN** 系统应创建Tab管理Store（`src/stores/modules/tabs.ts`）
- **AND** Store应定义Tab类型（TabItem），包含title、path、closable等字段
- **AND** Store应管理Tab列表（tabs数组）
- **AND** Store应管理当前激活的Tab（activeTab）

#### Scenario: Tab自动添加
- **WHEN** 用户访问新页面时
- **THEN** 系统应自动将该页面添加到Tab列表
- **AND** 如果Tab已存在，不应重复添加
- **AND** 新添加的Tab应自动设置为激活状态

#### Scenario: Tab切换
- **WHEN** 用户点击Tab项
- **THEN** 系统应切换路由到对应页面
- **AND** 被点击的Tab应设置为激活状态
- **AND** 其他Tab应取消激活状态

#### Scenario: Tab关闭
- **WHEN** 用户点击Tab的关闭按钮
- **THEN** 系统应从Tab列表中移除该Tab
- **AND** 如果关闭的是当前激活的Tab，应自动切换到相邻Tab
- **AND** 首页Tab不应显示关闭按钮（不可关闭）

#### Scenario: Tab状态持久化
- **WHEN** 用户刷新页面
- **THEN** Tab列表状态应持久化到localStorage
- **AND** 刷新后应恢复Tab列表
- **AND** 当前激活的Tab应恢复为激活状态

### Requirement: 页面Tab组件
系统 SHALL 提供一个页面Tab组件（Tabs），显示已打开的页面列表，支持切换和关闭。

#### Scenario: Tab组件渲染
- **WHEN** 用户访问使用默认布局的页面
- **THEN** 系统应在工具栏下方显示Tab组件
- **AND** Tab组件应显示所有已打开的页面列表
- **AND** 每个Tab应显示页面标题
- **AND** 每个Tab应显示关闭按钮（首页除外）

#### Scenario: Tab切换交互
- **WHEN** 用户点击Tab项
- **THEN** 系统应切换路由到对应页面
- **AND** 被点击的Tab应高亮显示
- **AND** 其他Tab应取消高亮

#### Scenario: Tab关闭交互
- **WHEN** 用户点击Tab的关闭按钮
- **THEN** 系统应关闭该Tab
- **AND** 如果关闭的是当前激活的Tab，应自动切换到相邻Tab
- **AND** 如果关闭的是最后一个Tab，应跳转到首页

#### Scenario: Tab高亮显示
- **WHEN** 用户访问某个页面
- **THEN** 对应的Tab应高亮显示
- **AND** 高亮样式应符合项目UI风格
- **AND** 其他Tab应显示正常样式

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

