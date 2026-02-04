## ADDED Requirements

### Requirement: Mock 服务基础结构
系统 SHALL 提供 Mock 服务（项目根目录下的 `mock/` 目录），用于模拟后端接口响应。

#### Scenario: Mock 目录结构
- **WHEN** 初始化 Mock 服务
- **THEN** 必须创建 `mock/` 目录（与 `src` 目录平级）
- **AND** Mock 文件应放在 `mock/` 目录下（如 `mock/demo.ts`）

#### Scenario: Mock 服务依赖
- **WHEN** 查看项目依赖
- **THEN** 必须安装 `mockjs`、`@types/mockjs`、`vite-plugin-mock` 开发依赖

#### Scenario: Vite Mock 插件配置
- **WHEN** 查看 `vite.config.ts`
- **THEN** 必须配置 `vite-plugin-mock` 插件
- **AND** 插件配置必须指定 `mockPath: './mock'`
- **AND** 插件配置必须设置 `enable: true`（开发环境）

#### Scenario: Mock 文件格式
- **WHEN** 查看 Mock 文件（如 `mock/demo.ts`）
- **THEN** 必须使用 `MockMethod[]` 类型定义 Mock 接口
- **AND** Mock 接口必须包含 `url`、`method`、`response` 字段
- **AND** Mock 响应必须符合 `ApiResp<T>` 结构

#### Scenario: Mock 服务功能验证
- **WHEN** 启动开发服务器并访问 Mock 接口（如 `http://localhost:5173/api/demo`）
- **THEN** 必须返回符合 `ApiResp<T>` 结构的 JSON 数据
- **AND** Mock 数据应使用 MockJS 生成

#### Scenario: Mock 服务 CRUD 支持
- **WHEN** 查看示例 Mock 文件（如 `mock/demo.ts`）
- **THEN** 必须支持 GET（列表查询、详情查询）、POST（创建）、PUT（更新）、DELETE（删除）等 CRUD 操作
- **AND** GET 列表查询必须支持分页参数（`pageNum`, `pageSize`）和关键词搜索（`keyword`）
