# Vue3 网络请求的优雅封装之一：优雅的架构设计及 Mock 服务

- 封装架构设计
- 搭建 Mock 服务

## 1. Axios vs Alova

无论是使用 Vue 还是 React，应该没有没使用过 Axios 的兄弟！这里提一下 Alova 主要是想装X，怕有伙伴说我不知道 Alova~。

Alova 功能非常非常强大，提供了很多高级功能，状态管理、缓存等方面都非常有优势。它的很多思想非常优秀，如适配器，非常推荐大家有空研究一下。

但实话实说，优雅哥只在私底下玩过，没有在项目上使用过，因此还是传统的继续 Axios。

## 2. 准备工作

咱具体实现之前，咱们先准备目录结构，基于这个目录结构，才能更好的介绍实现思路是怎样的。

### 2.1 创建目录文件

本文的目录结构从项目根路径开始（注意：不是 src 目录）

```
wumeng-vue3-app-template/
|- mock/
    |- demo.ts
|- src/
    |- http/
        |- core/
            |- http-client.ts
            |- interceptors.ts
            |- index.ts
            |- types.ts
        |- index.ts
    |- services/
        |- base-service.ts
```

### 2.2 设计思路

从宏观上来看，整个设计包括四个部分：

1）**Mock 服务**：项目根目录下的 `mock`目录（与 src 目录平级），用来提供 mock 服务，模拟后端接口；（你也可以采用其他方式提供后端服务，如 Java SpringBoot、NestJS、KOA 等）

2）**请求核心封装**：`src/http/core/`目录，
该目录对 Axios 进行强大的封装，包括拦截器、取消请求、请求去重、重试等，每个功能都是一个独立的类，
最后在 `core`中的 `index.ts`导出所有内容。
这个目录下的内容与具体项目无关，原则上要提取成一个独立的 lib 在不同的项目中复用。后面的微前端会做移植。

3）**项目配置层**：`src/http/index.ts`，通过配置和组装 `core`中的多个类，最后导出具体的 Axios 实例对象和 CRUD 函数，service 层调通过它来调用后端接口。
不同的项目实现会有差异，如针对请求拦截器的处理、请求错误的处理、超时时长、请求基础路径等

4）**service 层**：该目录就是传统写法中的 `api`目录，调用具体的接口。这一层与业务相关，咱们提取了一个 base-service.ts 实现通用的 CRUD，不同的模块可以继承它。

除了 Mock 服务，其他几个部分的关系如下图：

```
+---------------------+
| service层 (API 定义) |
+---------------------+
          ↑
          | 调用
+---------------------+
| 项目配置层 (自定义)    |
+---------------------+
          ↑
          | 实例化
+---------------------+
| 请求核心封装 (通用功能) |
+---------------------+
          ↑
          | 依赖
+---------------------+
|  Axios 原生库        |
+---------------------+
```

各位伙伴一定要仔细消化上面的内容，否则后面几篇文章看起来会云里雾里的。

### 2.3 通用类型定义

与后端交互，通常后端会定义一个通用的响应结构，首先创建一个类型文件，定义三个类型：

1）通用响应结构，貌似大多数项目都是定义三个字段 code、data、message；
2）分页请求结构：一般包括页码和每页大小；
3）分页响应数据结构：针对通用响应结构中的 data 的类型，至少包含数据列表 list 和总记录数 total 两个字段。

`src/http/core/types.ts`：

```typescript
/**
 * 通用响应结构
 */
export interface ApiResp<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 分页请求结构
 */
export interface PageReq {
  pageNum: number
  pageSize: number
}

/**
 * 分页响应数据结构
 */
export interface PageData<T> {
  list: T[]
  total: number
}
```

在 `src/http/core/index.ts`导出全部类型：

```
export * from './types'
```

