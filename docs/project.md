# Project Context

## Purpose

Vue3 模板项目是一个功能完善、结构清晰的前端应用模板，旨在为快速启动 Vue3 项目提供基础能力。项目采用渐进式开发方式，逐步集成路由、状态管理、样式系统等核心能力，最终形成一个可用于生产环境的 Vue3 应用模板。

**核心目标**:
- 提供标准化的项目结构和开发规范
- 集成常用的前端开发工具和库
- 建立可扩展的架构模式
- 提供完整的样式系统和设计令牌
- 支持主题切换和状态持久化
- 提供完整的图标系统解决方案
- 提供基于文件系统的自动路由生成和布局管理
- 提供 API 自动导入功能，减少样板代码
- 提供组件自动注册功能，简化组件使用流程
- 提供完整的环境变量管理系统，支持多环境配置和类型安全
- 提供完整的国际化（i18n）系统，支持多语言、语言包懒加载和路由级按需加载
- 提供完整的 HTTP 请求封装方案，支持拦截器、请求取消、插件化架构
- 提供 Mock 服务支持，便于前后端并行开发
- 集成 shadcn-vue 组件系统，提供美观的 UI 组件和完整的代码控制权

## Tech Stack

### 核心框架
- **Vue 3** (^3.5.26) - 渐进式 JavaScript 框架，使用组合式 API
- **TypeScript** (~5.9.3) - 类型安全的 JavaScript 超集
- **Vite** (^7.3.1) - 下一代前端构建工具

### 状态管理
- **Pinia** (^3.0.4) - Vue 官方推荐的状态管理库
- **pinia-plugin-persistedstate** (^4.7.1) - Pinia 状态持久化插件

### 路由
- **Vue Router** (^4.6.4) - Vue.js 官方路由管理器
- **unplugin-vue-router** (^0.19.2) - 基于文件系统的自动路由生成插件（开发依赖）
- **vite-plugin-vue-layouts** (^0.11.0) - Vue 布局管理插件（开发依赖）

### 样式系统
- **SCSS/Sass** (^1.97.3) - CSS 预处理器
- **UnoCSS** (^66.6.0) - 原子化 CSS 引擎

### 图标系统
- **@iconify/json** (^2.2.431) - Iconify 图标库数据（开发依赖）
- **@iconify/vue** (^5.0.0) - Iconify Vue 组件
- **vite-plugin-svg-icons** (^2.0.1) - Vite SVG 图标插件（开发依赖）

### 自动导入系统
- **unplugin-auto-import** (^21.0.0) - API 自动导入插件（开发依赖）
- **@vueuse/core** (^14.1.0) - VueUse 工具集，提供丰富的组合式 API hooks

### 组件自动注册系统
- **unplugin-vue-components** (^31.0.0) - 组件自动注册插件（开发依赖）

### UI 组件系统
- **shadcn-vue** - 基于 Vue 3 的组件代码分发平台，提供美观的 UI 组件
- **clsx** (^2.1.1) - 条件性地合并类名
- **tailwind-merge** (^3.4.0) - 智能合并 Tailwind/UnoCSS 类名，解决类名冲突

### 国际化系统
- **vue-i18n** (11) - Vue.js 官方国际化库
- **@intlify/unplugin-vue-i18n** (^11.0.3) - Vue I18n 编译时预处理插件（开发依赖）

### HTTP 请求封装
- **axios** (^1.13.3) - HTTP 请求库
- **mockjs** (^1.1.0) - Mock 数据生成库（开发依赖）
- **@types/mockjs** (^1.0.10) - MockJS TypeScript 类型定义（开发依赖）
- **vite-plugin-mock** (^3.0.2) - Vite Mock 服务插件（开发依赖）

### 开发工具
- **ESLint** (^9.39.2) - JavaScript/TypeScript 代码检查工具
- **Oxlint** (~1.41.0) - 高性能的 Rust 编写的 linter
- **Prettier** (3.8.1) - 代码格式化工具
- **vue-tsc** (^3.2.2) - Vue 单文件组件的 TypeScript 类型检查

### 运行时要求
- **Node.js**: ^20.19.0 || >=22.12.0
- **包管理器**: pnpm

## Project Conventions

### Code Style

