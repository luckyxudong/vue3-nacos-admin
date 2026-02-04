# Vue3 优雅使用环境变量

环境变量，相信每个参与真实项目的同学都不陌生，使用它的目的，无外乎以下三点：
1）安全性：一些敏感信息不适合硬编码到代码中
2）灵活性：不同的环境（开发、测试、生产）常常要使用不同的配置
3）可维护性：将这些乱七八糟的配置集中管理，不用在各个角落里去找配置开关之类的

## 1. Vite 中的模式 mode

提到环境变量，就不得不从 **模式 mode**开始唠嗑，因为它决定了应用的构建和运行环境。

### 1.1 默认的两种模式

默认 vite 有两种模式，分别对应开发和构建：
**development**：开发模式
**production**：生产模式

咱可以通过 `import.meta.env.MODE`获取当前的模式。
在 main.ts 中测试下模式：

```
// 获取当前模式
const currentMode = import.meta.env.MODE
console.log('当前模式:', currentMode) // 输出: development, uat 或 production
```

1）如果执行 `pnpm dev`启动服务，则会输出：

```
当前模式: development
```

2）如果先执行 `pnpm build`打包，再执行 `pnpm preview`，输出：

```
当前模式: production
```

通常模式会用来标识环境，如模式为 development，则代表着开发环境。
但真实的企业级项目中，环境不止一套，除了开发环境、生产环境，可能还有

- • 概念验证环境 poc
- • 集成测试环境 sit
- • 用户接受测试环境 uat
- • ...
  因此，咱需要自定义模式（即自定义环境）。

### 1.2 自定义模式

自定义模式可以通过在 vite 命令后面添加参数 `--mode`来指定。
修改 package.json 中的 scripts，咱将 `dev`和 `build`进行扩展，支持三套环境：

```
{
  // ...
  "scripts": {
    "dev:dev": "vite --mode dev",
    "dev:uat": "vite --mode uat",
    "dev:prod": "vite --mode prod",
    "build:dev": "run-p type-check \"build-only {@} --mode dev\" --",
    "build:uat": "run-p type-check \"build-only {@} --mode uat\" --",
    "build:prod": "run-p type-check \"build-only {@} --mode prod\" --",
    // ...
  },
  // ...
}
```

上面的命令分别指定了三个模式，对应三套环境：
1）dev：模式为开发，开发环境
2）uat：模式为uat，uat 环境
3）prod：模式为生产，生产环境

通常情况下，几乎不允许本地启动 vite 服务连接生产环境，因此 `dev:prod`命令可以删除。

## 2. 环境变量

简单唠嗑完模式，接下来便是环境变量。Vite 会自动加载项目根目录下的 `.env`文件及有关变体。

Vite 会自动设置 `NODE_ENV`，这个环境变量无需像 cli 那样需要在 .env 中手动设置，Vite 会根据 mode 参数进行设置；
Vite 支持自定义的环境变量，自定义环境变量必须以 `VITE_`前缀开头，否则不会被暴露到浏览器端； 所有环境变量的值都是字符串类型。

`.env`文件的变体有三种：

- .env.local
- .env.[mode]
- .env.[mode].local

带有 `.local`的环境变量文件，是你自己特有的值，一定要添加到 .gitignore 中（默认 git 忽略文件已经包括 *.local）！

### 2.1 优先级

同一个环境变量在四种文件中都存在，优先级是怎样的呢？
咱们可以按照如下步骤进行测试：

1）在根目录下创建 `.env`文件，定义变量：

```
VITE_APP_NAME=demo_default
```

在 `index.vue`中访问该变量：

```vue
<!--
 @name: index.vue
 @description:
 @author: 程序员优雅哥 youyacoder
 @time: 2026/1/13 22:51
-->
<template>
  <div>{{ appName }}</div>
</template>

<script setup lang="ts">
const appName = import.meta.env?.VITE_APP_NAME ?? ''
</script>
```

`pnpm dev:dev`运行项目，访问 index.vue
这时候界面上显示：demo_default

2）根目录下继续创建 `.env.local`：

```
VITE_APP_NAME=demo_local
```

界面上显示：demo_local

3）根目录下继续创建 `.env.dev`：

```
VITE_APP_NAME=demo_dev
```

界面上显示：demo_dev

4）根目录下继续创建 `.env.dev.local`：

```
VITE_APP_NAME=demo_dev_local
```

界面上显示：demo_dev_local。

从而可以看出优先级依次为：
1）.env.[mode].local
2）.env.[mode]
3）.env.local
4）.env

