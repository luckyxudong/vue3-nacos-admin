# 项目设计与实现文档

## 概述

本文档详细记录了 Vue3 模板项目从初始构建到完整功能集成的实现过程。项目采用渐进式开发方式，逐步集成路由、状态管理、样式系统等核心能力，最终形成一个功能完善、结构清晰的 Vue3 应用模板。

## 项目信息

- **项目名称**: vue3-template-1
- **技术栈**: Vue 3 + TypeScript + Vite + Pinia + Vue Router + SCSS + UnoCSS
- **Node 版本要求**: ^20.19.0 || >=22.12.0
- **包管理器**: pnpm

## Git 提交历史

### 提交 1: 项目初始化 (0e0c044)
**提交信息**: `feat: 使用官方脚手架创建基础项目;清理冗余文件和代码，保持项目结构清晰;重构路由配置，采用 installRouter方法实现模块化注册;简化 App.vue 结构，只保留核心路由插座`

**实现内容**:
- 使用 Vue 官方脚手架创建项目基础结构
- 清理冗余文件和代码
- 重构路由配置，采用 `installRouter` 方法实现模块化注册
- 简化 `App.vue` 结构，只保留核心路由插座

### 提交 2: Pinia 状态管理集成 (5bf6603)
**提交信息**: `feat: 添加 Pinia 状态管理和持久化插件; 创建用户 Store 模块并实现计数器功能; 更新 demo 视图以展示状态管理效果`

**实现内容**:
- 集成 Pinia 状态管理库
- 集成 `pinia-plugin-persistedstate` 持久化插件
- 创建模块化的 Store 结构
- 实现示例 Store 模块（计数器功能）
- 更新 demo 视图展示状态管理效果

### 提交 3: 样式系统集成 (cb814d1)
**提交信息**: `feat: 添加 OpenSpec 指令和配置文件; 更新项目结构以支持 UnoCSS 和 SCSS 样式系统; 创建样式测试视图以展示新样式功能`

**实现内容**:
- 集成 SCSS 预处理器
- 集成 UnoCSS 原子化 CSS 框架
- 建立三层样式架构（Settings、Base、Components）
- 实现设计令牌系统（Design Tokens）
- 配置主题切换功能（深色/浅色模式）
- 创建样式测试视图

## 架构设计

### 1. 项目结构

```
vue3-template-1/
├── docs/                    # 项目文档
│   └── design.md           # 设计文档（本文档）
├── openspec/               # OpenSpec 规范文档
│   ├── AGENTS.md           # AI 助手规范
│   └── project.md          # 项目规范
├── public/                  # 静态资源
├── src/
│   ├── assets/             # 资源文件
│   │   └── scss/           # SCSS 样式文件
│   │       ├── base/       # 基础样式层
│   │       ├── settings/   # 设计令牌层
│   │       └── index.scss  # 样式入口
│   ├── plugins/            # 插件模块
│   │   └── assets.ts       # 资源管理插件
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由模块化注册
│   ├── stores/             # 状态管理
│   │   ├── modules/        # Store 模块
│   │   │   └── user.ts     # 用户 Store（示例）
│   │   └── index.ts        # Pinia 封装和模块化注册
│   ├── views/              # 页面视图
│   │   └── demo.vue        # 演示页面
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── uno.config.ts           # UnoCSS 配置
├── vite.config.ts          # Vite 配置
└── package.json            # 项目依赖
```

### 2. 核心模块设计

#### 2.1 应用入口 (`src/main.ts`)

采用模块化安装模式，统一管理各个功能模块的初始化：

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import { installRouter } from '@/router'
import { installPinia } from '@/stores'
import { installAssets } from '@/plugins/assets'

const app = createApp(App)
installAssets()      // 初始化样式和资源
installPinia(app)    // 初始化状态管理
installRouter(app)   // 初始化路由
app.mount('#app')
```

**设计优势**:
- 清晰的初始化顺序
- 模块化设计，易于维护和扩展
- 统一的安装模式，代码风格一致

#### 2.2 路由模块 (`src/router/index.ts`)

采用 `installRouter` 方法实现模块化注册：

```typescript
export const installRouter = (app: App) => {
  app.use(router)
}
```

**设计特点**:
- 使用 `createWebHistory` 创建 HTML5 历史模式路由
- 支持路由懒加载
- 模块化注册，便于测试和维护

#### 2.3 状态管理模块 (`src/stores/`)

**架构设计**:
- 使用 Pinia 作为状态管理库
- 集成 `pinia-plugin-persistedstate` 实现状态持久化
- 采用模块化 Store 结构

**核心实现** (`src/stores/index.ts`):
```typescript
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState({
  storage: localStorage,
}))

export const installPinia = (app: App) => {
  app.use(pinia)
}