#### TypeScript 规范
- 使用 TypeScript 进行严格的类型检查
- 优先使用组合式 API（Composition API）
- 为所有导出的函数和类提供类型定义
- 使用类型推断，避免不必要的类型注解

#### 代码检查与格式化
- **ESLint**: 使用 `@vue/eslint-config-typescript` 配置
- **Oxlint**: 用于快速代码检查
- **Prettier**: 统一代码格式化规则
- 提交前自动运行 `pnpm lint` 和 `pnpm format`

#### 命名规范
- **组件文件**: PascalCase（如 `Demo.vue`, `UserProfile.vue`）
- **工具文件**: kebab-case（如 `assets.ts`, `http-client.ts`）
- **Store 模块**: kebab-case（如 `user.ts`, `auth.ts`）
- **常量**: UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- **变量和函数**: camelCase（如 `userName`, `getUserInfo`）

#### 导入规范
- 使用路径别名 `@` 导入项目文件（`@` 指向 `src` 目录）
- 统一从模块入口导入（如 `import { useDemoStore } from '@/stores'`）
- 样式文件使用相对路径导入
- 第三方库导入放在最前面，项目文件导入放在后面
- **自动导入**：Vue、Vue Router、Pinia、VueUse 等库的 API（如 `ref`, `computed`, `useDark`）无需手动导入，系统会自动处理
- **组件自动注册**：`src/components` 目录下的组件无需手动导入，可直接在模板中使用

### Architecture Patterns

#### 模块化注册模式
所有功能模块采用统一的 `install*` 函数模式进行注册：

```typescript
// 资源模块
export const installAssets = () => {}

// 国际化模块
export const installI18n = (app: App) => {
  app.use(i18n)
}

// 状态管理模块
export const installPinia = (app: App) => {
  app.use(pinia)
}

// 路由模块
export const installRouter = (app: App) => {
  app.use(router)
}
```

**优势**:
- 代码风格统一，易于维护
- 模块化设计，便于测试
- 支持按需加载和条件初始化

#### 应用初始化顺序
在 `src/main.ts` 中按以下顺序初始化模块：
1. 资源初始化（`installAssets()`）
2. 国际化初始化（`installI18n(app)`）
3. 状态管理初始化（`installPinia(app)`）
4. 路由初始化（`installRouter(app)`）
5. 挂载应用（`app.mount('#app')`）

#### Store 模块化架构
- Store 模块存放在 `src/stores/modules/` 目录
- 使用组合式 API 风格编写 Store
- 统一通过 `src/stores/index.ts` 导出所有 Store 模块
- 支持状态持久化配置

#### 样式系统三层架构
1. **Settings 层** (`src/assets/scss/settings/`): 设计令牌定义
2. **Base 层** (`src/assets/scss/base/`): 全局基础样式
3. **Components 层**: 组件级样式（使用 UnoCSS 原子化类）

#### 路由配置
- 路由配置集中在 `src/router/index.ts`
- 使用基于文件系统的自动路由生成（`unplugin-vue-router`）
- 页面文件存放在 `src/pages` 目录，自动生成对应路由
- 布局文件存放在 `src/layouts` 目录，支持默认布局和自定义布局
- 使用 HTML5 历史模式（`createWebHistory`）
- 自动生成 TypeScript 类型定义文件（`typed-router.d.ts`），提供类型安全的路由使用体验

### Testing Strategy

**当前状态**: 测试框架尚未集成

**计划集成**:
- **单元测试**: Vitest（Vue 3 官方推荐的测试框架）
- **E2E 测试**: Playwright 或 Cypress
- **组件测试**: Vue Test Utils

**测试规范**（待实施）:
- 所有工具函数必须有单元测试
- 核心业务逻辑必须有测试覆盖
- 关键用户流程必须有 E2E 测试

### Git Workflow

#### 提交信息规范
使用约定式提交（Conventional Commits）格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

**示例**:
```
feat(stores): 添加用户 Store 模块并实现计数器功能
fix(styles): 修复 SCSS 语法错误，添加缺失的分号
docs(design): 更新项目设计文档，添加样式系统说明
```

#### 分支策略
- `main`: 主分支，保持稳定可发布状态
- `develop`: 开发分支，用于集成新功能
- `feature/*`: 功能分支，从 `develop` 分支创建
- `fix/*`: 修复分支，从 `main` 或 `develop` 分支创建

