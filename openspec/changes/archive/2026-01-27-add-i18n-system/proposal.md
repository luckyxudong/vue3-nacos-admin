# Change: 添加 Vue3 国际化体系

## Why
项目需要支持多语言，并希望在模板层沉淀可复用且性能友好的国际化方案，以支撑后续模块扩展与按需加载的长期演进。

## What Changes
- 集成 `vue-i18n`（Composition API）与统一的 `installI18n` 注册方式
- 新增语言包目录结构与通用语言包
- 提供默认语言选择、回退语言与本地持久化策略
- 支持语言包动态懒加载
- 接入 `@intlify/unplugin-vue-i18n` 进行编译时预处理
- 支持路由级语言包按需加载（基于 `meta.locales`）

## Impact
- Affected specs: `i18n-system`
- Affected code: `src/i18n/**`, `src/main.ts`, `vite.config.ts`, `src/router/index.ts`, `src/pages/**`
