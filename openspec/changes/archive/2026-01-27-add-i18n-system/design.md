## Context
模板项目需要内建国际化能力，既要易于使用，也要支持大规模语言包的按需加载与构建期优化。

## Goals / Non-Goals
- Goals:
  - 提供统一的 i18n 初始化与注册方式
  - 支持语言选择持久化与浏览器语言回退
  - 支持语言包懒加载与路由级别按需加载
  - 使用官方插件进行编译时预处理以优化性能
- Non-Goals:
  - 不引入服务端渲染或远程语言包服务
  - 不设计多租户或多域名语言策略

## Decisions
- 使用 `vue-i18n` 的 Composition API 模式（`legacy: false`）
- 通过 `@intlify/unplugin-vue-i18n` 在构建阶段预编译语言包
- 基础语言包与模块语言包分层，模块语言包按路由 `meta.locales` 懒加载
- 语言选择存储在 `localStorage`，无存储时回退到浏览器语言或默认语言

## Risks / Trade-offs
- 动态 import 需要保证语言包路径与命名严格一致
- 路由守卫增加首跳开销 → 通过模块化加载减少整体体积

## Migration Plan
- 新增 i18n 目录与配置
- 配置 Vite 插件
- 在入口注册 i18n
- 增加路由级语言包加载

## Open Questions
- 语言包命名是否允许 `zh-CN`/`en-US` 以外的扩展？
- 是否需要按模块拆分的约定清单（如 `meta.locales` 的统一枚举）？