// 统一导出所有 Store 模块
export * from './modules/user'
```

**Store 模块示例** (`src/stores/modules/user.ts`):
- 使用组合式 API 风格（Composition API）
- 支持状态持久化配置
- 提供清晰的类型定义

**设计优势**:
- 模块化组织，易于扩展
- 统一导出，使用便捷
- 支持持久化，提升用户体验

#### 2.4 样式系统架构

##### 2.4.1 三层架构设计

项目采用三层样式架构，清晰分离关注点：

1. **Settings 层** (`src/assets/scss/settings/`)
   - 设计令牌（Design Tokens）定义
   - 颜色变量系统
   - 尺寸变量系统（间距、字体、圆角）

2. **Base 层** (`src/assets/scss/base/`)
   - 全局基础样式
   - HTML 元素重置
   - 第三方组件库样式覆盖入口

3. **Components 层**
   - 组件级样式（使用 UnoCSS 原子化类）
   - 采用 ACSS 模式

##### 2.4.2 设计令牌系统

**颜色系统** (`src/assets/scss/settings/_color.scss`):

- **品牌色与状态色**: primary, success, warning, danger, info
- **中性色**: 文字色、边框色、背景色
- **色阶生成**: 使用 SCSS `color.mix()` 函数自动生成浅色和深色变体
- **主题支持**: 支持深色/浅色模式切换

**技术亮点**:
```scss
@use 'sass:color';

// 使用 @each 循环批量生成 CSS 变量
@each $type, $color in (primary, $wm-color-primary), ... {
  --wm-color-#{$type}: #{$color};
  
  // 自动生成浅色变体
  @each $i in (1, 2, 3, 5, 7, 8, 9) {
    --wm-color-#{$type}-light-#{$i}: #{color.mix(#fff, $color, $i * 10%)};
  }
  
  // 自动生成深色变体
  @each $i in (1, 2) {
    --wm-color-#{$type}-dark-#{$i}: #{color.mix(#000, $color, $i * 10%)};
  }
}
```

**尺寸系统** (`src/assets/scss/settings/_size.scss`):

- **间距系统**: 基于 8px 基准的间距变量
- **字体系统**: 字体大小、粗细、行高
- **圆角系统**: 统一的圆角变量

##### 2.4.3 UnoCSS 集成

**配置文件** (`uno.config.ts`):

1. **预设配置**:
   - 使用 `presetWind4`（Tailwind 4 预设）
   - 启用样式重置（`preflights: { reset: true }`）

2. **转换器**:
   - `transformerDirectives`: 支持 `@apply` 指令
   - `transformerVariantGroup`: 支持分组写法 `hover:(bg-gray-400 text-white)`

3. **主题映射**:
   - 将 SCSS 定义的 CSS 变量映射到 UnoCSS 主题
   - 支持颜色、间距、字体、圆角等主题变量

4. **自定义规则**:
   - 为品牌色生成浅色和深色工具类
   - 例如: `bg-primary-light-3`, `bg-success-light-5` 等

5. **快捷类**:
   - `flex-center`: 水平垂直居中
   - `flex-col-center`: 垂直布局居中

**资源管理** (`src/plugins/assets.ts`):

统一管理样式和资源的导入：

```typescript
import '@/assets/scss/index.scss'
import 'virtual:uno.css'

export const installAssets = () => {}
```

**设计优势**:
- 统一入口，便于管理
- 保持 `main.ts` 简洁
- 支持按需加载

### 3. 技术选型说明

#### 3.1 构建工具: Vite

**选择理由**:
- 极速的开发服务器启动
- 快速的 HMR（热模块替换）
- 优化的生产构建
- 原生 ES 模块支持

**配置特点**:
- 使用 `@vitejs/plugin-vue` 支持 Vue SFC
- 使用 `@vitejs/plugin-vue-jsx` 支持 JSX
- 使用 `vite-plugin-vue-devtools` 提供开发工具
- 配置路径别名 `@` 指向 `src` 目录

#### 3.2 状态管理: Pinia

**选择理由**:
- Vue 官方推荐的状态管理库
- 更好的 TypeScript 支持
- 更简洁的 API
- 支持组合式 API

**集成特性**:
- 状态持久化（localStorage）
- 模块化 Store 结构
- 统一的导出方式

#### 3.3 样式方案: SCSS + UnoCSS

**SCSS 预处理器**:
- 支持变量、嵌套、混合等高级特性
- 使用 `@use` 模块化导入（替代已废弃的 `@import`）
- 使用 `sass:color` 模块进行颜色处理

**UnoCSS 原子化 CSS**:
- 高性能的原子化 CSS 引擎
- 按需生成，体积小
- 支持 `@apply` 指令和分组写法
- 与 SCSS 变量系统完美集成

**设计优势**:
- SCSS 提供设计令牌和基础样式
- UnoCSS 提供原子化工具类
- 两者结合，兼顾灵活性和开发效率

## 实现细节

### 1. 模块化注册模式

项目采用统一的模块化注册模式，所有功能模块都提供 `install*` 函数：

```typescript
// 路由模块
export const installRouter = (app: App) => { ... }

