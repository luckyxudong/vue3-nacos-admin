# Vue3 集成 shadcn-vue 组件

## 1. 概述

shadcn-vue 是一个基于 Vue 3 的组件代码分发平台，它不是一个传统的组件库，而是将组件代码直接复制到你的项目中，让你拥有完全的代码控制权。

**核心特点**：
- **开放代码**：组件代码直接在你的项目中，可以自由修改
- **组合式设计**：所有组件使用统一的组合式接口
- **美观的默认样式**：精心设计的默认样式，开箱即用
- **AI 友好**：开放的代码结构，便于 AI 工具理解和改进

**项目现状**：
- Vue 3 + TypeScript + Vite
- UnoCSS（通过 presetWind4，与 Tailwind CSS 兼容）
- SCSS 设计令牌系统（CSS 变量）
- 模块化注册模式

## 2. 安装依赖

### 2.1 安装 clsx 和 tailwind-merge

shadcn-vue 组件需要使用 `cn` 工具函数来合并类名，该函数依赖 `clsx` 和 `tailwind-merge`：

```bash
pnpm add clsx tailwind-merge
```

- `clsx`：用于条件性地合并类名
- `tailwind-merge`：用于智能合并 Tailwind/UnoCSS 类名，解决类名冲突

## 3. 初始化 shadcn-vue 配置

### 3.1 运行初始化命令

在项目根目录运行以下命令：

```bash
pnpm dlx shadcn-vue@latest init
```

该命令会交互式地询问配置选项，根据项目情况选择：

- **Style**: 选择 `default`
- **Base color**: 选择 `zinc`（与项目中性色系统兼容）
- **CSS variables**: 选择 `yes`（使用 CSS 变量）
- **TypeScript**: 选择 `yes`（TypeScript 项目）

### 3.2 配置 components.json

初始化完成后，会在项目根目录生成 `components.json` 配置文件。需要根据项目实际情况调整配置：

```json
{
  "style": "default",
  "tailwind": {
    "config": "uno.config.ts",
    "css": "src/assets/scss/index.scss",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "typescript": true,
  "aliases": {
    "utils": "@/lib/utils",
    "components": "@/components"
  }
}
```

**配置说明**：
- `tailwind.config`: 指向 `uno.config.ts`（UnoCSS 配置，与 Tailwind CSS 兼容）
- `css`: 指向项目的样式入口文件 `src/assets/scss/index.scss`
- `baseColor`: 选择 `zinc`，与项目的中性色系统兼容
- `cssVariables`: `true`，使用 CSS 变量主题系统
- `aliases.utils`: `@/lib/utils`，cn 工具函数的路径
- `aliases.components`: `@/components`，组件目录

## 4. 创建 cn 工具函数

### 4.1 创建 utils.ts 文件

在 `src/lib/utils.ts` 创建 `cn` 函数：

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并类名工具函数
 * 使用 clsx 合并类名，使用 tailwind-merge 处理 Tailwind/UnoCSS 类名冲突
 * 
 * @param inputs - 类名数组或对象
 * @returns 合并后的类名字符串
 * 
 * @example
 * cn('px-2 py-1', 'bg-red-500', { 'text-white': true })
 * cn('px-2', 'px-4') // 结果: 'px-4' (tailwind-merge 会智能合并冲突的类名)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 4.2 类型定义

确保 `tsconfig.app.json` 中包含 `src/lib` 目录：

```json
{
  "include": [
    "env.d.ts",
    "src/**/*",
    "src/**/*.vue",
    // ...
  ]
}
```

## 5. 添加 shadcn-vue CSS 变量

### 5.1 创建 _shadcn.scss 文件

在 `src/assets/scss/settings/` 目录创建 `_shadcn.scss` 文件，定义 shadcn-vue 所需的 CSS 变量：

