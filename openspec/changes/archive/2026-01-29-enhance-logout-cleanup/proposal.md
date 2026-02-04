# Change: 完善登出清理逻辑

## Why
当前登出逻辑仅清理了认证 Store 的基本状态（isAuthenticated、user、token），但未清理其他相关状态和缓存，导致以下问题：
1. Pinia 持久化数据残留在 localStorage 中，可能泄露用户信息
2. Menu Store 和 Tabs Store 的状态未重置，影响下次登录体验
3. 进行中的 HTTP 请求未取消，可能造成资源浪费和安全风险
4. 用户偏好设置（如语言设置）不应在登出时清除

## What Changes
- 增强认证 Store 的 `logout()` 方法，添加完整的清理逻辑
- 在 Menu Store 中添加 `reset()` 方法，用于重置菜单状态
- 在 Tabs Store 中添加 `reset()` 方法，用于重置标签页状态
- 在登出时调用 HTTP 客户端的 `cancelAll()` 方法取消所有进行中的请求
- 清理 localStorage 中的 Pinia 持久化数据（auth、menu、tabs），但保留 locale（语言设置）
- 确保登出后所有相关状态和缓存被正确清理

## Impact
- Affected specs: `auth-system` (修改), `menu-management` (修改), `tab-management` (修改), `http-core` (修改)
- Affected code:
  - `src/stores/modules/auth.ts` - 增强 logout 方法
  - `src/stores/modules/menu.ts` - 添加 reset 方法
  - `src/stores/modules/tabs.ts` - 添加 reset 方法
  - `src/http/index.ts` - 确保 api 实例的 cancelAll 方法可访问