## Domain Context

### 项目结构说明

```
vue3-template-1/
├── docs/                    # 项目文档
│   └── design.md           # 设计文档
├── openspec/               # OpenSpec 规范文档
│   ├── AGENTS.md           # AI 助手规范
│   └── project.md          # 项目规范（本文档）
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 资源文件
│   │   ├── icons/          # 本地 SVG 图标目录
│   │   └── scss/           # SCSS 样式文件
│   │       ├── base/       # 基础样式层
│   │       ├── settings/   # 设计令牌层
│   │       │   ├── _color.scss    # 颜色设计令牌
│   │       │   ├── _size.scss     # 尺寸设计令牌
│   │       │   ├── _shadcn.scss   # shadcn-vue CSS 变量
│   │       │   └── index.scss     # 设计令牌入口
│   │       └── index.scss  # 样式入口
│   ├── components/         # 组件目录
│   │   ├── icon/           # 图标组件
│   │   │   └── icon.vue    # Icon 组件
│   │   └── ui/             # shadcn-vue 组件目录
│   │       └── <component>/  # shadcn-vue 组件（通过 CLI 安装）
│   ├── lib/                # 工具库目录
│   │   └── utils.ts       # cn 工具函数（类名合并）
│   ├── i18n/               # 国际化配置
│   │   ├── locales/        # 语言包目录
│   │   │   ├── zh-CN.ts    # 中文语言包
│   │   │   ├── en-US.ts    # 英文语言包
│   │   │   └── modules/    # 模块语言包目录
│   │   │       └── <lang>/ # 按语言分类的模块语言包
│   │   └── index.ts        # i18n 模块化注册
│   ├── layouts/            # 布局文件目录
│   │   └── default.vue     # 默认布局
│   ├── http/               # HTTP 请求封装
│   │   ├── core/           # 核心封装层
│   │   │   ├── types.ts    # 类型定义
│   │   │   ├── http-client.ts  # HTTP 客户端类
│   │   │   ├── interceptors.ts # 拦截器管理
│   │   │   ├── plugin.ts   # 插件接口
│   │   │   ├── plugin-manager.ts  # 插件管理器
│   │   │   ├── request-canceler.ts  # 请求取消插件
│   │   │   └── index.ts    # 统一导出
│   │   └── index.ts        # 项目配置层
│   ├── pages/              # 页面文件目录（自动路由）
│   │   ├── index.vue       # 首页
│   │   ├── demo.vue        # 演示页面
│   │   └── http-demo.vue   # HTTP 请求演示页面
│   ├── plugins/            # 插件模块
│   │   └── assets.ts       # 资源管理插件
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由模块化注册
│   ├── services/           # Service 层
│   │   ├── base-service.ts # 通用 CRUD 基类
│   │   └── demo-service.ts # Demo Service 示例
│   ├── stores/             # 状态管理
│   │   ├── modules/        # Store 模块
│   │   │   └── user.ts     # 用户 Store（示例）
│   │   └── index.ts        # Pinia 封装和模块化注册
│   ├── utils/              # 工具函数
│   │   └── env.ts          # 环境变量工具类
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── mock/                   # Mock 服务目录
│   └── demo.ts             # Demo Mock 接口
├── .env                    # 基础环境变量文件
├── .env.dev                # 开发环境变量文件
├── .env.uat                # UAT 环境变量文件
├── .env.prod                # 生产环境变量文件
├── env.d.ts                 # 环境变量类型定义文件
├── typed-router.d.ts       # 自动生成的路由类型定义文件（gitignore）
├── auto-imports.d.ts       # 自动生成的 API 自动导入类型定义文件（gitignore）
├── components.d.ts         # 自动生成的组件自动注册类型定义文件（gitignore）
├── components.json         # shadcn-vue 配置文件
├── uno.config.ts           # UnoCSS 配置
├── vite.config.ts          # Vite 配置
└── package.json            # 项目依赖
```

### 设计令牌系统

项目使用设计令牌（Design Tokens）统一管理设计变量：

**颜色系统**:
- 品牌色: primary (#1C9399)
- 状态色: success, warning, danger, info
- 中性色: 文字色、边框色、背景色
- 自动生成色阶: 使用 SCSS `color.mix()` 函数生成浅色和深色变体

**尺寸系统**:
- 间距: 基于 8px 基准（xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px, 2xl: 32px）
- 字体: xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px), 3xl(30px)
- 圆角: sm(4px), base(6px), lg(8px), full(9999px)

