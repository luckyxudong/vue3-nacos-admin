## MODIFIED Requirements

### Requirement: 国际化目录与通用语言包
系统 MUST 提供 `src/i18n` 目录结构与通用语言包文件，包含菜单相关的翻译文本。

#### Scenario: 目录结构创建
- **WHEN** 初始化国际化目录
- **THEN** 必须包含 `src/i18n/index.ts` 与 `src/i18n/locales/{zh-CN,en-US}.ts`
- **AND** 语言包文件应包含 `menu` 对象，提供所有菜单项的翻译
- **AND** 中文语言包应包含以下菜单翻译：
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
- **AND** 英文语言包应包含对应的英文翻译
