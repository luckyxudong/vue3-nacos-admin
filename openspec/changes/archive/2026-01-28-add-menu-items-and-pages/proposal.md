# Change: 添加菜单项和页面

## Why

当前系统只有基础的菜单项（概览、演示、示例、系统管理、项目、关于），无法满足完整的后台管理系统需求。根据业务需求，需要在"概览"菜单之后添加以下菜单结构：

- 配置管理（一级菜单，包含配置列表、历史版本、监听查询三个二级菜单）
- 服务管理（一级菜单，包含服务列表、订阅者列表两个二级菜单）
- 权限控制（一级菜单，包含用户列表、角色管理、权限管理三个二级菜单）
- 命名空间（一级菜单）
- 集群管理（一级菜单，包含节点列表一个二级菜单）

同时需要为这些菜单项创建对应的页面文件，确保菜单可以正常跳转和显示。

这将完善后台管理系统的菜单结构，为后续功能开发提供基础。

## What Changes

- **菜单配置更新**：在 `src/stores/modules/menu.ts` 中添加新的菜单项配置，包括5个一级菜单和9个二级菜单
- **国际化支持**：在 `src/i18n/locales/zh-CN.ts` 和 `src/i18n/locales/en-US.ts` 中添加14个新菜单项的翻译
- **页面文件创建**：在 `src/pages` 目录下创建10个新的页面文件，使用统一的空页面模板
- **菜单顺序调整**：确保新菜单项位于"概览"菜单之后

## Impact

- **受影响的规范**：
  - `menu-management`（修改：添加新的菜单项配置）
  - `i18n-system`（修改：添加新的菜单翻译）
  - `routing-system`（无需修改：页面文件会自动生成路由）
- **受影响的代码**：
  - `src/stores/modules/menu.ts`（添加菜单配置）
  - `src/i18n/locales/zh-CN.ts`（添加中文翻译）
  - `src/i18n/locales/en-US.ts`（添加英文翻译）
- **新增文件**：
  - `src/pages/config/list.vue` - 配置列表页面
  - `src/pages/config/history.vue` - 历史版本页面
  - `src/pages/config/listen.vue` - 监听查询页面
  - `src/pages/service/list.vue` - 服务列表页面
  - `src/pages/service/subscribers.vue` - 订阅者列表页面
  - `src/pages/permission/users.vue` - 用户列表页面
  - `src/pages/permission/roles.vue` - 角色管理页面
  - `src/pages/permission/permissions.vue` - 权限管理页面
  - `src/pages/namespace.vue` - 命名空间页面
  - `src/pages/cluster/nodes.vue` - 节点列表页面
