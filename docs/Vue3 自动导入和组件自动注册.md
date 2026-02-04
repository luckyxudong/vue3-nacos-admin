# Vue3 自动导入和组件自动注册

## 1. unplugin-auto-import 自动导入插件

unplugin-auto-import，是一款强大的自动导入插件

GitHub 地址：

https://github.com/unplugin/unplugin-auto-import

集成该插件后，在 Vue 组件中使用相关 API 时，将无需手动编写 `import`语句。

### 1.1 安装依赖

```markdown
pnpm add unplugin-auto-import -D
```

### 1.2 配置 vite 插件

在 `vite.config.ts`中配置该插件。在配置该插件时，默认导入如下库：vue、vue-router、pinia。 由于前文集成了自动路由 `unplugin-vue-router`，故默认导入路由也要修改为自动路由。

代码如下：

```javascript
// ...
import AutoImport from 'unplugin-auto-import/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'

export default defineConfig({
  plugins: [
    // ...
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: ['vue', VueRouterAutoImports, 'pinia'],
    }),
    // ...
  ],
  // ...
})
```

### 1.3 类型文件

重新启动服务，会在根路径下自动生成类型声明文件，默认名称为 `auto-imports.d.ts`。

在 `tsconfig.app.json`的 `include`中添加该文件：

```javascript
{
  // ..
  "include": [
      // ...
      "auto-imports.d.ts"
  ],
  // ...
}
```

### 1.4 集成 vueuse

上面的步骤已经配置好了自动导入，此时可以在 vue 文件中，把从 vue、vue-router、pinia 手动 import 的代码删除。
例如：要使用 ref 函数，不再需要 `<script>`中
`import { ref } from 'vue'`，
直接使用 `ref() `即可。

```vue
<template>
  <div>{{ msg }}</div>
</template>

<script setup lang="ts">
// 这里不用再写 import { ref } from 'vue'
const msg = ref('Hello world')
</script>
```



如果有其他要自动导入的库，只需要在 vite 插件配置的 `imports`数组中追加该库就行。

`vueuse`是一个非常实用的 Vue 组合式 API 工具集，提供了大量的 hooks，优雅哥在项目中也经常使用，所以通用模板项目便把 `vueuse`集成进来。

vueuse 提供了哪些函数，大家自己去官网查看：

https://v4-11-2.vueuse.org/

将 `vueuse`集成到自动导入中，后面在组件中使用到其提供的 hooks 时，也不需要 import，直接使用就行

安装 VueUse：

```shell
pnpm add @vueuse/core
```

在 `vite.config.ts`文件中 `AutoImport`的 `imports`数组中添加 vueuse，如下：

```javascript
// ...
export default defineConfig({
  plugins: [
    // ...
    AutoImport({
      // ...
      imports: ['vue', VueRouterAutoImports, 'pinia', '@vueuse/core'],
    }),
    // ...
  ],
  // ...
})
```

重启服务后，咱来实现一个小 Demo。

（SCSS UnoCSS 样式管理）中，咱简单实现了暗黑模式切换，按钮点击事件的代码如下：

```
const toggleTheme = () => {
  const html = document.documentElement
  const currentTheme = html.getAttribute('data-theme')
  html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark')
}
```

现在咱们使用 vueuse 中提供的 hooks 来实现这个功能。需要使用到两个 hooks：
1）useDark：返回具有响应性的暗黑模式变量，并且持久化（即页面刷新时，保持暗黑模式的状态，无需你手动存储到 storage 中）
2）useToggle：返回开关状态和切换开关的函数。

在 `pages/index.vue`中实现暗黑模式切换：

```vue
<template>
  <div class="index">index</div>
  <div>msg: {{ msg }}</div>
  <div>isDark: {{ isDark }}</div>
  <button @click="toggleDark()">Toggle</button>
</template>

<script setup lang="ts">
const msg = ref('Hello world')

const isDark = useDark({
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const toggleDark = useToggle(isDark)
</script>
```

上面的代码使用了 ref、useDark、useToggle，在script中都没有 import 语句，自动导入不安逸吗？一天天闲的没事非要写 import ?。

## 2. unplugin-vue-components 组件自动注册

实现了函数的自动导入，那导入组件的语句可以省略吗？如：在 `pages/demo.vue`，使用了咱前面封装的图标组件 Icon，

在 `<script>`中的第一行代码就是：

```
import Icon from '@/components/icon/icon.vue'
```

你现在可以删除这句话试一试，图标肯定无法加载，浏览器控制台也肯定出现：

```markdown
[Vue warn]: Failed to resolve component: icon
```

对于没有全局注册的组件，先导入再使用，这是理所当然的。但要导入的全局组件较多时，依次导入非常麻烦。

`unplugin-vue-components`插件正是为了解决这个问题而生，它可以实现组件的自动注册。

GitHub 地址：
https://github.com/unplugin/unplugin-vue-components

### 2.1 安装依赖

安装开发依赖：

```
pnpm add unplugin-vue-components -D
```

### 2.2 配置 vite 插件

在 `vite.config.ts`中配置该插件：

```javascript
// ...
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    // ...
    Components({
      deep: true,
      directoryAsNamespace: false,
    })
  ],
  // ...
})
```

该插件默认会自动注册 `src/components`目录及子目录下的组件。
关于该插件的更多配置项，自己去查看上面贴出来的 GitHub 地址吧，如 `directoryAsNamespace`、`collapseSamePrefixes`等配置项

### 2.3 类型声明文件

重启服务，仍然会自动生成组件的类型声明文件，默认名称为： `components.d.ts`，打开该文件，可以看到 Icon 组件的引入语句。

使用这些插件，并不是彻底不需要干某事，而是插件替咱干了某事！

将 `components.d.ts`文件添加到 `tsconfig.app.json`的 include 中：

```javascript
{
  // ...
  "include": [
    // ...
    "components.d.ts"
  ],
  // ...
}
```

现在回头看看 `pages/demo.vue`，是不是没有报错了？再刷新 demo 页面，图标是不是正常显示出来、浏览器控制台也不提示警告了？



## 3. 结语



为模板项目添加了强大的自动导入和组件注册功能：

**自动导入 unplugin-auto-import **

实现了 Vue、Vue Router、Pinia 和 VueUse 等核心库的自动导入，告别了繁琐的 import 语句

**组件自动注册（unplugin-vue-components）**

实现了组件的按需自动注册，只需在 components 目录下创建组件，便可在任何地方直接使用，无需手动导入

**VueUse 工具集**

通过自动导入机制，我们可以直接使用 VueUse 提供的丰富 hooks，大幅简化常见功能的实现

这些配置不仅提升了开发效率，咱不要将精力浪费在这些没有意义的工作上，既容易遗漏，也容易冲突