```scss
@use 'sass:color';

// shadcn-vue 基础颜色（基于 zinc）
$shadcn-zinc-50: #fafafa;
$shadcn-zinc-100: #f4f4f5;
$shadcn-zinc-200: #e4e4e7;
$shadcn-zinc-300: #d4d4d8;
$shadcn-zinc-400: #a1a1aa;
$shadcn-zinc-500: #71717a;
$shadcn-zinc-600: #52525b;
$shadcn-zinc-700: #3f3f46;
$shadcn-zinc-800: #27272a;
$shadcn-zinc-900: #18181b;
$shadcn-zinc-950: #09090b;

// 浅色主题（默认）
:root {
  // 背景色
  --background: #{$shadcn-zinc-50};
  --foreground: #{$shadcn-zinc-950};
  
  // 卡片
  --card: #{$shadcn-zinc-50};
  --card-foreground: #{$shadcn-zinc-950};
  
  // 弹出层
  --popover: #{$shadcn-zinc-50};
  --popover-foreground: #{$shadcn-zinc-950};
  
  // 主要按钮
  --primary: #{$shadcn-zinc-900};
  --primary-foreground: #{$shadcn-zinc-50};
  
  // 次要按钮
  --secondary: #{$shadcn-zinc-100};
  --secondary-foreground: #{$shadcn-zinc-900};
  
  // 静音/禁用
  --muted: #{$shadcn-zinc-100};
  --muted-foreground: #{$shadcn-zinc-500};
  
  // 强调
  --accent: #{$shadcn-zinc-100};
  --accent-foreground: #{$shadcn-zinc-900};
  
  // 破坏性操作
  --destructive: #ef4444;
  --destructive-foreground: #{$shadcn-zinc-50};
  
  // 边框
  --border: #{$shadcn-zinc-200};
  --input: #{$shadcn-zinc-200};
  --ring: #{$shadcn-zinc-900};
  
  // 圆角
  --radius: 0.5rem;
}

// 深色主题
[data-theme='dark'] {
  // 背景色
  --background: #{$shadcn-zinc-950};
  --foreground: #{$shadcn-zinc-50};
  
  // 卡片
  --card: #{$shadcn-zinc-950};
  --card-foreground: #{$shadcn-zinc-50};
  
  // 弹出层
  --popover: #{$shadcn-zinc-950};
  --popover-foreground: #{$shadcn-zinc-50};
  
  // 主要按钮
  --primary: #{$shadcn-zinc-50};
  --primary-foreground: #{$shadcn-zinc-900};
  
  // 次要按钮
  --secondary: #{$shadcn-zinc-800};
  --secondary-foreground: #{$shadcn-zinc-50};
  
  // 静音/禁用
  --muted: #{$shadcn-zinc-800};
  --muted-foreground: #{$shadcn-zinc-400};
  
  // 强调
  --accent: #{$shadcn-zinc-800};
  --accent-foreground: #{$shadcn-zinc-50};
  
  // 破坏性操作
  --destructive: #ef4444;
  --destructive-foreground: #{$shadcn-zinc-50};
  
  // 边框
  --border: #{$shadcn-zinc-800};
  --input: #{$shadcn-zinc-800};
  --ring: #{$shadcn-zinc-300};
  
  // 圆角
  --radius: 0.5rem;
}
```

### 5.2 导入 _shadcn.scss

在 `src/assets/scss/settings/index.scss` 中导入 `_shadcn.scss`：

```scss
@use './color';
@use './size';
@use './shadcn'; // 新增：导入 shadcn-vue CSS 变量
```

## 6. 更新 UnoCSS 配置（可选）

如果需要让 shadcn-vue 的 CSS 变量在 UnoCSS 中也能使用，可以在 `uno.config.ts` 中添加主题变量映射：

```typescript
export default defineConfig({
  // ... 其他配置
  
  theme: {
    colors: {
      // ... 现有颜色配置
      
      // shadcn-vue 颜色变量
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      card: 'var(--card)',
      'card-foreground': 'var(--card-foreground)',
      popover: 'var(--popover)',
      'popover-foreground': 'var(--popover-foreground)',
      primary: 'var(--primary)',
      'primary-foreground': 'var(--primary-foreground)',
      secondary: 'var(--secondary)',
      'secondary-foreground': 'var(--secondary-foreground)',
      muted: 'var(--muted)',
      'muted-foreground': 'var(--muted-foreground)',
      accent: 'var(--accent)',
      'accent-foreground': 'var(--accent-foreground)',
      destructive: 'var(--destructive)',
      'destructive-foreground': 'var(--destructive-foreground)',
      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',
    },
    borderRadius: {
      // ... 现有圆角配置
      DEFAULT: 'var(--radius)',
    },
  },
})
```

**注意**：这一步是可选的，因为 shadcn-vue 组件主要使用 CSS 变量，不依赖 UnoCSS 的主题配置。

## 7. 组件自动注册配置

项目已配置 `unplugin-vue-components` 插件，会自动扫描 `src/components` 目录及其子目录。

shadcn-vue 组件会安装在 `src/components/ui/` 目录下，由于插件已配置 `deep: true`，会自动识别这些组件，无需手动导入。

**验证组件类型定义**：

组件安装后，会在 `components.d.ts` 中自动生成类型定义，确保 TypeScript 类型安全。

## 8. 安装和使用组件

### 8.1 安装组件

使用 shadcn-vue CLI 安装组件：

