# Vue3 优雅使用图标

需求：在UnoCSS的基础上，依次实现 UnoCSS 图标、本地 SVG 图标，最后提供一套强大的图标解决方案

## 1. UnoCSS 图标

### 1.1 安装依赖

```
pnpm add @iconify/json -D
```

### 1.2 添加预设

在创建的 `uno.config.ts`的 `presets`数组中配置图标预设：

```javascript
import {
  // ...
  presetIcons,
} from 'unocss'

export default defineConfig({
  presets: [
    // ...
    presetIcons({
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  // ...
})
```

### 1.3 测试使用图标

在 demo.vue 中测试使用图标，启动服务进行测试，看看在浏览器中是否会出现图标。

```vue
<template>
  <div>
    <!-- A basic anchor icon from Phosphor icons -->
    <div class="i-ph-anchor-simple-thin" />
    <!-- An orange alarm from Material Design Icons -->
    <i class="i-mdi-alarm text-orange-400" />
    <!-- A large Vue logo -->
    <div class="i-logos-vue text-3xl" />
    <!-- Sun in light mode, Moon in dark mode, from Carbon -->
    <button class="i-carbon-sun dark:i-carbon-moon" />
    <!-- Twemoji of laugh, turns to tear on hovering -->
    <div class="i-twemoji-grinning-face-with-smiling-eyes hover:i-twemoji-face-with-tears-of-joy" />
</template>
```

## 2. 本地 SVG 图标

虽然 Iconify 提供了丰富的图标库，但项目开发中常常需要使用 UI 设计师提供的自定义 SVG 图标。因此，我们需要为模板项目添加本地 SVG 图标的支持。

### 2.1 安装依赖

安装 Vite SVG 图标插件：

```
pnpm add vite-plugin-svg-icons -D
```

### 2.2 配置 Vite 插件

1) 在 `vite.config.ts`中添加 SVG 图标插件配置：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    // 配置 SVG 图标插件
    createSvgIconsPlugin({
      // SVG 图标目录
      iconDirs: [fileURLToPath(new URL('./src/assets/icons', import.meta.url))],
      // 生成的 symbol ID 格式
      symbolId: 'icon-[dir]-[name]
    })
  ],
})
```

2) 创建 SVG 图标目录:

3) 在 `src/assets`目录中创建 `icons`目录，用于存放本地 SVG 图标

```javascript
// ...
import 'virtual:svg-icons-register'

// ...
```

### 2.3 测试本地 SVG 图标

1）准备 SVG 图标：

在 `assets/icons`目录下添加一个 SVG 图标文件，例如 `demo.svg`

2）在 `demo.vue`中测试 SVG 图标：

```vue
<svg aria-hidden="true" class="svg">
  <use href="#icon-demo" fill="red" />
</svg>
```

需要注意：
在 vite.config.ts 中配置插件时定义了 symbolId：
1）svg 文件的存放位置要与 symbolId 一致；
2） 中 href 图标的引用格式也要与 symbolId 一致。



## 3. 实现强大的图标组件 Icon

在真实开发过程中，除了会遇到 SVG 图标，还有可能遇到 iconfont 图标；另外，Iconify 也提供了 Vue 组件。

故本文的最后，咱封装一个强大的图标组件，支持四种使用方式：
1）Iconify Icon
2）UnoCSS Icon （本质上也是 Iconify Icon）
3）本地 svg 图标
4）本地或在线的 Iconfont

### 3.1 创建组件

按照如下目录文件结构，创建图标组件：

```
src/
|- components/
    |- icon/
       |- icon.vue
```

初始化组件代码：

```vue
<template>
</template>

<script setup lang="ts">
defineOptions({ name: 'Icon' })
</script>