// 状态管理模块
export const installPinia = (app: App) => { ... }

// 资源模块
export const installAssets = () => { ... }
```

**优势**:
- 代码风格统一
- 易于测试（可以单独测试每个模块）
- 便于按需加载

### 2. 设计令牌到 UnoCSS 的映射

通过 UnoCSS 的主题配置，将 SCSS 定义的 CSS 变量映射到 UnoCSS 工具类：

```typescript
theme: {
  colors: {
    primary: 'var(--wm-color-primary)',
    success: 'var(--wm-color-success)',
    // ...
  },
  spacing: {
    xs: 'var(--wm-spacing-xs)',
    sm: 'var(--wm-spacing-sm)',
    // ...
  }
}
```

这样可以在组件中同时使用：
- CSS 变量: `var(--wm-color-primary)`
- UnoCSS 工具类: `text-primary`, `bg-primary`

### 3. 主题切换实现

通过 `data-theme` 属性实现主题切换：

```typescript
const toggleTheme = () => {
  const html = document.documentElement
  const currentTheme = html.getAttribute('data-theme')
  html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark')
}
```

SCSS 中通过属性选择器覆盖变量：

```scss
[data-theme='dark'] {
  --wm-color-text-primary: rgba(255, 255, 255, 0.95);
  --wm-bg-color-page: #121212;
  // ...
}
```

## 开发规范

### 1. 代码风格

- 使用 TypeScript 进行类型检查
- 使用 ESLint + Oxlint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 3 组合式 API 最佳实践

### 2. 文件命名

- 组件文件: PascalCase（如 `Demo.vue`）
- 工具文件: kebab-case（如 `assets.ts`）
- Store 模块: kebab-case（如 `user.ts`）

### 3. 导入规范

- 使用路径别名 `@` 导入项目文件
- 统一从模块入口导入（如 `@/stores`）
- 样式文件使用相对路径导入

## 使用指南

### 1. 启动项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

### 2. 使用状态管理

```typescript
// 从统一入口导入
import { useDemoStore } from '@/stores'

const demoStore = useDemoStore()
demoStore.increment()
```

### 3. 使用样式系统

**使用 UnoCSS 工具类**:
```vue
<div class="text-primary bg-base p-lg rounded-base">
  内容
</div>
```

**使用 SCSS @apply 指令**:
```scss
.my-component {
  @apply text-lg text-primary p-md;
}
```

**使用 CSS 变量**:
```scss
.custom-style {
  color: var(--wm-color-primary);
  padding: var(--wm-spacing-lg);
}
```

### 4. 添加新的 Store 模块

1. 在 `src/stores/modules/` 创建新的 Store 文件
2. 在 `src/stores/index.ts` 中导出新模块
3. 在组件中通过 `@/stores` 导入使用

### 5. 添加新的路由

在 `src/router/index.ts` 的 `routes` 数组中添加新路由配置。

## 项目演进路线

### 阶段 1: 项目初始化 ✅
- [x] 创建基础项目结构
- [x] 配置开发环境
- [x] 集成路由系统
- [x] 清理冗余代码

### 阶段 2: 状态管理 ✅
- [x] 集成 Pinia
- [x] 集成状态持久化
- [x] 创建模块化 Store 结构
- [x] 实现示例 Store

### 阶段 3: 样式系统 ✅
- [x] 集成 SCSS 预处理器
- [x] 建立三层样式架构
- [x] 实现设计令牌系统
- [x] 集成 UnoCSS
- [x] 配置主题切换

### 阶段 4: 待扩展功能
- [ ] HTTP 请求封装（Axios）
- [ ] 权限管理系统
- [ ] 国际化支持（i18n）
- [ ] 组件库集成（Element Plus / Ant Design Vue）
- [ ] 单元测试配置（Vitest）
- [ ] E2E 测试配置（Playwright / Cypress）

## 总结

本项目通过渐进式开发方式，逐步构建了一个功能完善、结构清晰的 Vue3 应用模板。项目采用模块化设计思想，统一的安装模式，清晰的代码组织，为后续功能扩展奠定了良好的基础。

**核心特性**:
- ✅ 模块化架构设计
- ✅ TypeScript 类型支持
- ✅ 状态管理与持久化
- ✅ 完整的样式系统（SCSS + UnoCSS）
- ✅ 主题切换支持
- ✅ 统一的代码风格和规范

**技术亮点**:
- 使用 SCSS 的 `color.mix()` 函数自动生成色阶
- 通过 UnoCSS 将设计令牌映射到工具类
- 模块化的安装模式，便于维护和扩展
- 三层样式架构，清晰分离关注点

项目已具备生产环境使用的基础能力，可以作为新项目的起始模板，快速启动开发工作。