```bash
# 安装单个组件
pnpm dlx shadcn-vue@latest add button

# 安装多个组件
pnpm dlx shadcn-vue@latest add button card dialog
```

组件会安装到 `src/components/ui/` 目录下。

### 8.2 使用组件

由于配置了组件自动注册，可以直接在模板中使用组件，无需手动导入：

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

### 8.3 自定义组件

由于 shadcn-vue 组件代码直接在你的项目中，你可以自由修改组件代码以满足项目需求。

例如，修改 `src/components/ui/button/Button.vue`：

```vue
<script setup lang="ts">
// 可以自由修改组件逻辑和样式
</script>
```

## 9. 与项目设计令牌系统集成

### 9.1 映射项目设计令牌

如果需要将 shadcn-vue 的 CSS 变量映射到项目现有的设计令牌，可以在 `_shadcn.scss` 中使用项目变量：

```scss
@use '../color' as *;

:root {
  // 使用项目的主色
  --primary: var(--wm-color-primary);
  --primary-foreground: #ffffff;
  
  // 使用项目的背景色
  --background: var(--wm-bg-color-page);
  --foreground: var(--wm-color-text-primary);
  
  // ... 其他映射
}
```

### 9.2 主题切换

项目支持通过 `data-theme` 属性切换主题，shadcn-vue 的 CSS 变量已配置深色主题支持，与项目的主题切换机制兼容。

## 10. 目录结构

集成完成后的目录结构：

```
vue3-template-1/
├── components.json              # shadcn-vue 配置文件
├── src/
│   ├── lib/
│   │   └── utils.ts             # cn 工具函数
│   ├── components/
│   │   ├── icon/
│   │   │   └── icon.vue
│   │   └── ui/                  # shadcn-vue 组件目录
│   │       ├── button/
│   │       │   └── Button.vue
│   │       ├── card/
│   │       │   └── Card.vue
│   │       └── ...
│   └── assets/
│       └── scss/
│           └── settings/
│               ├── _color.scss
│               ├── _size.scss
│               ├── _shadcn.scss  # shadcn-vue CSS 变量
│               └── index.scss
```

## 11. 注意事项

### 11.1 UnoCSS 兼容性

虽然项目使用 UnoCSS，但通过 `presetWind4` 提供了 Tailwind CSS 兼容的工具类，shadcn-vue 组件可以正常使用。组件中的 Tailwind 类名会被 UnoCSS 正确处理。

### 11.2 设计令牌映射

建议将 shadcn-vue 的 CSS 变量映射到项目现有的设计令牌系统，保持设计一致性。可以根据项目需求调整 `_shadcn.scss` 中的变量值。

### 11.3 主题切换

确保 shadcn-vue 的主题变量支持项目的深色/浅色模式切换。已通过 `[data-theme='dark']` 选择器配置深色主题。

### 11.4 组件自动注册

shadcn-vue 组件会自动被 `unplugin-vue-components` 识别，无需手动导入。组件类型定义会自动生成在 `components.d.ts` 中。

### 11.5 类型安全

shadcn-vue 组件提供完整的 TypeScript 类型定义，确保类型安全。组件 props 和事件都有类型提示。

### 11.6 组件更新

由于组件代码直接在你的项目中，更新组件需要手动操作：

1. 查看 shadcn-vue 官方文档的更新日志
2. 对比本地组件代码与最新版本
3. 手动更新或使用 CLI 重新安装组件（会覆盖本地修改）

**建议**：如果对组件进行了自定义修改，建议在组件文件中添加注释说明，避免更新时丢失修改。

## 12. 参考资源

- **shadcn-vue 官方文档**: https://www.shadcn-vue.com/
- **shadcn-vue GitHub**: https://github.com/radix-vue/shadcn-vue
- **组件列表**: https://www.shadcn-vue.com/docs/components
- **UnoCSS 文档**: https://unocss.dev/
- **clsx 文档**: https://github.com/lukeed/clsx
- **tailwind-merge 文档**: https://github.com/dcastil/tailwind-merge

## 13. 总结

通过以上步骤，成功将 shadcn-vue 集成到 Vue3 项目中：

1. ✅ 安装了必要的依赖（clsx、tailwind-merge）
2. ✅ 初始化了 shadcn-vue 配置（components.json）
3. ✅ 创建了 cn 工具函数
4. ✅ 添加了 shadcn-vue CSS 变量定义
5. ✅ 配置了组件自动注册
6. ✅ 支持主题切换（深色/浅色模式）

现在可以使用 `pnpm dlx shadcn-vue@latest add <component-name>` 命令安装所需的组件，并在项目中直接使用，无需手动导入。
