## 1. 实现 Store 重置方法
- [x] 1.1 在 `src/stores/modules/menu.ts` 中添加 `reset()` 方法，重置 `expandedMenus` 为 `['/overview']`，`isCollapsed` 为 `false`
- [x] 1.2 在 `src/stores/modules/tabs.ts` 中添加 `reset()` 方法，重置 `tabs` 为仅包含首页的数组，`activeTab` 为 `'/'`

## 2. 增强登出清理逻辑
- [x] 2.1 在 `src/stores/modules/auth.ts` 的 `logout()` 方法中导入 `useMenuStore` 和 `useTabsStore`
- [x] 2.2 在 `logout()` 方法中调用 HTTP 客户端的 `cancelAll()` 方法取消所有进行中的请求
- [x] 2.3 在 `logout()` 方法中调用 Menu Store 和 Tabs Store 的 `reset()` 方法
- [x] 2.4 在 `logout()` 方法中清理 localStorage 中的 Pinia 持久化数据（`auth`、`menu`、`tabs`），但保留 `locale`
- [x] 2.5 确保清理逻辑的错误处理，使用 try-catch 包裹清理逻辑

## 3. 验证和测试
- [ ] 3.1 测试登出后 localStorage 中是否还有相关数据（auth、menu、tabs 应被清除，locale 应保留）
- [ ] 3.2 测试登出后各个 store 的状态是否正确重置
- [ ] 3.3 测试登出时进行中的 HTTP 请求是否被正确取消
- [ ] 3.4 测试登出后重新登录，状态是否正常
- [ ] 3.5 验证语言设置是否保留
