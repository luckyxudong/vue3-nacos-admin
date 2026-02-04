# Change: 基于 API 文档开发服务层

## Why

根据 `docs/api/console-api.md` 文档，需要实现完整的 Console UI 后台 API 服务层。当前项目只有基础的 `auth-service.ts`、`base-service.ts` 和 `demo-service.ts`，缺少配置管理、服务管理、权限控制、命名空间管理、集群管理和系统状态等核心业务模块的服务层实现。

同时，现有的 `auth-service.ts` 中登录接口路径不正确，需要更新为 `/v1/auth/users/login` 以匹配 API 文档规范。

## What Changes

- **更新认证服务**：修改 `auth-service.ts` 中的登录接口路径为 `/v1/auth/users/login`，并更新响应类型以匹配 API 文档
- **新增配置管理服务**：创建 `configuration/config-service.ts`，实现配置管理的 14 个接口（列表查询、详情、创建/更新、删除、批量删除、历史列表、历史详情、历史配置列表、回滚、监听查询等）
- **新增服务管理服务**：创建 `service/service-service.ts`，实现服务管理的 2 个接口（服务列表查询、删除服务）
- **新增用户管理服务**：创建 `auth/user-service.ts`，实现用户管理的 5 个接口（列表查询、创建、搜索、删除、重置密码）
- **新增角色管理服务**：创建 `auth/role-service.ts`，实现角色管理的 4 个接口（列表查询、搜索、创建、删除）
- **新增权限管理服务**：创建 `auth/permission-service.ts`，实现权限管理的 3 个接口（列表查询、创建、删除）
- **新增命名空间管理服务**：创建 `namespace/namespace-service.ts`，实现命名空间管理的 5 个接口（列表查询、详情、删除、创建、编辑）
- **新增集群管理服务**：创建 `cluster/cluster-service.ts`，实现集群管理的 2 个接口（节点列表查询、节点下线）
- **新增系统状态服务**：创建 `system/system-service.ts`，实现系统状态的 3 个接口（系统状态查询、系统引导信息、系统公告）

## Impact

- **Affected specs**: 
  - `service-layer` - 扩展 Service 层能力，支持表单格式请求、文件上传、复杂查询参数等
  - `auth-system` - 更新认证服务接口路径和响应类型
- **Affected code**: 
  - `src/services/auth-service.ts` - 更新登录接口路径和响应类型
  - `src/services/` - 新增多个服务模块目录和文件
  - `src/http/core/types.ts` - 可能需要扩展类型定义以支持表单格式请求
  - `src/http/core/http-client.ts` - 可能需要支持表单格式请求和文件上传
