# menu-management Specification

## Purpose
TBD - created by archiving change add-admin-layout-system. Update Purpose after archive.
## Requirements
### Requirement: 菜单配置管理
系统 SHALL 提供一个菜单配置Store，管理菜单数据结构和展开/折叠状态。

#### Scenario: 菜单配置Store创建
- **WHEN** 系统初始化时
- **THEN** 系统应创建菜单配置Store（`src/stores/modules/menu.ts`）
- **AND** Store应定义菜单项类型（MenuItem），包含title、icon、path、children等字段
- **AND** Store应包含Mock菜单数据，支持多级菜单结构

#### Scenario: 菜单展开/折叠状态管理
- **WHEN** 用户点击父菜单项
- **THEN** 系统应切换该菜单的展开/折叠状态
- **AND** 展开状态应显示子菜单项
- **AND** 折叠状态应隐藏子菜单项
- **AND** 状态应持久化到localStorage

#### Scenario: 菜单激活状态管理
- **WHEN** 用户访问某个页面
- **THEN** 系统应根据当前路由路径高亮对应的菜单项
- **AND** 激活的菜单项应显示高亮样式
- **AND** 父菜单项也应显示激活状态（如果子菜单被激活）

### Requirement: 左侧菜单组件
系统 SHALL 提供一个左侧菜单组件（Sidebar），支持多级菜单显示、图标显示和展开/折叠功能。

#### Scenario: 菜单组件渲染
- **WHEN** 用户访问使用默认布局的页面
- **THEN** 系统应在页面左侧显示菜单组件
- **AND** 菜单组件应显示Logo和项目名称
- **AND** 菜单组件应渲染菜单列表（支持多级菜单递归渲染）
- **AND** 菜单项应显示图标（使用Icon组件）

#### Scenario: 菜单展开/折叠交互
- **WHEN** 用户点击父菜单项
- **THEN** 系统应展开或折叠该菜单的子菜单
- **AND** 展开/折叠动画应流畅
- **AND** 菜单状态应同步到Store

#### Scenario: 菜单折叠模式
- **WHEN** 用户点击菜单折叠按钮
- **THEN** 系统应折叠整个侧边栏
- **AND** 折叠后只显示图标，隐藏文字
- **AND** 折叠状态应持久化

#### Scenario: 菜单项点击跳转
- **WHEN** 用户点击菜单项
- **THEN** 系统应跳转到对应的路由路径
- **AND** 菜单项应更新为激活状态
- **AND** 如果菜单项有子菜单，应先展开子菜单

### Requirement: 菜单数据配置
系统 SHALL 提供Mock菜单数据，包含概览、配置管理、服务管理、权限控制、命名空间、集群管理等菜单项。

#### Scenario: Mock菜单数据
- **WHEN** 系统初始化时
- **THEN** 系统应加载Mock菜单数据
- **AND** 菜单数据应包含概览菜单（包含分析页、工作台子菜单）
- **AND** 菜单数据应包含配置管理菜单（包含配置列表、历史版本、监听查询子菜单）
- **AND** 菜单数据应包含服务管理菜单（包含服务列表、订阅者列表子菜单）
- **AND** 菜单数据应包含权限控制菜单（包含用户列表、角色管理、权限管理子菜单）
- **AND** 菜单数据应包含命名空间菜单（无子菜单）
- **AND** 菜单数据应包含集群管理菜单（包含节点列表子菜单）
- **AND** 菜单数据应包含演示、示例、系统管理、项目、关于等菜单项
- **AND** 菜单数据应支持多级嵌套结构
- **AND** 新菜单项应位于"概览"菜单之后

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