> 关于通用响应结构的设计，是比较存在争议的：
> 一种观点是无论请求成功与否，都返回 code、data、message 这种标准结构，这种方式将请求错误与业务错误分开，前端解析时，需要先判断 HTTP 响应状态码，再判断 code 业务状态码；
> 另一种观点是请求成功就只返回业务数据，业务失败时才返回上面的通用结构。这种方式将请求错误与业务错误合并处理。前端解析时，HTTP 响应状态码为 200 便视为业务成功。
> 优雅哥更倾向于第二种，但几年实践下来，大部分同事都习惯了前者，优雅哥便也一起思维定势吧。优雅哥很期待听到你们对这两种设计方案的理解！

## 3. 使用 MockJS 搭建 Mock 服务

由于咱没有开发服务端，咱先使用 MockJS 模拟服务端响应，便于后续的测试。

### 3.1 安装依赖

```
pnpm add mockjs @types/mockjs vite-plugin-mock -D
```

### 3.2 配置 Vite 插件

在 `vite.config.ts`中配置 Mock 插件：

```typescript
// ,,,
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    // ...
    viteMockServe({
      mockPath: './mock', // Mock 文件目录
      enable: true,
    }),
  ],
  // ...
})
```

### 3.3 创建 Mock 文件

在 `mock`目录下创建 `demo.ts`：

```
import Mock from 'mockjs'
import { ApiResp } from '../src/http/core'
import { MockMethod } from 'vite-plugin-mock'

const demoList = Mock.mock({
  'list|100': [
    {
      'id|+1': 1,
      title: '@ctitle(5, 10)',
      content: '@cparagraph(1, 3)',
      author: '@name',
      status: '@boolean',
      createdAt: '@datetime',
      updatedAt: '@datetime',
    },
  ],
}).list

function success<T>(data: T): ApiResp<T> {
  return {
    code: 0,
    message: 'success',
    data,
  }
}

function error(message: string, code: number = 500): ApiResp<null> {
  return {
    code,
    message,
    data: null,
  }
}

const demoMock: MockMethod[] = [
  {
    url: '/api/demo',
    method: 'get',
    timeout: 1000,
    response: ({ query }) => {
      const pageNum = parseInt(query.pageNum) || 1
      const pageSize = parseInt(query.pageSize) || 10
      const keyword = query.keyword || ''

      let filteredList = demoList
      if (keyword) {
        filteredList = demoList.filter(
          (item) =>
              item.title.includes(keyword) ||
              item.content.includes(keyword) ||
              item.author.includes(keyword),
        )
      }

      const start = (pageNum - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      return success({ list, total: filteredList.length })
    },
  },
  {
    url: '/api/demo/:id',
    method: 'get',
    timeout: 3000,
    response: ({ query }) => {
      const item = demoList.find((item) => item.id === parseInt(query.id))
      if (item) {
        return success(item)
      } else {
        return error('Item not found')
      }
    },
  },
  {
    url: '/api/demo',
    method: 'post',
    response: ({ body }) => {
      const newItem = {
        id: demoList.length + 1,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      demoList.push(newItem)
      return success(newItem)
    },
  },
  {
    url: '/api/demo/:id',
    method: 'put',
    response: ({ query, body }) => {
      const index = demoList.findIndex((item) => item.id === parseInt(query.id))
      if (index !== -1) {
        demoList[index] = {
          ...demoList[index],
          ...body,
          updatedAt: new Date().toISOString(),
        }
        return success(demoList[index])
      } else {
        return error('Item not found')
      }
    },
  },
  {
    url: '/api/demo/:id',
    method: 'delete',
    response: ({ query }) => {
      const index = demoList.findIndex((item) => item.id === parseInt(query.id))
      if (index !== -1) {
        demoList.splice(index, 1)
        return success(null)
      } else {
        return error('Item not found')
      }
    },
  },
]

export default demoMock
```

这样便搭建好了一个 CRUD 的 Mock 服务。启动项目，在浏览器中访问接口：

http://localhost:5173/api/demo

如果看到分页列表数据 JSON，则 mock 服务便成功了。

## 4. 结语

本文主要介绍了对网络封装的整体设计，并搭建了一个 CRUD 的 demo Mock 接口。



