**主题支持**:
- 支持深色/浅色模式切换
- 通过 `data-theme` 属性控制主题
- CSS 变量自动适配主题变化

### UnoCSS 集成

- 将 SCSS 定义的 CSS 变量映射到 UnoCSS 主题
- 支持 `@apply` 指令和分组写法
- 自定义规则生成品牌色工具类（如 `bg-primary-light-3`）
- 提供快捷类（如 `flex-center`, `flex-col-center`）
- 集成 `presetIcons` 支持 Iconify 图标库，通过类名使用图标（如 `i-ph-anchor-simple-thin`）

### 自动导入系统

项目提供完整的 API 自动导入功能，支持多个核心库的 API 自动导入：

**支持的库**:
- **Vue**: 核心 API（`ref`, `computed`, `watch`, `onMounted` 等）
- **Vue Router**: 路由相关 API（通过 `unplugin-vue-router` 提供）
- **Pinia**: 状态管理 API（`defineStore`, `storeToRefs` 等）
- **VueUse**: 丰富的组合式 API hooks（`useDark`, `useToggle`, `useMouse` 等）

**类型安全**:
- 自动生成 `auto-imports.d.ts` 类型定义文件
- TypeScript 提供完整的类型检查和 IDE 自动补全
- 类型定义文件在开发服务器启动时自动更新

**使用方式**:
- 在 Vue 组件中直接使用 API，无需手动编写 `import` 语句
- 例如：`const count = ref(0)` 无需 `import { ref } from 'vue'`

### 组件自动注册系统

项目提供组件自动注册功能，简化组件使用流程：

**自动扫描**:
- 自动扫描 `src/components` 目录及所有子目录
- 支持深度扫描（`deep: true`）
- 组件名不包含目录路径（`directoryAsNamespace: false`）

**类型安全**:
- 自动生成 `components.d.ts` 类型定义文件
- TypeScript 提供组件的类型检查和 IDE 自动补全
- 类型定义文件随组件变化自动更新

**使用方式**:
- 在模板中直接使用组件，无需手动导入
- 例如：`<Icon />` 无需 `import Icon from '@/components/icon/icon.vue'`

### shadcn-vue 组件系统

项目集成 shadcn-vue 组件系统，提供美观的 UI 组件和完整的代码控制权：

**核心特点**:
- **开放代码**：组件代码直接存在于项目中，可以自由修改和定制
- **组合式设计**：所有组件使用统一的组合式接口，与 Vue 3 最佳实践一致
- **美观的默认样式**：精心设计的默认样式，开箱即用
- **类型安全**：完整的 TypeScript 类型定义支持

**依赖和工具**:
- `clsx`：用于条件性地合并类名
- `tailwind-merge`：用于智能合并 Tailwind/UnoCSS 类名，解决类名冲突
- `cn` 工具函数：位于 `src/lib/utils.ts`，提供类名合并功能

**配置文件**:
- `components.json`：shadcn-vue 配置文件，定义组件安装路径和样式配置
- 配置项包括：style、tailwind、typescript、aliases

**CSS 变量系统**:
- `src/assets/scss/settings/_shadcn.scss`：定义 shadcn-vue 所需的 CSS 变量
- 支持深色/浅色主题切换（通过 `data-theme` 属性）
- 基于 zinc 色系，与项目设计令牌系统兼容

**组件安装**:
- 使用 CLI 安装组件：`pnpm dlx shadcn-vue@latest add <component-name>`
- 组件安装到 `src/components/ui/<component-name>/` 目录
- 组件自动注册，无需手动导入即可使用

**UnoCSS 集成**:
- shadcn-vue CSS 变量已映射到 UnoCSS 主题配置
- 可以在 UnoCSS 工具类中使用这些变量（如 `bg-background`、`text-foreground`）

**使用示例**:
```vue
<template>
  <div>
    <Button>点击我</Button>
    <Button variant="destructive">删除</Button>
    <Button variant="outline">轮廓按钮</Button>
  </div>
</template>

<script setup lang="ts">
// 无需导入，组件自动注册
</script>
```

### 图标系统

项目提供完整的图标解决方案，支持多种图标使用方式：

