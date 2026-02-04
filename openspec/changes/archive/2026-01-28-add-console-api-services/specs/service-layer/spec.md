## MODIFIED Requirements

### Requirement: Service 层基础结构
系统 SHALL 提供 Service 层（`src/services/`），用于调用具体的业务接口。

#### Scenario: Service 层目录结构
- **WHEN** 初始化 Service 层
- **THEN** 必须创建 `src/services/` 目录
- **AND** 必须创建 `src/services/base-service.ts` 文件，实现通用的 CRUD 基类
- **AND** 可以按业务模块创建子目录（如 `configuration/`、`service/`、`auth/`、`namespace/`、`cluster/`、`system/`）

#### Scenario: BaseService 抽象类定义
- **WHEN** 查看 `src/services/base-service.ts`
- **THEN** 必须定义抽象类 `BaseService<T, Q extends PageReq>`
- **AND** `T` 表示业务实体类型
- **AND** `Q` 表示列表查询参数类型，必须继承 `PageReq`

#### Scenario: BaseService 抽象方法
- **WHEN** 查看 `BaseService` 类
- **THEN** 必须定义抽象方法 `protected abstract getPrefix(): string`
- **AND** 该方法返回资源名称（如 `'demo'`、`'user'`），用于构建 RESTful API 路径

#### Scenario: BaseService CRUD 方法
- **WHEN** 查看 `BaseService` 类
- **THEN** 必须提供以下 CRUD 方法：
  - `getList(params: Q): Promise<PageData<T>>` - 分页查询列表，路径为 `/${prefix}`，使用 GET 方法
  - `getDetail(id: number): Promise<T>` - 获取详情，路径为 `/${prefix}/${id}`，使用 GET 方法
  - `create(data: Partial<T>): Promise<T>` - 创建，路径为 `/${prefix}`，使用 POST 方法
  - `update(id: number, data: Partial<T>): Promise<T>` - 更新，路径为 `/${prefix}/${id}`，使用 PUT 方法
  - `delete(id: number): Promise<any>` - 删除，路径为 `/${prefix}/${id}`，使用 DELETE 方法

#### Scenario: BaseService 调用 HTTP 配置层
- **WHEN** 查看 `BaseService` 类实现
- **THEN** 必须通过 `src/http/index.ts` 导出的 `HttpClient` 实例（如 `api`）来调用接口
- **AND** 必须使用 `api.get()`、`api.post()`、`api.put()`、`api.delete()` 等方法
- **AND** Service 层与业务相关，不应直接调用 Axios

#### Scenario: 业务 Service 实现
- **WHEN** 创建业务 Service（如 `DemoService`）
- **THEN** 必须继承 `BaseService<T, Q>` 抽象类（如果适用）
- **AND** 必须实现 `getPrefix()` 方法返回资源名称（如果继承 `BaseService`）
- **AND** 可以定义额外的业务特定方法（如启用、停用、下单等）
- **AND** 对于不符合 RESTful 规范的接口，可以直接实现，不强制继承 `BaseService`
- **AND** 通常导出 Service 类的单例实例供业务层使用

## ADDED Requirements

### Requirement: Service 层支持多种请求格式
系统 SHALL 支持表单格式请求、文件上传和 JSON Body 等多种请求格式。

#### Scenario: 表单格式请求支持
- **WHEN** Service 方法需要发送表单格式请求（`application/x-www-form-urlencoded`）
- **THEN** 必须通过 `api.post()`、`api.put()` 等方法传递 `config` 参数
- **AND** 必须在 `config.headers` 中设置 `Content-Type: application/x-www-form-urlencoded`
- **AND** 必须使用 `URLSearchParams` 或类似方式构建请求体
- **AND** 请求数据必须作为 `data` 参数传递

#### Scenario: 文件上传支持
- **WHEN** Service 方法需要上传文件
- **THEN** 必须使用 `FormData` 构建请求体
- **AND** 必须通过 `api.post()` 方法传递 `FormData` 作为 `data` 参数
- **AND** 必须在 `config.headers` 中设置 `Content-Type: multipart/form-data`（或让浏览器自动设置）

