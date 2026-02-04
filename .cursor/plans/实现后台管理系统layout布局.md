---
name: 实现后台管理系统Layout布局
overview: 根据图片中的布局设计，实现一个完整的后台管理系统Layout，包括左侧多级菜单、顶部工具栏（面包屑、主题切换、语言切换、用户头像）、页面Tab管理、以及首页"早安"卡片。
todos:
  - id: create-menu-store
    content: 创建菜单配置Store (src/stores/modules/menu.ts)，定义多级菜单结构和展开/折叠状态管理
    status: pending
  - id: create-tabs-store
    content: 创建Tab管理Store (src/stores/modules/tabs.ts)，管理打开的页面列表和激活状态
    status: pending
  - id: create-sidebar
    content: 创建左侧菜单组件 (src/components/layout/Sidebar.vue)，支持多级菜单、图标、展开/折叠
    status: pending
  - id: create-header
    content: 创建顶部工具栏组件 (src/components/layout/Header.vue)，包含面包屑、主题切换、语言切换、用户头像
    status: pending
  - id: create-tabs
    content: 创建页面Tab组件 (src/components/layout/Tabs.vue)，支持显示、切换、关闭Tab
    status: pending
  - id: create-goodmorning-card
    content: 创建早安卡片组件 (src/components/layout/GoodMorningCard.vue)，显示问候语和天气信息
    status: pending
  - id: update-layout
    content: 重构主布局 (src/layouts/default.vue)，集成所有布局组件
    status: pending
  - id: update-index-page
    content: 更新首页 (src/pages/index.vue)，添加早安卡片组件
    status: pending
  - id: add-i18n-texts
    content: 添加国际化文本到 zh-CN.ts 和 en-US.ts，包含菜单、工具栏、卡片等文本
    status: pending
isProject: false
---

# 实现后台管理系统Layout布局

## 架构设计

### 布局结构

```
┌─────────────────────────────────────────┐
│  顶部工具栏 (Header)                    │
│  [面包屑] [主题] [语言] [用户头像]      │
├──────┬──────────────────────────────────┤
│      │  页面Tab栏                       │
│ 左侧 │  [Tab1] [Tab2] [Tab3]           │
│ 菜单 │──────────────────────────────────│
│      │                                  │
│      │  主内容区 (router-view)          │
│      │                                  │
└──────┴──────────────────────────────────┘
```

### 组件结构

- `src/layouts/default.vue` - 主布局容器
- `src/components/layout/Sidebar.vue` - 左侧菜单组件
- `src/components/layout/Header.vue` - 顶部工具栏组件
- `src/components/layout/Tabs.vue` - 页面Tab组件
- `src/components/layout/GoodMorningCard.vue` - 早安卡片组件
- `src/stores/modules/menu.ts` - 菜单配置Store
- `src/stores/modules/tabs.ts` - Tab管理Store

## 实现步骤

### 1. 创建菜单配置Store (`src/stores/modules/menu.ts`)

- 定义菜单数据结构（支持多级菜单）
- Mock菜单数据，参考图片中的菜单项：
  - 概览（展开）
    - 分析页
    - 工作台
  - 演示
  - 示例
  - 系统管理
  - 项目
  - 关于
- 菜单项包含：title、icon、path、children等字段
- 管理菜单的展开/折叠状态

### 2. 创建Tab管理Store (`src/stores/modules/tabs.ts`)

- 管理打开的页面列表（tabs数组）
- 当前激活的页面（activeTab）
- 方法：
  - `addTab(route)` - 添加页面到Tab列表
  - `removeTab(path)` - 关闭指定Tab
  - `setActiveTab(path)` - 切换激活的Tab
  - `closeOtherTabs(path)` - 关闭其他Tab（可选）
- 监听路由变化，自动添加Tab

### 3. 创建左侧菜单组件 (`src/components/layout/Sidebar.vue`)

- 使用shadcn-vue的Card组件作为容器
- 显示Logo和项目名称
- 渲染菜单列表（支持多级菜单）
- 菜单项使用Icon组件显示图标
- 支持菜单展开/折叠功能
- 高亮当前激活的菜单项
- 使用UnoCSS和SCSS变量保持UI风格一致

### 4. 创建顶部工具栏组件 (`src/components/layout/Header.vue`)

- **面包屑导航**：
  - 基于当前路由生成面包屑路径
  - 使用路由meta信息或菜单配置获取标题
  - 显示格式：首页 > 概览 > 工作台
