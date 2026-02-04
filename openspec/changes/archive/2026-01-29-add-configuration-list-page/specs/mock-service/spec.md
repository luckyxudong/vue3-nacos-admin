## ADDED Requirements

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
