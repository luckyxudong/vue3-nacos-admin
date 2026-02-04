# Vue3 网络请求的优雅封装之二：封装核心层Axios和拦截器

Vue3 通用模板的网络请求封装。前面完成了架构设计和 Mock 服务的优雅搭建，本文进行 Axios 的面向对象封装。

• Axios 和 拦截器封装 

针对 Axios 二次封装为网络请求的核心层的过程，咱们采用渐进方式进行，本文进行最基础的封装。

## 1. 核心层 - 初步封装 Axios

### 1.1 安装依赖

首先安装 Axios：

```
pnpm add axios
```

### 1.2 定义配置类型

在 `src/http/core/types.ts`中追加配置类型的定义：

```
// ...

/**
 * HTTP请求客户端配置
 */
export interface HttpClientConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
    
  // 后面还要扩展其他配置项
}
```

目前只定义三个属性：请求基础路径、超时时间、公共请求头。后面还会进一步扩展配置属性。

### 1.3 初步封装 Axios

在 `src/http/core/http-client.ts`中对 Axios 进行初步封装：

创建 Axios 的实例，并封装基础的请求方法。先上代码：

```typescript
import { Env } from '@/utils/env.ts'
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { HttpClientConfig } from './types.ts'

// HTTP请求客户端的默认配置
const defaultConfig: HttpClientConfig = {
  baseURL: Env.get('VITE_API_BASE_URL', '/api'),
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
}

/**
 * HttpClient 基础 HTTP 客户端类
 * 负责创建 Axios 实例和封装基础请求方法
 */
export class HttpClient {
  protected instance: AxiosInstance
  protected config: HttpClientConfig

  /**
   * 构造函数
   * @param config 配置选项
   */
  constructor(config: HttpClientConfig = {}) {
    this.config = { ...defaultConfig, ...config }
    this.instance = this.createInstance()
  }
  
  /**
   * 创建 Axios 实例
   * @returns AxiosInstance
   */
  private createInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
  }

  /**
   * 封装 GET 请求
   * @param url 请求地址
   * @param config 请求配置
   */
  public get(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.get(url, config)
  }

  /**
   * 封装 POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  public post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.post(url, data, config)
  }

  /**
   * 封装 PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  public put(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.put(url, data, config)
  }

  /**
   * 封装 DELETE 请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Promise<T>
   */
  public delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.delete(url, config)
  }

  /**
   * 封装 PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  public patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.instance.patch(url, data, config)
  }

  /**
   * 获取 Axios 实例
   * @returns AxiosInstance
   */
  public getInstance(): AxiosInstance {
    return this.instance
  }
}
```

上面的封装非常简单：

1）通过构造函数传递自定义配置，并将自定义配置与默认配置进行合并；
2）createInstance 方法创建 Axios 实例对象；
3）提供增删改查几个方法；
4）提供获取构造函数中创建 Axios 实例的方法；

## 2. 核心层 - Interceptors

拦截器包括请求拦截器 request 和响应拦截器 response，而两个拦截器又分别包括成功处理函数 onFulfilled 和失败处理函数 onRejected。
咱们要提供默认拦截器的这四个函数的实现，同时也要支持不同的项目能自定义拦截器。

### 2.1 类型定义

继续在 `src/http/core/types.ts`追加**拦截器配置项 InterceptorConfig**的定义，并在 **HttpClientConfig**中添加 interceptor 配置属性项：

```typescript
// ...

/**
 * 拦截器配置
 */
export interface InterceptorConfig {
  request?: {
    onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>
    onRejected?: (error: AxiosError) => any
  }
  response?: {
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
    onRejected?: (error: AxiosError) => any
  }
}

/**
 * HTTP请求客户端配置
 */
export interface HttpClientConfig {
  // ...

  interceptor?: InterceptorConfig
}
```

### 2.2 实现 Interceptors 类

接下来便是在 `src/http/core/interceptors.ts`中实现拦截器的封装。总共包含两大个内容：

1）定义请求拦截器（成功&失败）、响应拦截器（成功&失败）四个函数的默认实现，并将其导出供外部自定义时方便调用：

```
import { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios'
import { Env } from '@/utils/env'
import type { InterceptorConfig } from './types.ts'

// 默认请求拦截器-成功处理函数
export const defaultRequestOnFulfilled = (config: AxiosRequestConfig) => {
  // 请求日志
  if (Env.isDev) {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data,
    })
  }
  return config
}

// 默认请求拦截器-失败处理函数
export const defaultRequestOnRejected = (error: AxiosError): any => {
  return Promise.reject(error)
}

// 默认响应拦截器-成功
export const defaultResponseOnFulfilled = (response: AxiosResponse): any => {
  // 响应日志
  if (Env.isDev) {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    })
  }

  // 解析 API 响应
  const { data } = response

  // 检查是否为标准 API 响应格式
  if (data && typeof data === 'object' && 'code' in data && 'message' in data) {
    const { code, message, data: responseData } = data

    // 业务成功时直接返回 data
    if (code === 0 || code === 200) {
      return responseData
    }
    // 业务失败时抛出错误
    else {
      throw new Error(message || '请求失败')
    }
  }

  // 非标准格式直接返回响应数据
  return data
}

// 默认响应拦截器-失败处理函数
export const defaultResponseOnRejected = (error: AxiosError): any => {
  // 错误处理
  if (error.response) {
    // 服务器返回错误状态码
    const status = error.response.status
    console.error('request error, status: ', status)
  } else if (error.request) {
    // 请求已发出，但没有收到响应
    console.error('Network Error')
  } else {
    // 请求配置错误
    console.error('Request Config Error:', error.message)
  }
  return Promise.reject(error)
}
```

