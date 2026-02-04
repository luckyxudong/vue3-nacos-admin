## 1. 更新国际化文件

- [x] 1.1 更新 `src/i18n/locales/zh-CN.ts`
  - 在 `menu` 对象中添加14个新菜单项的中文翻译：
    - `configManagement: '配置管理'`
    - `configList: '配置列表'`
    - `configHistory: '历史版本'`
    - `configListen: '监听查询'`
    - `serviceManagement: '服务管理'`
    - `serviceList: '服务列表'`
    - `subscriberList: '订阅者列表'`
    - `permissionControl: '权限控制'`
    - `userList: '用户列表'`
    - `roleManagement: '角色管理'`
    - `permissionManagement: '权限管理'`
    - `namespace: '命名空间'`
    - `clusterManagement: '集群管理'`
    - `nodeList: '节点列表'`

- [x] 1.2 更新 `src/i18n/locales/en-US.ts`
  - 在 `menu` 对象中添加14个新菜单项的英文翻译：
    - `configManagement: 'Config Management'`
    - `configList: 'Config List'`
    - `configHistory: 'History Versions'`
    - `configListen: 'Listen Query'`
    - `serviceManagement: 'Service Management'`
    - `serviceList: 'Service List'`
    - `subscriberList: 'Subscriber List'`
    - `permissionControl: 'Permission Control'`
    - `userList: 'User List'`
    - `roleManagement: 'Role Management'`
    - `permissionManagement: 'Permission Management'`
    - `namespace: 'Namespace'`
    - `clusterManagement: 'Cluster Management'`
    - `nodeList: 'Node List'`

## 2. 更新菜单配置

- [x] 2.1 更新 `src/stores/modules/menu.ts`
  - 在 `menuItems` 数组中，在"概览"菜单项之后添加5个新的一级菜单项：
    - 配置管理（包含配置列表、历史版本、监听查询三个子菜单）
    - 服务管理（包含服务列表、订阅者列表两个子菜单）
    - 权限控制（包含用户列表、角色管理、权限管理三个子菜单）
    - 命名空间（无子菜单）
    - 集群管理（包含节点列表一个子菜单）
  - 确保每个菜单项包含正确的 `title`、`icon`、`path` 和 `children`（如果有）字段
  - 菜单路径需要与页面文件路径保持一致

## 3. 创建配置管理相关页面

- [x] 3.1 创建 `src/pages/config/list.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.configList` 国际化 key
  - 图标使用 `i-mdi-format-list-bulleted`

- [x] 3.2 创建 `src/pages/config/history.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.configHistory` 国际化 key
  - 图标使用 `i-mdi-history`

- [x] 3.3 创建 `src/pages/config/listen.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.configListen` 国际化 key
  - 图标使用 `i-mdi-ear-hearing`

## 4. 创建服务管理相关页面

- [x] 4.1 创建 `src/pages/service/list.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.serviceList` 国际化 key
  - 图标使用 `i-mdi-format-list-bulleted`

- [x] 4.2 创建 `src/pages/service/subscribers.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.subscriberList` 国际化 key
  - 图标使用 `i-mdi-account-group`

## 5. 创建权限控制相关页面

- [x] 5.1 创建 `src/pages/permission/users.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.userList` 国际化 key
  - 图标使用 `i-mdi-account`

- [x] 5.2 创建 `src/pages/permission/roles.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.roleManagement` 国际化 key
  - 图标使用 `i-mdi-account-key`

- [x] 5.3 创建 `src/pages/permission/permissions.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.permissionManagement` 国际化 key
  - 图标使用 `i-mdi-shield-check`

## 6. 创建命名空间页面

- [x] 6.1 创建 `src/pages/namespace.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.namespace` 国际化 key
  - 图标使用 `i-mdi-folder-multiple`

## 7. 创建集群管理相关页面

- [x] 7.1 创建 `src/pages/cluster/nodes.vue`
  - 使用统一的空页面模板
  - 标题使用 `menu.nodeList` 国际化 key
  - 图标使用 `i-mdi-server`

## 8. 测试验证

- [ ] 8.1 功能测试
  - 验证所有新菜单项在侧边栏正确显示
  - 验证菜单项点击可以正确跳转到对应页面
  - 验证多级菜单展开/折叠功能正常
  - 验证菜单激活状态正确显示

- [ ] 8.2 国际化测试
  - 验证中文环境下所有菜单项显示正确的中文文本
  - 验证英文环境下所有菜单项显示正确的英文文本
  - 验证语言切换后菜单文本正确更新

- [ ] 8.3 路由测试
  - 验证所有页面文件自动生成对应的路由
  - 验证路由路径与菜单路径匹配
  - 验证页面可以正常访问和显示