### 2.2 TypeScript 类型定义

现在咱们使用 `import.meta.env`来获取环境变量，IDE不会自动提示咱自定义的 VITE_XXX 变量，没代码提示。
在根目录 `env.d.ts`文件中添加如下类型声明：

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

这个时候就有提示了。

### 2.3 简单封装工具类

咱可以创建一个环境变量读取的工具类，简化代码中读取环境的代码。 创建文件：
`src/utils/env.ts`：

```typescript
export class Env {
  /**
   * 获取环境变量
   * @param key 环境变量名
   * @param defaultValue 默认值
   */
  static get<T>(key: keyof ImportMetaEnv, defaultValue?: T): T | string {
    const value = import.meta.env[key]
    return value ?? (defaultValue as T)
  }

  /**
   * 获取数字类型的环境变量
   */
  static getNumber(key: keyof ImportMetaEnv, defaultValue?: number): number {
    const value = import.meta.env[key]
    if (value === undefined) {
      return defaultValue as number
    }
    return Number(value)
  }

  /**
   * 获取布尔类型的环境变量
   */
  static getBoolean(key: keyof ImportMetaEnv, defaultValue?: boolean): boolean {
    const value = import.meta.env[key]
    if (value === undefined) {
      return defaultValue as boolean
    }
    return value === 'true' || value === '1'
  }

  /** 获取当前环境 */
  static get env(): 'dev' | 'uat' | 'prod' {
    return this.get('VITE_ENV', 'dev') as 'dev' | 'uat' | 'prod'
  }

  /** 是否为开发环境 */
  static get isDev(): boolean {
    return this.env === 'dev'
  }

  /** 是否为UAT环境 */
  static get isUat(): boolean {
    return this.env === 'uat'
  }

  /** 是否为生产环境 */
  static get isProd(): boolean {
    return this.env === 'prod'
  }
}
```

在 `.env`分别添加 number 和 boolean 类型的环境变量进行测试：

```
VITE_NUMBER_DEMO=3000
VITE_BOOLEAN_DEMO=true
```

根目录下的 `env.d.ts`也同步更新环境变量类型定义：

```typescript
// ...
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_NUMBER_DEMO: number
  readonly VITE_BOOLEAN_DEMO: boolean
}
// ...
```

在 main.ts 中测试：

```shell
console.log('VITE_APP_NAME: ', Env.get('VITE_APP_NAME'))
console.log('VITE_NUMBER_DEMO: ', Env.getNumber('VITE_NUMBER_DEMO'))
console.log('VITE_BOOLEAN_DEMO: ', Env.getBoolean('VITE_BOOLEAN_DEMO'))
console.log('isDev', Env.isDev)
console.log('isUat', Env.isUat)
console.log('isProd', Env.isProd)
```

### 2.4 vite.config.ts 中获取环境变量

在 vite.config.ts 中通常都需要读取环境变量，如根据不同的环境或环境变量，加载不同的插件。
但在该文件中不能使用 import.meta.env 获取环境变量，这是因为：
1）vite.config.ts 是在 Node.js 环境中运行的，默认使用 CommonJS 模块规范；import.meta.nev 是 ES 模块的内置变量，运行在浏览器环境。
2）vite.config.ts 是在 Vite启动的早期阶段执行，此时 Vite 还没有完全加载和处理环境变量；
而 import.meta.env 是 Vite 在构建过程中注入到最终代码中的，只能在构建后的代码中可以使用。
两者的执行时机不同，简单来说：当 vite.config.ts 执行时， import.meta.env 还不存在，因为 Vite 还没开始处理它。

如果要在 vite.config.ts 中访问环境变量，需要使用 loadEnv 函数。该函数会根据当前模式（mode）手动加载对应的 .env 文件，返回解析后的环境变量对象。
修改 vite.config.ts 文件：

```typescript
import { defineConfig, loadEnv } from 'vite'
// ...
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  console.log(env)
  return {
    // ... 原有的配置内容
  }
})
```

`loadEnv`函数的第三个参数是环境变量前缀，默认为 `VITE_`。如果设置为空字符串，则会加载所有环境变量。

## 3. 结语

本文简单介绍了 Vue/Vite 中的模式与环境变量，咱为通用模板添加了一套简单优雅的环境变量管理方案：
1）支持 dev、uat、prod 三套环境的配置；
2）env.d.ts 中添加了环境变量类型声明；
3）封装 `Env`工具类访问环境变量；
4）vite.config.ts 支持访问环境变量。





