上面四个函数的实现逻辑不复杂，需要说明的是：响应成功的处理函数
defaultResponseOnFulfilled：解析返回的结果，将 AxiosResponse 解析为通用结构中的 data 返回给业务层。
业务层在使用时无需：res.data.data 来获取真正的结果。

2）定义 Interceptors 类：

```
/**
 * 拦截器管理类
 * 负责配置和管理请求/响应拦截器
 */
export class Interceptors {
  private config: InterceptorConfig

  /**
   * @param config 拦截器配置
   */
  constructor(config: InterceptorConfig = {}) {
    this.config = config
  }

  /**
   * 应用拦截器到 Axios 实例
   * @param instance Axios 实例
   */
  public applyInterceptors(instance: AxiosInstance): void {
    // 应用请求拦截器
    instance.interceptors.request.use(
      (this.config.request?.onFulfilled ?? defaultRequestOnFulfilled) as any,
      this.config.request?.onRejected ?? defaultRequestOnRejected,
    )

    // 应用响应拦截器
    instance.interceptors.response.use(
      this.config.response?.onFulfilled || defaultResponseOnFulfilled,
      this.config.response?.onRejected || defaultResponseOnRejected,
    )
  }
}
```

该类在构造函数中接收拦截器配置，提供 applyInterceptors 给外部调用，通过该方法将拦截器应用到 Axios 实例对象上。

### 2.3 结合 HttpClient Interceptors

现在虽然定义了 HttpClient 类和 Interceptors 类，但两者是独立的，没结合在一起。
Interceptors 中提供了 applyInterceptors 方法，咱需要再 HttpClient 中创建 Axios 实例后，通过该方法设置拦截器。

修改前面实现的 `http-client.ts`，在里面加入 Interceptors：

```typescript
export class HttpClient {
  // ...
  private interceptors: Interceptors

  constructor(config: HttpClientConfig = {}, interceptorConfig: InterceptorConfig = {}) {
    this.config = { ...defaultConfig, ...config }
    // 实例化拦截器对象
    this.interceptors = new Interceptors(this.config.interceptor ?? {})
    this.requestCanceler = new RequestCanceler()
    this.instance = this.createInstance()
      
    // 设置拦截器
    this.setInterceptors()
  }

  private setInterceptors() {
    this.interceptors.applyInterceptors(this.instance)
  }
}
```

咱们定义了 setInterceptors 方法，目前里面只有一行代码，便是设置拦截器。但随着后面的强大封装，咱们还要继续添加其他拦截器，因此，只有一行代码，咱也提取成一个方法。

最后还需要在 `http/core/index.ts`中导出这两个文件的全部内容：

```
export * from './types'
export * from './http-client'
export * from './interceptors'
```

本文中的 Axios 核心层第一步封装就完成了，接下来需要实现项目配置层。

## 3. 项目配置层

项目配置层要做两件事：
1）**提供自定义配置**，（如自定义请求拦截器，在请求头中添加 token；自定义响应拦截器，使用UI展示错误信息等；自定义请求基础路径、超时时间等）
2）**创建并导出 HttpClient 实例对象**，以便 service 层使用。

`src/http/index.ts`：

```typescript
import { HttpClient } from '@/http/core/http-client.ts'
import type { AxiosRequestConfig } from 'axios'

// 自定义请求拦截处理函数
const customRequestOnFulfilled = (config: AxiosRequestConfig) => {
  const { headers = {} } = config
  headers.token = 'aaaaaa'
  return config
}

// 创建并导出 HttpClient 对象 api
export const api = new HttpClient({
  interceptor: {
    request: {
      onFulfilled: customRequestOnFulfilled,
    },
  },
})

// 导出 Axios 实例
export const instance = api.getInstance()
```

如果你无需自定义配置，创建 HttpClient 对象时可以不传递配置：

```
export const api = new HttpClient()
```

不同项目的差异化配置就在这个文件中实现。此外，该文件还导出了 Axios 的实例 instance。你可以拿着这个实例去做你想做的事，如文件上传下载等有个性化的东西。

## 4. 阶段测试

手搓了这么多代码，也该开始测试了，首先实现 service 层。

### 4.1 实现 service 层

这里说的 `service`，就是很多开源项目里面的 `api`。
在这些项目中，这个模块只负责封装接口调用，没有业务逻辑。从**模块单一职责**这个角度来看，叫 `api`会更适合。但通常里面都只有一行代码：
`axios.get({url: 'xxx', method: 'get''})`
那抽取这一层 api 的意义在哪儿呢？直接写在业务代码中不更省事吗？

