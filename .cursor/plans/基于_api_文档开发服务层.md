---
name: 基于 API 文档开发服务层
overview: 根据 console-api.md 文档，在 src/services 目录下按模块分类创建对应的 API 服务文件，包括配置管理、服务管理、权限控制、命名空间管理、集群管理和系统状态等模块。
todos:
  - id: update-auth-service
    content: 更新 auth-service.ts，修改登录接口路径为 /v1/auth/users/login
    status: pending
  - id: create-config-service
    content: 创建 configuration/config-service.ts，实现配置管理的所有接口（14个接口）
    status: pending
  - id: create-service-service
    content: 创建 service/service-service.ts，实现服务管理的接口（2个接口）
    status: pending
  - id: create-user-service
    content: 创建 auth/user-service.ts，实现用户管理的接口（5个接口）
    status: pending
  - id: create-role-service
    content: 创建 auth/role-service.ts，实现角色管理的接口（4个接口）
    status: pending
  - id: create-permission-service
    content: 创建 auth/permission-service.ts，实现权限管理的接口（3个接口）
    status: pending
  - id: create-namespace-service
    content: 创建 namespace/namespace-service.ts，实现命名空间管理的接口（5个接口）
    status: pending
  - id: create-cluster-service
    content: 创建 cluster/cluster-service.ts，实现集群管理的接口（2个接口）
    status: pending
  - id: create-system-service
    content: 创建 system/system-service.ts，实现系统状态的接口（3个接口）
    status: pending
isProject: false
---

# 基于 API 文档开发服务层

## 概述

根据 `docs/api/console-api.md` 文档，在 `src/services` 目录下按模块分类创建对应的 API 服务文件。所有接口路径以 `/v1/` 开头，需要确保 baseURL 配置正确。

## 目录结构

```
src/services/
├── auth-service.ts (已存在，需要更新登录接口路径)
├── configuration/          # 配置管理模块
│   └── config-service.ts
├── service/                # 服务管理模块
│   └── service-service.ts
├── auth/                   # 权限控制模块
│   ├── user-service.ts     # 用户管理
│   ├── role-service.ts     # 角色管理
│   └── permission-service.ts # 权限管理
├── namespace/              # 命名空间管理模块
│   └── namespace-service.ts
├── cluster/                # 集群管理模块
│   └── cluster-service.ts
└── system/                 # 系统状态模块
    └── system-service.ts
```

## 实现细节

### 1. 配置管理模块 (`configuration/config-service.ts`)

实现配置管理的所有接口：

- 配置列表查询 (`GET /v1/cs/configs`)
- 获取单个配置详情 (`GET /v1/cs/configs?show=all`)
- 创建/更新配置 (`POST /v1/cs/configs`)
- 删除配置 (`DELETE /v1/cs/configs`)
- 批量删除配置 (`DELETE /v1/cs/configs?delType=ids`)
- 配置历史列表 (`GET /v1/cs/history`)
- 获取历史配置详情 (`GET /v1/cs/history`)
- 配置历史列表（所有有历史的配置）(`GET /v1/cs/history/configs`)
- 配置回滚 (`POST /v1/cs/configs` 或 `DELETE /v1/cs/configs`)
- 监听查询（按配置查询）(`GET /v1/cs/configs/listener`)
- 监听查询（按 IP 查询）(`GET /v1/cs/listener`)
- 导出配置 (`GET /v1/cs/configs?export=true`)
- 导入配置 (`POST /v1/cs/configs?import=true`)
- 克隆配置 (`POST /v1/cs/configs?clone=true`)

**类型定义**：

- `ConfigListReq` - 配置列表查询参数
- `ConfigDetailReq` - 配置详情查询参数
- `ConfigCreateReq` - 创建/更新配置参数
- `ConfigDeleteReq` - 删除配置参数
- `ConfigHistoryReq` - 配置历史查询参数
- `ConfigRollbackReq` - 配置回滚参数
- `ConfigExportReq` - 导出配置参数
- `ConfigImportReq` - 导入配置参数
- `ConfigCloneReq` - 克隆配置参数
- `Config` - 配置实体类型
- `ConfigHistory` - 配置历史实体类型
- `ConfigListener` - 监听查询响应类型