**UnoCSS 图标**:
- 通过 `presetIcons` 预设集成 Iconify 图标库
- 使用 `i-` 前缀的类名即可使用图标（如 `<div class="i-mdi-user" />`）
- 支持响应式和交互样式（如 `dark:i-carbon-moon`, `hover:i-twemoji-face-with-tears-of-joy`）

**本地 SVG 图标**:
- 使用 `vite-plugin-svg-icons` 插件处理本地 SVG 图标
- SVG 图标存放在 `src/assets/icons/` 目录
- 通过 SVG sprite 方式渲染，支持 `<use href="#icon-demo">` 方式使用

**Icon 组件**:
- 提供统一的 `Icon` 组件（`src/components/icon/icon.vue`）
- 支持四种图标类型：
  - `type="uno"`: UnoCSS 图标
  - `type="iconify"`: Iconify 图标（默认）
  - `type="svg"`: 本地 SVG 图标
  - `type="iconfont"`: Iconfont 图标
- 支持自定义前缀、字体族等配置
- 自动处理字体文件的动态加载（Iconfont 场景）

### 环境变量管理系统

项目提供完整的环境变量管理方案，支持多环境配置、类型安全、以及便捷的访问方式：

**多环境支持**:
- 支持三种环境：开发环境（dev）、UAT 环境（uat）、生产环境（prod）
- 通过 `package.json` 中的 scripts 命令切换环境：
  - `pnpm dev:dev` - 启动开发环境
  - `pnpm dev:uat` - 启动 UAT 环境
  - `pnpm build:dev` - 构建开发环境
  - `pnpm build:uat` - 构建 UAT 环境
  - `pnpm build:prod` - 构建生产环境

**环境变量文件**:
- `.env` - 基础环境变量配置
- `.env.[mode]` - 特定环境的配置（如 `.env.dev`、`.env.uat`、`.env.prod`）
- `.env.local` - 本地覆盖配置（不提交到版本控制）
- `.env.[mode].local` - 特定环境的本地覆盖配置
- 文件优先级：`.env.[mode].local` > `.env.[mode]` > `.env.local` > `.env`

**类型安全**:
- 在 `env.d.ts` 中定义 `ImportMetaEnv` 接口，提供类型定义
- 所有自定义环境变量必须以 `VITE_` 前缀开头
- TypeScript 提供完整的类型检查和 IDE 自动补全

**Env 工具类**:
- 提供 `Env` 工具类（`src/utils/env.ts`）封装环境变量访问
- `Env.get(key, defaultValue)` - 获取字符串类型环境变量
- `Env.getNumber(key, defaultValue)` - 获取数字类型环境变量
- `Env.getBoolean(key, defaultValue)` - 获取布尔类型环境变量
- `Env.env` - 获取当前环境（'dev' | 'uat' | 'prod'）
- `Env.isDev`、`Env.isUat`、`Env.isProd` - 环境判断属性

**vite.config.ts 支持**:
- 使用 `loadEnv` 函数在配置文件中访问环境变量
- `defineConfig` 使用函数形式，接收 `{ mode }` 参数
- 可以根据不同环境加载不同的配置

**使用示例**:
```typescript
import { Env } from '@/utils/env'

// 获取环境变量
const appName = Env.get('VITE_APP_NAME', '默认值')
const port = Env.getNumber('VITE_PORT', 3000)
const debug = Env.getBoolean('VITE_DEBUG', false)

// 环境判断
if (Env.isDev) {
  console.log('开发环境')
}
```

### 国际化系统

项目提供完整的国际化（i18n）解决方案，支持多语言、语言包懒加载和路由级按需加载：

**核心功能**:
- 使用 `vue-i18n` Composition API 模式（`legacy: false`）
- 支持语言选择持久化（存储在 `localStorage`）
- 支持浏览器语言自动检测和回退策略
- 支持语言包动态懒加载
- 支持路由级语言包按需加载（基于 `meta.locales`）
- 使用 `@intlify/unplugin-vue-i18n` 进行编译时预处理优化

**目录结构**:
- `src/i18n/index.ts` - i18n 配置和模块化注册
- `src/i18n/locales/` - 语言包目录
  - `zh-CN.ts` - 中文语言包
  - `en-US.ts` - 英文语言包
  - `modules/<lang>/` - 模块语言包目录（按语言分类）