千万别说**复用**，你掰着手指数一数，真正多次调用的地方有多少？再者，就算有复用的地方，那对响应解析的处理是不是重复操作呢？

如果包含了响应解析的处理或其他逻辑，那我更宁愿称这一层为 `service`- **服务层**，毕竟它包含了一些其他逻辑的处理，而不仅仅只是调用接口。

分层不在于形，更在于神！

依旧**仁者见仁、智者见智**，没有绝对的优劣，根据自己的习惯和团队的规范即可~ 咱继续回归正题

前文搭建了 Mock 服务，从路径上看，这是比较符合 RESTful 风格的接口。针对这些符合 RESTful 风格的接口，路径通常只有资源不同：
在这个案例中的资源是 `demo`， 换个资源可能是 `user`、`product`等，除了资源不同，其余路径都是一致的，所以我会提取一个抽象类：

```typescript
src/services/base-service.ts
import { api } from '@/http'
import type { PageData, PageReq } from '@/http/core/types.ts'

export abstract class BaseService<T, Q extends PageReq> {
  // 获取资源名，由子类实现
  protected abstract getPrefix(): string

  // 分页查询列表
  public getList(params: Q): Promise<PageData<T>> {
    return api.get(`/${this.getPrefix()}`, { params })
  }

  // 获取详情
  public getDetail(id: number): Promise<T> {
    return api.get(`/${this.getPrefix()}/${id}`)
  }

  // 创建
  public create(data: Partial<T>): Promise<T> {
    return api.post(`/${this.getPrefix()}`, data)
  }

  // 更新
  public update(id: number, data: Partial<T>): Promise<T> {
    return api.put(`/${this.getPrefix()}/${id}`, data)
  }

  // 删除
  public delete(id: number): any {
    return api.delete(`/${this.getPrefix()}/${id}`)
  }
}
```

在这个抽象类的基础上，再来实现业务的 CRUD 就简单了。
`src/services/demo-service.ts`：

```typescript
import { BaseService } from './base-service.ts'
import type { PageReq } from '@/http/core/types.ts'

export interface Demo {
  id: number
  title: string
  content: string
  author: string
  status: boolean
  createdAt: string
  updatedAt: string
}

// Demo 列表请求参数
export interface DemoListReq extends PageReq {
  keyword?: string
}

export class DemoService extends BaseService<Demo, DemoListReq> {
  protected getPrefix(): string {
    return 'demo'
  }
}

export const demoService = new DemoService()
```

如果有其他特殊请求，如启用、停用、下单等定制化的请求，那在 DemoService 类中定义即可。
连面向对象的特性都不用，还扯个毛线的设计模式、架构。一定要保持优雅！

### 4.2 编写页面进行测试

最后一步了，创建一个页面进行测试：
`src/pages/http-demo.vue`

```typescript
<template>
  <div>
    <h1>Demo 列表</h1>
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error.message }}</div>
    <div v-else>
      <ul>
        <li v-for="item in data" :key="item.id">
          <span
              class="text-xl font-bold text-primary cursor-pointer"
              @click="onTitleClick(item.id)"
          >{{ item.title }}</span>
          <button class="ml-2 text-danger cursor-pointer" @click="deleteItem(item.id)">删除</button>
        </li>
      </ul>
      <div>
        <button @click="fetchData({ pageNum: currentPage - 1 })" :disabled="currentPage === 1">上一页</button>
        <span>{{ currentPage }}/{{ totalPages }}</span>
        <button @click="fetchData({ pageNum: currentPage + 1 })" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Demo, type DemoListReq, demoService } from '@/services/demo-service.ts'

const loading = ref(false)
const error = ref<Error | null>(null)
const data = ref<Demo[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 获取数据
const fetchData = async (params?: Partial<DemoListReq>) => {
  loading.value = true
  error.value = null

  try {
    const response = await demoService.getList({
      pageNum: params?.pageNum || currentPage.value,
      pageSize: pageSize.value,
    })

    data.value = response.list
    total.value = response.total
    currentPage.value = params?.pageNum || currentPage.value
  } catch (err) {
    error.value = err as Error
  } finally {
    loading.value = false
  }
}

// 删除项目
const deleteItem = async (id: number) => {
  await demoService.delete(id)
  // 重新获取数据
  await fetchData()
}

const onTitleClick = async (id: number) => {
  const resp = await demoService.getDetail(id)
  console.log(resp)
}

// 组件挂载时获取数据
onMounted(() => {
  fetchData()
})
</script>
<style scoped lang="scss">
button {
  @apply cursor-pointer text-primary hover:text-primary-dark-2;
}
</style>
```

在界面上咱们调用了查询列表、删除、查询详情三个接口。新增和修改大家自己去玩玩。
测试过程就不讲了。大家可以自己捣腾一下默认配置、自定义拦截器等等。

## 5. 结语

本文篇幅较长，但就三个内容：
1）核心库第一步：封装Axios和拦截器
2）实现项目配置层
3）实现业务层和表现层

















