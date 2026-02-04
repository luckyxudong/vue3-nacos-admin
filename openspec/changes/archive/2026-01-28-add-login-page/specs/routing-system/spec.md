## MODIFIED Requirements

### Requirement: 路由配置集成
系统 SHALL 将自动生成的路由与布局系统集成到 Vue Router 配置中，并支持路由守卫功能。

#### Scenario: 路由自动导入
- **WHEN** 开发者在 `src/router/index.ts` 中导入 `routes` from `vue-router/auto-routes`
- **THEN** 系统应提供自动生成的路由数组
- **AND** 路由数组应包含所有 `src/pages` 目录下的页面路由

#### Scenario: 布局路由包装
- **WHEN** 开发者在路由配置中使用 `setupLayouts(routes)`
- **THEN** 系统应将自动生成的路由包装在布局组件中
- **AND** 路由结构应正确，布局组件作为父路由，页面组件作为子路由

#### Scenario: 模块化注册保持
- **WHEN** 开发者使用 `installRouter` 函数注册路由
- **THEN** 函数应继续使用模块化注册模式
- **AND** 函数签名应保持不变，确保与现有代码兼容

#### Scenario: 路由守卫实现
- **WHEN** 用户在 `router.beforeEach` 中配置路由守卫
- **THEN** 未登录用户访问受保护页面时应重定向到 `/login`
- **AND** 已登录用户访问登录页时应重定向到首页 `/`
- **AND** 路由白名单（如登录页和公开页面）应不需要认证即可访问

#### Scenario: 路由守卫检查逻辑
- **WHEN** 路由守卫执行时
- **THEN** 应检查认证 Store 的 `isAuthenticated` 状态
- **AND** 应根据登录状态和目标路由决定是否允许访问或重定向