**默认语言与回退策略**:
- 优先从 `localStorage` 读取用户选择的语言
- 若无本地存储，使用浏览器语言
- 若浏览器语言不支持，回退到默认语言 `zh-CN`
- 支持的语言：`zh-CN`、`en-US`

**语言包加载机制**:
- **基础语言包**: 通过 `loadLanguage(lang)` 动态加载，支持懒加载和缓存
- **模块语言包**: 根据路由 `meta.locales` 配置，在路由前置守卫中按需加载
- 模块语言包路径：`src/i18n/locales/modules/<lang>/<module>.ts`
- 已加载的语言包会被缓存，避免重复加载

**路由级语言包配置**:
在路由配置中通过 `meta.locales` 指定需要加载的模块语言包：

```typescript
{
  path: '/demo',
  component: () => import('@/pages/demo.vue'),
  meta: {
    locales: ['demo', 'common'] // 加载 demo 和 common 模块的语言包
  }
}
```

**编译时优化**:
- 使用 `@intlify/unplugin-vue-i18n` 插件在构建阶段预编译语言包
- 支持 JSON、YAML 等格式的语言包文件
- 自动优化语言包体积和加载性能

**使用方式**:
```typescript
import { useI18n } from 'vue-i18n'
import { loadLanguage } from '@/i18n'

// 在组件中使用
const { t, locale } = useI18n()

// 切换语言
await loadLanguage('en-US')
locale.value = 'en-US'
```

**模块化注册**:
- 提供 `installI18n(app)` 函数进行模块化注册
- 遵循项目的统一模块化注册模式

### HTTP 请求封装系统

项目提供完整的 HTTP 请求封装方案，采用分层架构设计，支持拦截器、请求取消、插件化架构等功能：

**分层架构**:
1. **Mock 服务层**：项目根目录下的 `mock/` 目录，使用 MockJS 和 vite-plugin-mock 提供 Mock 接口
2. **请求核心封装层**：`src/http/core/` 目录，通用功能模块化，可提取为独立 lib
3. **项目配置层**：`src/http/index.ts`，项目特定配置和组装
4. **Service 层**：`src/services/` 目录，业务 API 调用接口

**核心功能**:
- **HttpClient 类**：封装 Axios 实例和基础请求方法（GET、POST、PUT、DELETE、PATCH）
- **Interceptors 类**：管理请求和响应拦截器，支持自定义拦截器
- **插件化架构**：通过 `HttpPlugin` 接口和 `PluginManager` 类实现可扩展的插件系统
- **RequestCanceler 插件**：支持请求取消功能，使用 AbortController 实现
- **通用类型定义**：`ApiResp<T>`、`PageReq`、`PageData<T>` 等类型

**目录结构**:
- `src/http/core/types.ts` - 类型定义（ApiResp、PageReq、PageData、HttpClientConfig、InterceptorConfig）
- `src/http/core/http-client.ts` - HTTP 客户端类
- `src/http/core/interceptors.ts` - 拦截器管理类
- `src/http/core/plugin.ts` - 插件接口定义
- `src/http/core/plugin-manager.ts` - 插件管理器
- `src/http/core/request-canceler.ts` - 请求取消插件
- `src/http/core/index.ts` - 统一导出
- `src/http/index.ts` - 项目配置层，导出 HttpClient 实例和 Axios 实例

**Service 层**:
- `src/services/base-service.ts` - 通用 CRUD 基类（抽象类）
- `src/services/demo-service.ts` - Demo Service 示例
- Service 层继承 `BaseService`，实现 `getPrefix()` 方法即可获得完整的 CRUD 功能

**Mock 服务**:
- Mock 文件存放在 `mock/` 目录（项目根目录）
- 使用 `vite-plugin-mock` 插件，开发环境自动启用
- 支持 CRUD 操作的 Mock 接口
- Mock 响应符合 `ApiResp<T>` 结构

**使用方式**:
```typescript
// 在 Service 中使用
import { api } from '@/http'
import { BaseService } from '@/services/base-service'

// 直接使用 api
const data = await api.get('/api/demo')

// 使用 Service 基类
export class DemoService extends BaseService<Demo, DemoListReq> {
  protected getPrefix(): string {
    return 'demo'
  }
}

// 使用 Service 实例
import { demoService } from '@/services/demo-service'
const list = await demoService.getList({ pageNum: 1, pageSize: 10 })
```

