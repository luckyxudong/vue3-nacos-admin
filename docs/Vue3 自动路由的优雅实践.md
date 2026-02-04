# Vue3 自动路由的优雅实践

基于文件的路径自动生成路由，从而省略手动配置的过程

## 1. 路由的优雅使用方式 unplugin-vue-router

`unplugin-vue-router`是一个基于文件系统的自动路由解决方案。支持 TypeScript 类型系统。

### 1.1 安装依赖

```
pnpm add unplugin-vue-router -D
```

### 1.2 配置 vite 插件

在配置文件 `vite.config.ts`中引入该插件：

```javascript
// ...
import VueRouter from 'unplugin-vue-router/vite'

export default defineConfig({
  plugins: [
    VueRouter({}),
    // ⚠️ Vue must be placed after VueRouter()
    vue(),
    // ...
  ],
  // ...
})
```

特别注意
在 plugins 中，`VueRouter({})`必须放在 `vue()`前面。

### 1.3 修改路由文件

修改路由配置 `router/index.ts`：

1）从 `vue-router/auto-routes`中导入 `routes`（这个 routes 是插件根据文件系统自动生成的）；

2）删除创建路由实例 `createRouter`中前面手动配置的 `routes`数组，使用上面导入的 `routes`。

```javascript
// ...
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ...
```

### 1.4 添加类型定义

启动服务，默认会在项目根目录下自动生成`typed-router.d.ts`文件。

为避免 ESLint 报错，将该类型声明文件添加到 `tsconfig.app.json`中：

```javascript
{
    // ...
  "include": [
    //...
    "typed-router.d.ts"
  ],
  // ...
}
```

此外，还需要在 `env.d.ts`末行添加如下类型引用代码：

```
/// <reference types="unplugin-vue-router/client" />
```

### 1.5 添加页面进行测试

`unplugin-vue-router`默认会解析 `src/pages`目录，将该目录中的 Vue 文件解析到路由中。

页面目录可以在 vite.config.ts 配置插件时指定

在 src 中创建目录 `pages`。并在 `src/pages/`目录中创建 `index.vue`和 `demo.vue`。

```
src/
 |- pages/
      |- index.vue
      |- demo.vue
```

src/pages/index.vue：

```vue
<template>
  <h1>index page</h1>
</template>
```

src/pages/demo.vue：

可以将原来的 views/demo.vue 复制过来。

启动服务，在浏览器中分别访问：

http://localhost:5173

http://localhost:5173/demo

两个页面能正常访问，便说明自动路由配置成功。

通过使用自动路由插件，咱在开发中可更加专注于业务逻辑，而不用因各种路由配置分散精力，在多个文件中来回切换。

## 2. vite-plugin-vue-layouts 实现全局布局

它非常适用于多个页面具有相同的布局的场景。

Github 地址：

https://github.com/JohnCampionJr/vite-plugin-vue-layouts

### 2.1 安装依赖

安装开发依赖：

```
pnpm add vite-plugin-vue-layouts -D
```

### 2.2 配置 vite 插件

在 `vite.config.ts`中配置该插件：

```
// ...
import Layouts from 'vite-plugin-vue-layouts'

export default defineConfig({
  plugins: [
    // ...
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default',
    }),
    // ...
  ],
  // ...
})
```

`layoutDirs`：
存放布局 vue 文件的目录。

`defaultLayout`：
默认使用的布局文件名。
上面配置 `default`，则默认使用
`src/layouts/default.vue`
作为默认布局文件。
在该文件中提要提供 router-view。

### 2.3 添加类型声明

按照上面的配置创建默认布局文件
`src/layouts/default.vue`：

### 2.4 创建默认布局文件

```vue
<template>
  <div>
    <header>
      <router-link to="/" class="item">home</router-link>
      <router-link to="/demo" class="item">demo</router-link>
    </header>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.item {
  @apply line-height-loose mr-3 text-gray-400 mb-5;
}
</style>
```

上面的默认布局非常简单，仅包含首页 & demo页面的导航链接、路由插座 router-view。

### 2.5 修改路由配置

修改 `router/index.ts`，由于使用了全局布局插件，本质上是在访问的路径外面又包裹了一层组件，需要修改 `unplugin-vue-router`自动生成的路由数组 routes 。

```javascript
// ...
import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes
  routes: setupLayouts(routes),
})

// ...
```

启动服务，无论访问首页（/）还是demo（/demo），都会看到默认布局中的导航链接。

### 2.6 多个布局

如果某个页面要使用其他布局，只需要按照以下两步进行：

1）在 layouts 目录中定义布局文件，如：blank.vue，该文件中一定要有路由插座 
2）在需要使用该布局的 Vue 文件中，通过 `definePage`来指定 `layout`：

```javascript
definePage({
  meta: {
    layout: 'blank',
  },
})
```

## 3. 结语

为模板项目添加了完整的路由和布局解决方案：

**unplugin-vue-router**：

实现了基于文件系统的自动路由，无需手动配置路由，一次透彻学习，告别傻X式的勤奋！

**vite-plugin-vue-layouts**：

提供了灵活的全局布局管理，支持多个布局文件和页面级布局指定

**类型安全**

通过自动生成的类型定义，确保了路由使用的类型安全性

集成这些插件只有一个目的：在开发过程中可以更专注于业务逻辑，不要花费时间在繁琐的没有意义的乱七八糟的配置上。

新增页面时，只需要在 `pages`目录下创建文件即可自动生成对应的路由；需要修改布局时，只需要编辑对应的布局文件。



























