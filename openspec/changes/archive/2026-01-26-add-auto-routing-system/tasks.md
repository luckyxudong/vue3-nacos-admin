## 1. 安装依赖

- [x] 1.1 安装 `unplugin-vue-router` 开发依赖
- [x] 1.2 安装 `vite-plugin-vue-layouts` 开发依赖

## 2. 配置 Vite 插件

- [x] 2.1 在 `vite.config.ts` 中导入 `VueRouter` from `unplugin-vue-router/vite`
- [x] 2.2 在 `vite.config.ts` 中导入 `Layouts` from `vite-plugin-vue-layouts`
- [x] 2.3 配置 `VueRouter` 插件（确保在 `vue()` 插件之前）
- [x] 2.4 配置 `Layouts` 插件，设置 `layoutsDirs` 为 `src/layouts`，`defaultLayout` 为 `default`
- [x] 2.5 验证插件配置顺序正确

## 3. 创建目录结构

- [x] 3.1 创建 `src/pages` 目录用于存放页面文件
- [x] 3.2 创建 `src/layouts` 目录用于存放布局文件

## 4. 迁移现有页面

- [x] 4.1 将 `src/views/demo.vue` 迁移到 `src/pages/demo.vue`
- [x] 4.2 创建 `src/pages/index.vue` 作为首页
- [x] 4.3 验证页面文件结构正确

## 5. 创建默认布局

- [x] 5.1 创建 `src/layouts/default.vue` 布局文件
- [x] 5.2 在布局文件中添加导航链接（如首页、demo 页面）
- [x] 5.3 在布局文件中添加 `<router-view>` 组件
- [x] 5.4 添加布局样式（使用 UnoCSS 工具类）

## 6. 更新路由配置

- [x] 6.1 在 `src/router/index.ts` 中导入 `routes` from `vue-router/auto-routes`
- [x] 6.2 在 `src/router/index.ts` 中导入 `setupLayouts` from `virtual:generated-layouts`
- [x] 6.3 修改 `createRouter` 配置，使用 `setupLayouts(routes)` 替代手动配置的 `routes`
- [x] 6.4 移除手动配置的路由数组
- [x] 6.5 保持 `installRouter` 函数不变，确保模块化注册模式

## 7. 配置类型定义

- [ ] 7.1 启动开发服务器，验证 `typed-router.d.ts` 文件是否自动生成
- [x] 7.2 在 `tsconfig.app.json` 的 `include` 数组中添加 `typed-router.d.ts`
- [x] 7.3 在 `env.d.ts` 文件末尾添加 `/// <reference types="unplugin-vue-router/client" />`
- [ ] 7.4 验证类型检查是否通过

## 8. 测试验证

- [ ] 8.1 启动开发服务器，验证自动路由生成是否正常
- [ ] 8.2 访问首页（`/`），验证 `index.vue` 是否正常显示
- [ ] 8.3 访问 demo 页面（`/demo`），验证 `demo.vue` 是否正常显示
- [ ] 8.4 验证默认布局是否正常应用（导航链接是否显示）
- [ ] 8.5 验证路由类型提示是否正常工作（在代码中使用 `router.push` 测试）

## 9. 多布局支持（可选）

- [ ] 9.1 创建 `src/layouts/blank.vue` 空白布局文件（用于不需要导航的页面）
- [ ] 9.2 在需要使用空白布局的页面中使用 `definePage({ meta: { layout: 'blank' } })`
- [ ] 9.3 验证页面布局切换是否正常

## 10. 文档更新

- [ ] 10.1 更新项目文档，说明自动路由系统的使用方法
- [ ] 10.2 添加页面创建和布局使用的示例
- [ ] 10.3 说明路由类型定义的使用方式
- [ ] 10.4 更新项目结构说明，包含 `pages` 和 `layouts` 目录
