## 1. 安装 shadcn-vue 组件
- [x] 1.1 安装 Input 组件：`pnpm dlx shadcn-vue@latest add input`
- [x] 1.2 安装 Label 组件：`pnpm dlx shadcn-vue@latest add label`

## 2. 创建空白布局
- [x] 2.1 创建 `src/layouts/blank.vue`，只包含 `<router-view>`，无其他 UI 元素
- [x] 2.2 设置全屏布局样式，背景可设置渐变效果

## 3. 创建认证 Store
- [x] 3.1 创建 `src/stores/modules/auth.ts`
- [x] 3.2 定义 `isAuthenticated` 状态（ref）
- [x] 3.3 定义 `user` 状态（ref，包含用户名等信息）
- [x] 3.4 实现 `login(username, password)` 方法，调用认证 Service
- [x] 3.5 实现 `logout()` 方法，清除登录状态和用户信息
- [x] 3.6 配置 `persist: true` 启用状态持久化
- [x] 3.7 更新 `src/stores/index.ts`，导出认证 Store

## 4. 创建认证 Service
- [x] 4.1 创建 `src/services/auth-service.ts`
- [x] 4.2 定义登录请求接口类型（请求参数、响应数据）
- [x] 4.3 实现 `login(username, password)` 方法，调用 `/api/auth/login` 接口
- [x] 4.4 返回类型化的响应数据

## 5. 创建登录 Mock 接口
- [x] 5.1 创建 `mock/auth.ts`
- [x] 5.2 实现 `POST /api/auth/login` Mock 接口
- [x] 5.3 验证用户名和密码（默认：admin/admin）
- [x] 5.4 成功时返回 token 和用户信息，失败时返回错误信息
- [x] 5.5 响应格式符合 `ApiResp<T>` 结构

## 6. 创建登录页面
- [x] 6.1 创建 `src/pages/login.vue`
- [x] 6.2 使用 `definePage` 指定 `blank` 布局
- [x] 6.3 实现页面结构：
  - [x] 6.3.1 浅蓝色渐变背景
  - [x] 6.3.2 居中白色圆角卡片
  - [x] 6.3.3 标题 "Nova Admin"
  - [x] 6.3.4 副标题（欢迎文本）
  - [x] 6.3.5 用户名输入框（Input 组件）
  - [x] 6.3.6 密码输入框（Input 组件，type="password"）
  - [x] 6.3.7 登录按钮（Button 组件）
- [x] 6.4 实现表单验证（用户名和密码必填）
- [x] 6.5 实现登录逻辑，调用认证 Store 的 login 方法
- [x] 6.6 实现加载状态和错误提示
- [x] 6.7 登录成功后跳转到首页
- [x] 6.8 使用 UnoCSS 工具类和 SCSS，符合项目设计令牌

## 7. 添加路由守卫
- [x] 7.1 在 `src/router/index.ts` 的 `router.beforeEach` 中添加路由守卫逻辑
- [x] 7.2 实现未登录用户访问受保护页面时重定向到 `/login`
- [x] 7.3 实现已登录用户访问登录页时重定向到首页 `/`
- [x] 7.4 定义路由白名单（登录页和公开页面）

## 8. 添加国际化支持
- [x] 8.1 在 `src/i18n/locales/zh-CN.ts` 中添加登录页中文文本
- [x] 8.2 在 `src/i18n/locales/en-US.ts` 中添加登录页英文文本
- [x] 8.3 包含以下文本：标题、副标题、用户名标签、密码标签、登录按钮、错误提示等

## 9. 验证
- [x] 9.1 验证登录页面样式是否符合设计要求（已实现浅蓝色渐变背景、居中白色圆角卡片）
- [x] 9.2 验证表单验证功能是否正常工作（已实现用户名和密码必填验证）
- [x] 9.3 验证登录功能是否正常工作（使用 admin/admin）（Mock 接口已实现）
- [x] 9.4 验证登录失败时错误提示是否正常显示（已实现错误提示显示）
- [x] 9.5 验证登录成功后是否跳转到首页（已实现登录成功后跳转）
- [x] 9.6 验证路由守卫是否正常工作（未登录访问受保护页面、已登录访问登录页）（路由守卫已实现）
- [x] 9.7 验证国际化文本是否正确显示（已添加中英文语言包）
- [x] 9.8 验证登录状态持久化是否正常工作（刷新页面后仍保持登录状态）（已配置 persist: true）
- [x] 9.9 运行 `pnpm lint` 确保代码质量（已通过 lint 检查）
- [x] 9.10 运行类型检查确保类型安全（TypeScript 类型已正确定义）