- **主题切换**：
  - 使用现有的`useDark` hook
  - 显示太阳/月亮图标切换
- **语言切换**：
  - 使用现有的i18n系统
  - 显示当前语言，点击切换
- **用户头像**：
  - 从`useAuthStore`获取用户信息
  - 显示用户头像（默认头像）
  - 点击显示下拉菜单（登出等操作）
- 使用UnoCSS工具类和SCSS变量

### 5. 创建页面Tab组件 (`src/components/layout/Tabs.vue`)

- 显示已打开的页面列表
- 每个Tab显示页面标题和关闭按钮
- 支持点击Tab切换页面
- 支持关闭Tab（关闭后自动切换到相邻Tab）
- 高亮当前激活的Tab
- 使用shadcn-vue的Button组件

### 6. 创建"早安"卡片组件 (`src/components/layout/GoodMorningCard.vue`)

- 使用Card组件作为容器
- 显示内容：
  - 问候语："早安, {用户名}, 开始您一天的工作吧!"
  - 天气信息："今日晴, 20°C - 32°C!"（mock数据）
  - 卡通头像或图标
- 样式符合项目UI风格
- 添加国际化支持

### 7. 更新主布局 (`src/layouts/default.vue`)

- 重构布局结构：
  - 左侧固定宽度菜单栏
  - 右侧主内容区（flex布局）
  - 顶部工具栏固定在顶部
  - Tab栏在工具栏下方
  - 主内容区可滚动
- 集成所有布局组件
- 响应式设计（移动端可折叠菜单）

### 8. 更新首页 (`src/pages/index.vue`)

- 在页面顶部添加"早安"卡片组件
- 保留现有的首页内容
- 调整布局，确保卡片和内容合理排列

### 9. 添加国际化文本

- 在`src/i18n/locales/zh-CN.ts`和`en-US.ts`中添加：
  - 菜单项文本
  - 工具栏文本（面包屑、主题、语言等）
  - "早安"卡片文本
  - Tab相关文本

### 10. 更新路由配置（可选）

- 为路由添加meta信息，包含：
  - 页面标题（用于Tab和面包屑）
  - 菜单配置（是否在菜单中显示）
  - 图标信息

## 技术要点

### UI组件使用

- 使用shadcn-vue的Card、Button等组件
- 使用项目中的Icon组件显示图标
- 使用UnoCSS工具类进行样式布局

### 样式规范

- 使用SCSS变量系统（`_color.scss`）
- 主色调：`#1c9399`（--wm-color-primary）
- 支持深色/浅色主题切换
- 边框颜色：`var(--wm-border-color-base)`
- 背景色：`var(--wm-bg-color-base)`

### 状态管理

- 菜单状态：使用Pinia Store管理
- Tab状态：使用Pinia Store管理
- 用户信息：使用现有的`useAuthStore`
- 主题状态：使用VueUse的`useDark`

### 路由集成

- 监听路由变化，自动更新Tab和面包屑
- 菜单点击跳转到对应路由
- Tab点击切换路由

## 文件清单

### 新建文件

- `src/stores/modules/menu.ts` - 菜单配置Store
- `src/stores/modules/tabs.ts` - Tab管理Store
- `src/components/layout/Sidebar.vue` - 左侧菜单组件
- `src/components/layout/Header.vue` - 顶部工具栏组件
- `src/components/layout/Tabs.vue` - 页面Tab组件
- `src/components/layout/GoodMorningCard.vue` - 早安卡片组件

### 修改文件

- `src/layouts/default.vue` - 重构主布局
- `src/pages/index.vue` - 添加早安卡片
- `src/i18n/locales/zh-CN.ts` - 添加中文文本
- `src/i18n/locales/en-US.ts` - 添加英文文本
- `src/stores/index.ts` - 导出新的Store（如需要）

## 注意事项

1. **菜单折叠功能**：左侧菜单支持折叠，折叠后只显示图标
2. **Tab管理**：首页默认打开，关闭最后一个Tab时跳转到首页
3. **响应式设计**：移动端菜单可收起为抽屉式
4. **性能优化**：菜单和Tab列表使用虚拟滚动（如果列表很长）
5. **用户体验**：菜单项hover效果、Tab切换动画等
6. **国际化**：所有文本都支持中英文切换
7. **主题切换**：确保深色模式下所有组件正常显示
