## ADDED Requirements

### Requirement: Service 层基础结构
系统 SHALL 提供 Service 层（`src/services/`），用于调用具体的业务接口。

#### Scenario: Service 层目录结构
- **WHEN** 初始化 Service 层
- **THEN** 必须创建 `src/services/` 目录
- **AND** 必须创建 `src/services/base-service.ts` 文件，实现通用的 CRUD 基类

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
- **THEN** 必须继承 `BaseService<T, Q>` 抽象类
- **AND** 必须实现 `getPrefix()` 方法返回资源名称
- **AND** 可以定义额外的业务特定方法（如启用、停用、下单等）
- **AND** 通常导出 Service 类的单例实例供业务层使用