<style scoped lang="scss"></style>
```

### 3.2 定义属性 props

按照需求，组件的属性定义如下：

```javascript
const props = withDefaults(
  defineProps<{
    /**
     * Icon 图标类型：
     * - uno：UnoCSS Icon，对应的 icon 属性：https://icones.js.org/
     * - iconify: Iconify 图标，对应的 icon 属性： https://icon-sets.iconify.design/
     * - svg：本地 SVG 图标
     * - iconfont：IconFont 图标
     */
    type?: 'uno' | 'svg' | 'iconify' | 'iconfont'
    icon: string
    prefix?: string
    fontFamily?: string
    fontUrl?: string
  }>(),
  {
    type: 'iconify',
    prefix: 'icon',
    fontFamily: 'iconfont',
  },
)
```

`type`：指定该组件的四种使用方式。

1）type 为 `uno`时，可以从如下地址搜索图标，并获取图标的 `name`：

https://icones.js.org/collection/all

2）type 为 `iconfiy`时，可以从如下地址搜索图标，并获取图标的 `name`：

https://icon-sets.iconify.design/

3）type 为 `svg`时，使用本地的 SVG 图标，SVG 图标的位置和前缀在 `vite.config.ts`中指定。
如果配置的前缀不是字符串 `icon`，需要设置 `prefix`属性；

4）type 为 `iconfont`时，如果字体图标文件没有在 index.html 使用 link 标签引入，则需要设置 `fontUrl`属性；
另外要注意字体图标的 prefix 和 font-family 是否与默认值一致，如果不一致也需要手动指定。

### 3.3 安装依赖

当 type 为 `iconfiy`时，使用 Iconify Icon Vue 组件，安装该组件：

```
pnpm add @iconify/vue
```

如果你不需要使用 iconify，也可以不用安装，因为 UnoCSS 图标的方式，本质上也是 Iconify Icon 的图标。

### 3.4 实现组件

根据 type 的值，实现不同类型的使用：

```vue
<template>
  <div v-if="type === 'uno'" :class="icon" />

  <iconify-icon v-else-if="type === 'iconify'" :icon="icon" class="icon" :aria-hidden="false" />

  <svg v-else-if="type === 'svg'" class="svg">
    <use :href="svgSymbolId" fill="currentColor" />
  </svg>

  <i v-else-if="type === 'iconfont'" :class="iconfontClassName" />

  <span v-else>Unsupported type: {{ type }}</span>
</template>
<script setup lang="ts">
import { onBeforeMount, computed, withDefaults, defineProps } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'

defineOptions({ name: 'Icon' })

const props = withDefaults(
  defineProps<{
    type?: 'uno' | 'svg' | 'iconify' | 'iconfont'
    icon: string
    prefix?: string
    fontFamily?: string
    fontUrl?: string
  }>(),
  {
    type: 'iconify',
    prefix: 'icon',
    fontFamily: 'iconfont',
  },
)

onBeforeMount(() => {
  if (props.type === 'iconfont' && props.fontUrl) {
    const existingLink = document.querySelector(`link[href="${props.fontUrl}"]`)
    if (!existingLink) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = props.fontUrl
      document.head.appendChild(link)
    }
  }
})

const svgSymbolId = computed(() => `#${props.prefix}-${props.icon}`)

const iconfontClassName = computed(() => `${props.fontFamily} ${props.prefix}-${props.icon}`)
</script>

<style scoped lang="scss">
.icon {
  @apply inline-block align-mid text-xl;
}
.svg {
  @apply inline-block align-mid;
  width: 1rem;
  height: 1rem;
}
</style>
```

### 3.5 测试组件

在 demo.vue 中测试四种使用方式：

```vue
<div>
  <icon type="iconify" icon="mdi:user" class="size-8 text-primary" />
  <icon type="uno" icon="i-mdi:user" class="size-8 text-primary" />
  <icon type="svg" icon="demo" class="text-primary size-8!" />
  <icon
    type="iconfont"
    font-url="//at.alicdn.com/t/c/font_3457715_h47rhjpli3n.css"
    icon="mobile-alt"
    class="text-primary text-2xl!"
  />
</div>
```

## 4. 总结

为模板项目添加了完整的图标支持方案：

**UnoCSS 图标**

集成了 Iconify 图标库，通过简单的类名即可使用成千上万个图标

**本地 SVG 图标**

支持使用 UI 设计师提供的自定义 SVG 图标，满足个性化需求

**强大的 Icon 组件**

封装了一个支持四种使用方式的图标组件，统一了图标使用规范，简化开发。

这些配置为模板项目提供了灵活、高效的图标使用能力，满足了不同场景下的图标需求。通过统一的图标组件，我们可以在项目中无缝切换不同类型的图标。













