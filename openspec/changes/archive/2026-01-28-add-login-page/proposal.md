# Change: 添加登录页面与认证系统

## Why
项目需要用户认证功能，提供登录页面以保护应用资源。登录页面需要符合项目设计规范，集成 Mock 服务进行开发测试，并支持国际化。同时需要路由守卫机制，确保未登录用户无法访问受保护的页面。

## What Changes
- 安装 shadcn-vue Input 和 Label 组件，用于登录表单
- 创建空白布局（`src/layouts/blank.vue`），用于登录页等无需导航栏的页面
- 创建认证 Store（`src/stores/modules/auth.ts`），管理用户登录状态和用户信息
- 创建认证 Service（`src/services/auth-service.ts`），封装登录 API 调用
- 创建登录 Mock 接口（`mock/auth.ts`），模拟登录 API（默认账号：admin/admin）
- 创建登录页面（`src/pages/login.vue`），包含用户名、密码输入框和登录按钮，页面标题为 "Nova Admin"
- 添加路由守卫逻辑，未登录用户访问受保护页面时重定向到登录页，已登录用户访问登录页时重定向到首页
- 添加登录页国际化文本（中文和英文）
- 更新 Store 导出，导出认证 Store

## Impact
- Affected specs: `auth-system` (新增), `routing-system` (修改), `mock-service` (修改)
- Affected code:
  - `src/pages/login.vue` - 登录页面
  - `src/layouts/blank.vue` - 空白布局
  - `src/stores/modules/auth.ts` - 认证 Store
  - `src/services/auth-service.ts` - 认证 Service
  - `src/router/index.ts` - 路由守卫逻辑
  - `src/stores/index.ts` - Store 导出
  - `src/i18n/locales/zh-CN.ts` - 中文语言包
  - `src/i18n/locales/en-US.ts` - 英文语言包
  - `mock/auth.ts` - 登录 Mock 接口
  - `components.json` - shadcn-vue 组件配置（通过 CLI 自动更新）
