# mock-service Specification

## Purpose
TBD - created by archiving change add-http-client-system. Update Purpose after archive.
## Requirements
### Requirement: Mock 服务基础结构
系统 SHALL 提供 Mock 服务（项目根目录下的 `mock/` 目录），用于模拟后端接口响应。

#### Scenario: Mock 目录结构
- **WHEN** 初始化 Mock 服务
- **THEN** 必须创建 `mock/` 目录（与 `src` 目录平级）
- **AND** Mock 文件应放在 `mock/` 目录下（如 `mock/demo.ts`、`mock/auth.ts`）

#### Scenario: Mock 服务依赖
- **WHEN** 查看项目依赖
- **THEN** 必须安装 `mockjs`、`@types/mockjs`、`vite-plugin-mock` 开发依赖

#### Scenario: Vite Mock 插件配置
- **WHEN** 查看 `vite.config.ts`
- **THEN** 必须配置 `vite-plugin-mock` 插件
- **AND** 插件配置必须指定 `mockPath: './mock'`
- **AND** 插件配置必须设置 `enable: true`（开发环境）

#### Scenario: Mock 文件格式
- **WHEN** 查看 Mock 文件（如 `mock/demo.ts`、`mock/auth.ts`）
- **THEN** 必须使用 `MockMethod[]` 类型定义 Mock 接口
- **AND** Mock 接口必须包含 `url`、`method`、`response` 字段
- **AND** Mock 响应必须符合 `ApiResp<T>` 结构

#### Scenario: Mock 服务功能验证
- **WHEN** 启动开发服务器并访问 Mock 接口（如 `http://localhost:5173/api/demo`、`http://localhost:5173/api/auth/login`）
- **THEN** 必须返回符合 `ApiResp<T>` 结构的 JSON 数据
- **AND** Mock 数据应使用 MockJS 生成

#### Scenario: Mock 服务 CRUD 支持
- **WHEN** 查看示例 Mock 文件（如 `mock/demo.ts`）
- **THEN** 必须支持 GET（列表查询、详情查询）、POST（创建）、PUT（更新）、DELETE（删除）等 CRUD 操作
- **AND** GET 列表查询必须支持分页参数（`pageNum`, `pageSize`）和关键词搜索（`keyword`）

#### Scenario: 登录 Mock 接口
- **WHEN** 查看 `mock/auth.ts`
- **THEN** 必须实现 `POST /api/auth/login` Mock 接口
- **AND** 接口必须接受请求体参数 `{ username: string, password: string }`
- **AND** 当用户名和密码为 `admin/admin` 时，应返回成功响应（包含 `token` 和 `user` 信息）
- **AND** 当用户名或密码不正确时，应返回错误响应（code 不为 0，包含错误信息）
- **AND** 响应格式必须符合 `ApiResp<{ token: string, user: { username: string } }>` 结构

### Requirement: Mock 服务高级查询功能
系统 SHALL 为 Mock 服务提供高级查询功能，包括 tenant（命名空间）隔离、模糊搜索、多条件组合查询等能力，以支持复杂的业务场景。

#### Scenario: 配置 Mock 数据支持 tenant 隔离
- **WHEN** 查看 `mock/config.ts` 文件
- **THEN** 配置列表数据必须按 tenant（命名空间）分组存储（`configListByTenant: Record<string, Config[]>`）
- **AND** 必须提供 tenant 数据初始化函数，为每个命名空间生成独立的配置数据（30-50 条）
- **AND** 查询接口必须根据 `tenant` 参数过滤对应命名空间的配置列表
- **AND** 如果 tenant 不存在，应返回空列表或创建默认数据

#### Scenario: 配置 Mock 数据支持模糊搜索
- **WHEN** 调用配置列表查询接口，传入 `search=blur` 参数
- **THEN** dataId 和 group 字段必须支持模糊匹配（处理通配符 `*`，如 `*keyword*` 或 `keyword`）
- **AND** 模糊搜索应使用字符串包含匹配而非完全匹配
- **AND** 当 `search=accurate` 时，应使用完全匹配

#### Scenario: 配置 Mock 数据支持多条件组合查询
- **WHEN** 调用配置列表查询接口，传入多个查询参数
- **THEN** 必须支持以下查询条件：
  - `dataId`: 根据搜索模式进行模糊/精确匹配
  - `group`: 根据搜索模式进行模糊/精确匹配
  - `appName`: 精确匹配
  - `config_tags`: 标签包含匹配（支持多个标签，逗号分隔）
  - `types`: 类型包含匹配（支持多个类型，逗号分隔）
  - `config_detail`: 配置内容包含匹配
- **AND** 多个条件之间应为 AND 关系（同时满足所有条件）

#### Scenario: 配置 Mock 数据分页处理
- **WHEN** 调用配置列表查询接口，传入 `pageNo` 和 `pageSize` 参数
- **THEN** 必须先进行条件过滤，再进行分页处理
- **AND** 返回结果必须包含 `pageItems`（当前页数据）、`totalCount`（总记录数）、`pageNumber`（当前页码）

#### Scenario: 配置 Mock CRUD 操作 tenant 隔离
- **WHEN** 执行配置的创建、更新、删除操作
- **THEN** 创建操作必须将配置关联到指定的 tenant
- **AND** 更新操作只能操作当前 tenant 的数据
- **AND** 删除操作（单个/批量）只能删除当前 tenant 的数据