**请求取消**:
```typescript
import { api } from '@/http'

// 取消所有请求
api.cancelAll()
```

**拦截器配置**:
- 默认请求拦截器：开发环境输出请求日志
- 默认响应拦截器：开发环境输出响应日志，自动解析 API 响应格式（code、message、data）
- 支持自定义拦截器：通过 `HttpClientConfig.interceptor` 配置

## Important Constraints

### 技术约束
- **Node.js 版本**: 必须使用 ^20.19.0 || >=22.12.0
- **包管理器**: 必须使用 pnpm，不要使用 npm 或 yarn
- **TypeScript**: 所有 `.ts` 和 `.vue` 文件必须通过类型检查
- **代码质量**: 提交前必须通过 ESLint 和 Oxlint 检查

### 架构约束
- 所有功能模块必须提供 `install*` 函数进行模块化注册
- Store 模块必须放在 `src/stores/modules/` 目录
- 路由配置必须集中在 `src/router/index.ts`
- 页面文件必须放在 `src/pages` 目录，自动生成路由
- 布局文件必须放在 `src/layouts` 目录
- 样式文件必须遵循三层架构（Settings、Base、Components）
- 国际化配置必须放在 `src/i18n` 目录，语言包放在 `src/i18n/locales` 目录
- HTTP 核心封装层必须放在 `src/http/core/` 目录，保持与项目无关
- HTTP 项目配置层必须放在 `src/http/index.ts`
- Service 层必须放在 `src/services/` 目录，继承 `BaseService` 基类
- Mock 服务文件必须放在 `mock/` 目录（项目根目录）

### 样式约束
- 优先使用 UnoCSS 工具类，减少自定义 CSS
- 使用 SCSS 变量而非硬编码值
- 组件样式使用 `scoped` 避免样式污染
- 全局样式通过 `src/assets/scss/` 统一管理

### 性能约束
- 路由自动使用懒加载（由 `unplugin-vue-router` 自动处理）
- 避免在 `main.ts` 中导入大型库
- 图片资源使用适当的格式和压缩

## External Dependencies

### 核心依赖
- **vue**: Vue 3 框架核心
- **vue-router**: Vue 官方路由管理器
- **pinia**: Vue 官方状态管理库
- **pinia-plugin-persistedstate**: Pinia 状态持久化插件
- **vue-i18n**: Vue.js 官方国际化库
- **axios**: HTTP 请求库
- **@iconify/vue**: Iconify Vue 组件，用于渲染 Iconify 图标
- **@vueuse/core**: VueUse 工具集，提供丰富的组合式 API hooks

### 开发依赖
- **vite**: 构建工具和开发服务器
- **@vitejs/plugin-vue**: Vue SFC 支持
- **@vitejs/plugin-vue-jsx**: JSX 支持
- **vite-plugin-vue-devtools**: Vue DevTools 集成
- **vite-plugin-svg-icons**: SVG 图标处理插件
- **unplugin-vue-router**: 基于文件系统的自动路由生成插件
- **vite-plugin-vue-layouts**: Vue 布局管理插件
- **unplugin-auto-import**: API 自动导入插件
- **unplugin-vue-components**: 组件自动注册插件
- **@intlify/unplugin-vue-i18n**: Vue I18n 编译时预处理插件
- **vite-plugin-mock**: Vite Mock 服务插件
- **mockjs**: Mock 数据生成库
- **@types/mockjs**: MockJS TypeScript 类型定义
- **typescript**: TypeScript 编译器
- **vue-tsc**: Vue 单文件组件类型检查
- **sass**: SCSS 预处理器
- **unocss**: 原子化 CSS 引擎
- **@iconify/json**: Iconify 图标库数据
- **eslint**: 代码检查工具
- **oxlint**: 高性能 linter
- **prettier**: 代码格式化工具

### 外部服务
当前项目不依赖外部 API 或服务，所有功能均为前端实现。Mock 服务用于开发阶段模拟后端接口。

### 未来可能集成的依赖
- **Element Plus** 或 **Ant Design Vue**: UI 组件库
- **Vitest**: 单元测试框架
- **Playwright** 或 **Cypress**: E2E 测试框架
