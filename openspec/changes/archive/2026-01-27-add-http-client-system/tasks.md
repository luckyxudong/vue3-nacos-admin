## 1. 依赖安装
- [x] 1.1 安装 `axios` 依赖
- [x] 1.2 安装 `mockjs`、`@types/mockjs`、`vite-plugin-mock` 开发依赖

## 2. HTTP 核心封装层
- [x] 2.1 创建 `src/http/core/types.ts`，定义通用类型
  - [x] 2.1.1 定义 `ApiResp<T>`、`PageReq`、`PageData<T>` 类型
  - [x] 2.1.2 定义 `HttpClientConfig` 配置接口（baseURL、timeout、headers、interceptor、enableCancel）
  - [x] 2.1.3 定义 `InterceptorConfig` 拦截器配置接口
- [x] 2.2 创建 `src/http/core/http-client.ts`，实现 HTTP 客户端基础类
  - [x] 2.2.1 实现 `HttpClient` 类，封装 Axios 实例创建
  - [x] 2.2.2 实现 GET、POST、PUT、DELETE、PATCH 请求方法
  - [x] 2.2.3 集成 `PluginManager` 和 `Interceptors`
  - [x] 2.2.4 实现 `cancelAll()` 方法取消所有请求
  - [x] 2.2.5 实现 `getInstance()` 方法获取 Axios 实例
- [x] 2.3 创建 `src/http/core/interceptors.ts`，实现请求和响应拦截器
  - [x] 2.3.1 实现默认请求拦截器成功处理函数（请求日志）
  - [x] 2.3.2 实现默认请求拦截器失败处理函数
  - [x] 2.3.3 实现默认响应拦截器成功处理函数（响应日志、API 响应解析）
  - [x] 2.3.4 实现默认响应拦截器失败处理函数（错误处理）
  - [x] 2.3.5 实现 `Interceptors` 类，管理拦截器配置和应用
- [x] 2.4 创建插件化架构
  - [x] 2.4.1 创建 `src/http/core/plugin.ts`，定义 `HttpPlugin` 接口
  - [x] 2.4.2 创建 `src/http/core/plugin-manager.ts`，实现 `PluginManager` 类
- [x] 2.5 实现请求取消插件
  - [x] 2.5.1 创建 `src/http/core/request-canceler.ts`，实现 `RequestCanceler` 类
  - [x] 2.5.2 实现请求唯一标识生成逻辑
  - [x] 2.5.3 实现请求添加、移除、取消所有请求的方法
  - [x] 2.5.4 在请求和响应拦截器中集成请求取消逻辑
- [x] 2.6 创建 `src/http/core/index.ts`，导出所有核心模块

## 3. HTTP 项目配置层
- [x] 3.1 创建 `src/http/index.ts`，组装核心模块并导出项目特定的 Axios 实例
- [x] 3.2 实现项目特定的请求拦截器（如添加 token、设置请求头）
- [x] 3.3 实现项目特定的响应拦截器（如统一错误处理、数据转换）

## 4. Service 层
- [x] 4.1 创建 `src/services/base-service.ts`，实现通用 CRUD 基类
  - [x] 4.1.1 定义抽象类 `BaseService<T, Q extends PageReq>`
  - [x] 4.1.2 实现抽象方法 `getPrefix()` 获取资源名
  - [x] 4.1.3 实现 `getList()` 分页查询列表方法
  - [x] 4.1.4 实现 `getDetail()` 获取详情方法
  - [x] 4.1.5 实现 `create()` 创建方法
  - [x] 4.1.6 实现 `update()` 更新方法
  - [x] 4.1.7 实现 `delete()` 删除方法
- [x] 4.2 创建示例 Service（如 `src/services/demo-service.ts`），演示如何使用
  - [x] 4.2.1 定义 `Demo` 接口和 `DemoListReq` 接口
  - [x] 4.2.2 实现 `DemoService` 类继承 `BaseService`
  - [x] 4.2.3 导出 `demoService` 实例

## 5. Mock 服务
- [x] 5.1 创建 `mock/` 目录（项目根目录）
- [x] 5.2 创建 `mock/demo.ts`，实现示例 Mock 接口（CRUD）
- [x] 5.3 在 `vite.config.ts` 中配置 `vite-plugin-mock` 插件

## 6. 验证
- [x] 6.1 验证 Mock 服务是否正常工作（访问 `http://localhost:5173/api/demo`）
- [x] 6.2 验证 HTTP 请求封装是否正常工作（在组件中调用 Service）
  - [x] 6.2.1 创建测试页面（如 `src/pages/http-demo.vue`）
  - [x] 6.2.2 测试列表查询、详情查询、创建、更新、删除功能
  - [x] 6.2.3 测试请求取消功能（`api.cancelAll()`）
- [x] 6.3 验证拦截器功能
  - [x] 6.3.1 验证请求拦截器（请求日志、自定义请求头）
  - [x] 6.3.2 验证响应拦截器（响应日志、API 响应解析）
- [x] 6.4 运行 `pnpm lint` 确保代码质量
- [x] 6.5 运行类型检查确保类型安全