#### Scenario: JSON Body 请求支持
- **WHEN** Service 方法需要发送 JSON Body 请求
- **THEN** 必须通过 `api.post()`、`api.put()` 等方法传递 JSON 对象作为 `data` 参数
- **AND** HTTP 客户端默认使用 JSON 格式，无需额外配置

#### Scenario: Query 参数请求支持
- **WHEN** Service 方法需要通过 Query 参数传递数据（如 DELETE 请求）
- **THEN** 必须通过 `api.get()`、`api.delete()` 等方法传递 `config.params` 参数
- **AND** Query 参数会自动序列化到 URL 中

### Requirement: Service 层类型定义
系统 SHALL 为所有 Service 接口提供完整的 TypeScript 类型定义。

#### Scenario: 请求参数类型定义
- **WHEN** 创建 Service 方法
- **THEN** 必须为每个接口定义请求参数类型（如 `ConfigListReq`、`ConfigDetailReq`）
- **AND** 请求参数类型必须包含所有必填和可选字段
- **AND** 分页请求参数必须包含 `pageNo` 和 `pageSize` 字段（与 API 文档一致）

#### Scenario: 响应数据类型定义
- **WHEN** 创建 Service 方法
- **THEN** 必须为每个接口定义响应数据类型（如 `Config`、`ConfigHistory`）
- **AND** 响应数据类型必须匹配 API 文档中的响应结构
- **AND** 分页响应必须使用 `PageData<T>` 类型或自定义分页类型（如 `{ pageItems: T[], totalCount: number, pageNumber: number }`）

#### Scenario: 类型导出
- **WHEN** 查看 Service 文件
- **THEN** 必须导出所有类型定义，供业务层使用
- **AND** 类型定义必须放在 Service 文件顶部或单独的类型定义区域

### Requirement: Service 层模块化组织
系统 SHALL 按业务模块组织 Service 文件，保持清晰的目录结构。

#### Scenario: 配置管理服务模块
- **WHEN** 查看 `src/services/configuration/` 目录
- **THEN** 必须包含 `config-service.ts` 文件
- **AND** 必须实现配置管理的所有接口（列表查询、详情、创建/更新、删除、批量删除、历史列表、历史详情、历史配置列表、回滚、监听查询、导出、导入、克隆）

#### Scenario: 服务管理服务模块
- **WHEN** 查看 `src/services/service/` 目录
- **THEN** 必须包含 `service-service.ts` 文件
- **AND** 必须实现服务管理的接口（服务列表查询、删除服务）

#### Scenario: 权限控制服务模块
- **WHEN** 查看 `src/services/auth/` 目录
- **THEN** 必须包含 `user-service.ts`、`role-service.ts`、`permission-service.ts` 文件
- **AND** 用户管理服务必须实现用户管理的接口（列表查询、创建、搜索、删除、重置密码）
- **AND** 角色管理服务必须实现角色管理的接口（列表查询、搜索、创建、删除）
- **AND** 权限管理服务必须实现权限管理的接口（列表查询、创建、删除）

#### Scenario: 命名空间管理服务模块
- **WHEN** 查看 `src/services/namespace/` 目录
- **THEN** 必须包含 `namespace-service.ts` 文件
- **AND** 必须实现命名空间管理的接口（列表查询、详情、删除、创建、编辑）

#### Scenario: 集群管理服务模块
- **WHEN** 查看 `src/services/cluster/` 目录
- **THEN** 必须包含 `cluster-service.ts` 文件
- **AND** 必须实现集群管理的接口（节点列表查询、节点下线）

#### Scenario: 系统状态服务模块
- **WHEN** 查看 `src/services/system/` 目录
- **THEN** 必须包含 `system-service.ts` 文件
- **AND** 必须实现系统状态的接口（系统状态查询、系统引导信息、系统公告）
