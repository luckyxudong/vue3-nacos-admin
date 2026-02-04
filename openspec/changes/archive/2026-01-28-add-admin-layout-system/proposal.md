# Change: 添加后台管理系统Layout布局

## Why

当前项目的布局系统（`src/layouts/default.vue`）非常简单，只有一个顶部导航栏，无法满足后台管理系统的需求。根据设计需求，需要实现一个完整的后台管理系统Layout，包括：

- 左侧多级菜单导航，支持展开/折叠
- 顶部工具栏，包含面包屑、主题切换、语言切换、用户头像
- 页面Tab管理，支持多页面切换和关闭
- 首页"早安"卡片，提升用户体验

这将为项目提供一个功能完善、符合现代后台管理系统标准的布局方案。

## What Changes

- **菜单管理系统**：创建菜单配置Store和左侧菜单组件，支持多级菜单、图标显示、展开/折叠功能
- **Tab管理系统**：创建Tab管理Store和Tab组件，支持页面列表管理、切换、关闭功能
- **布局组件**：创建顶部工具栏组件（Header），包含面包屑导航、主题切换、语言切换、用户头像
- **早安卡片组件**：创建首页问候卡片，显示问候语和天气信息
- **主布局重构**：重构 `src/layouts/default.vue`，集成所有布局组件，实现完整的后台管理系统布局
- **首页更新**：在首页添加"早安"卡片组件
- **国际化支持**：添加菜单、工具栏、卡片等相关文本的国际化支持

## Impact

- **受影响的规范**：
  - `layout-system`（新增）
  - `menu-management`（新增）
  - `tab-management`（新增）
  - `routing-system`（可能需要更新，添加路由meta信息支持）
  - `i18n-system`（需要添加新的语言包）
- **受影响的代码**：
  - `src/layouts/default.vue`（重构）
  - `src/pages/index.vue`（添加早安卡片）
  - `src/i18n/locales/zh-CN.ts`（添加中文文本）
  - `src/i18n/locales/en-US.ts`（添加英文文本）
  - `src/stores/index.ts`（可能需要导出新的Store）
- **新增文件**：
  - `src/stores/modules/menu.ts` - 菜单配置Store
  - `src/stores/modules/tabs.ts` - Tab管理Store
  - `src/components/layout/Sidebar.vue` - 左侧菜单组件
  - `src/components/layout/Header.vue` - 顶部工具栏组件
  - `src/components/layout/Tabs.vue` - 页面Tab组件
  - `src/components/layout/GoodMorningCard.vue` - 早安卡片组件
