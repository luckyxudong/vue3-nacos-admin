# i18n-system Specification

## Purpose
TBD - created by archiving change add-i18n-system. Update Purpose after archive.
## Requirements
### Requirement: 国际化基础集成
系统 MUST 集成 `vue-i18n` 并提供 `installI18n` 入口以完成应用注册。

#### Scenario: 应用入口注册
- **WHEN** 在 `main.ts` 中调用 `installI18n(app)`
- **THEN** 应用全局可使用 i18n 能力

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

### Requirement: 默认语言与回退策略
系统 MUST 从本地存储读取默认语言；若无本地存储，必须回退到浏览器语言或默认语言。

#### Scenario: 默认语言选择
- **WHEN** 本地存储存在 `locale`
- **THEN** 使用该语言作为当前语言
- **WHEN** 本地存储不存在 `locale`
- **THEN** 使用浏览器语言，若不支持则回退到 `zh-CN`

### Requirement: 语言包动态加载
系统 MUST 提供 `loadLanguage(lang)` 以动态加载语言包并持久化用户选择。

#### Scenario: 动态加载与持久化
- **WHEN** 调用 `loadLanguage('en-US')`
- **THEN** 动态导入语言包并注册到 i18n
- **AND** 将 `locale` 写入本地存储

### Requirement: 编译时预处理支持
系统 MUST 在 `vite.config.ts` 中集成 `@intlify/unplugin-vue-i18n` 以预编译语言包。

#### Scenario: Vite 插件配置
- **WHEN** Vite 启动构建
- **THEN** 插件会扫描 `src/i18n/locales/**` 并执行编译时处理

### Requirement: 路由级语言包懒加载
系统 MUST 支持根据路由 `meta.locales` 按需加载模块语言包并合并到当前语言。

#### Scenario: 路由前置守卫加载
- **WHEN** 目标路由包含 `meta.locales`
- **THEN** 按模块动态导入 `src/i18n/locales/modules/<lang>/<module>.ts`
- **AND** 合并到当前语言的消息集合中

### Requirement: 语言切换交互
系统 MUST 在切换语言时先加载语言包，再更新当前语言。

#### Scenario: 语言切换
- **WHEN** 用户选择新语言
- **THEN** 先调用 `loadLanguage` 完成加载
- **AND** 更新 `locale` 为新语言