### 2. 服务管理模块 (`service/service-service.ts`)

实现服务管理的接口：

- 服务列表查询 (`GET /v1/ns/catalog/services`)
- 删除服务 (`DELETE /v1/ns/service`)

**类型定义**：

- `ServiceListReq` - 服务列表查询参数
- `ServiceDeleteReq` - 删除服务参数
- `Service` - 服务实体类型

### 3. 权限控制模块

#### 3.1 用户管理 (`auth/user-service.ts`)

- 用户列表查询 (`GET /v1/auth/users`)
- 创建用户 (`POST /v1/auth/users`)
- 搜索用户 (`GET /v1/auth/users/search`)
- 删除用户 (`DELETE /v1/auth/users`)
- 重置密码 (`PUT /v1/auth/users`)

#### 3.2 角色管理 (`auth/role-service.ts`)

- 角色列表查询 (`GET /v1/auth/roles`)
- 搜索角色 (`GET /v1/auth/roles/search`)
- 创建角色 (`POST /v1/auth/roles`)
- 删除角色 (`DELETE /v1/auth/roles`)

#### 3.3 权限管理 (`auth/permission-service.ts`)

- 权限列表查询 (`GET /v1/auth/permissions`)
- 创建权限 (`POST /v1/auth/permissions`)
- 删除权限 (`DELETE /v1/auth/permissions`)

### 4. 命名空间管理模块 (`namespace/namespace-service.ts`)

- 命名空间列表查询 (`GET /v1/console/namespaces`)
- 获取命名空间详情 (`GET /v1/console/namespaces?show=all`)
- 删除命名空间 (`DELETE /v1/console/namespaces`)
- 创建命名空间 (`POST /v1/console/namespaces`)
- 编辑命名空间 (`PUT /v1/console/namespaces`)

### 5. 集群管理模块 (`cluster/cluster-service.ts`)

- 集群节点列表查询 (`GET /v1/core/cluster/nodes`)
- 节点下线 (`POST /v1/core/cluster/server/leave`)

### 6. 系统状态模块 (`system/system-service.ts`)

- 系统状态查询 (`GET /v1/console/server/state`)
- 系统引导信息 (`GET /v1/console/server/guide`)
- 系统公告 (`GET /v1/console/server/announcement`)

### 7. 更新认证服务 (`auth-service.ts`)

更新现有的 `auth-service.ts`，将登录接口路径从 `/auth/login` 改为 `/v1/auth/users/login`，并确保响应类型匹配文档。

## 实现规范

1. **请求格式**：
   - 大部分接口使用表单格式 (`application/x-www-form-urlencoded`)，需要在请求时设置正确的 Content-Type
   - 部分接口使用 JSON Body（如克隆配置）
   - 文件上传接口使用 FormData

2. **认证处理**：
   - 所有接口（除登录外）需要在请求头中携带 `accessToken`
   - 部分接口需要在 Query 参数中携带 `username`
   - 这些认证信息应该在请求拦截器中统一处理（需要确认当前拦截器实现）

3. **响应处理**：
   - 响应拦截器已处理，直接返回 data 部分
   - 分页响应结构需要适配文档中的格式（`pageItems`, `totalCount`, `pageNumber` 等）

4. **类型定义**：
   - 为每个接口定义请求参数类型和响应类型
   - 使用 TypeScript 接口定义，遵循项目现有风格
   - 分页请求参数统一使用 `pageNo` 和 `pageSize`（与文档一致）

5. **服务类结构**：
   - 每个服务类导出单例实例
   - 方法命名清晰，与 API 文档中的功能描述对应
   - 添加必要的 JSDoc 注释

## 注意事项

1. API 文档中的接口路径都是 `/v1/` 开头，需要确保 baseURL 配置正确，或者在每个请求中使用完整路径
2. 部分接口使用 Query 参数传递数据（如删除配置），需要使用 `params` 选项
3. 表单格式的请求需要使用 `URLSearchParams` 或类似方式构建请求体
4. 文件上传接口需要使用 FormData
5. 响应数据结构与项目现有的 `PageData` 类型可能不完全匹配，需要适配或定义新的类型
