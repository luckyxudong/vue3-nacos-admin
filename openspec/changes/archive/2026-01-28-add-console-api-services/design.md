# Design: 基于 API 文档开发服务层

## Context

根据 `docs/api/console-api.md` 文档，需要实现完整的 Console UI 后台 API 服务层。API 文档定义了多个业务模块的接口，包括配置管理、服务管理、权限控制、命名空间管理、集群管理和系统状态等。

当前项目已有基础的 HTTP 请求封装和 Service 层架构，但需要扩展以支持：
1. 表单格式请求（`application/x-www-form-urlencoded`）
2. 文件上传（FormData）
3. 复杂查询参数（Query 参数传递数据）
4. JSON Body 请求（部分接口使用）

## Goals / Non-Goals

### Goals
- 实现所有 API 文档中定义的服务接口
- 保持 Service 层的统一架构和代码风格
- 支持表单格式、文件上传、JSON Body 等多种请求格式
- 提供完整的 TypeScript 类型定义
- 确保所有接口路径和参数格式符合 API 文档规范

### Non-Goals
- 不修改 HTTP 核心封装层的架构（除非必要）
- 不实现业务逻辑，只封装 API 调用
- 不实现 Mock 服务（Mock 服务在单独的 change 中实现）

## Decisions

### Decision: HTTP 客户端请求格式支持

**问题**: API 文档中大部分接口使用表单格式（`application/x-www-form-urlencoded`），而当前 HTTP 客户端可能默认使用 JSON 格式。

**方案**: 
1. 检查当前 HTTP 客户端实现，确认是否支持表单格式请求
2. 如不支持，扩展 `HttpClient` 类，添加支持表单格式的方法或配置选项
3. 对于文件上传接口，使用 FormData 格式
4. 对于克隆配置等接口，使用 JSON Body 格式

**理由**: 
- 保持 HTTP 客户端接口的一致性
- 避免在每个 Service 方法中重复处理请求格式转换
- 表单格式请求在 Axios 中可以通过 `URLSearchParams` 或配置 `headers` 和 `data` 实现

### Decision: Service 层目录结构

**问题**: 如何组织多个业务模块的服务文件？

**方案**: 按业务模块创建子目录：
```
src/services/
├── auth-service.ts (已存在，更新)
├── configuration/
│   └── config-service.ts
├── service/
│   └── service-service.ts
├── auth/
│   ├── user-service.ts
│   ├── role-service.ts
│   └── permission-service.ts
├── namespace/
│   └── namespace-service.ts
├── cluster/
│   └── cluster-service.ts
└── system/
    └── system-service.ts
```

**理由**:
- 清晰的模块划分，便于维护
- 符合项目现有的目录结构规范
- 避免单个目录下文件过多

### Decision: BaseService 基类使用

**问题**: 是否所有服务都继承 `BaseService` 基类？

**方案**: 
- 对于标准的 CRUD 操作，优先使用 `BaseService` 基类
- 对于复杂的业务接口（如配置历史、监听查询、导入导出等），在服务类中直接实现，不强制继承 `BaseService`
- 每个服务类导出单例实例供业务层使用

**理由**:
- `BaseService` 提供标准的 CRUD 方法，但 API 文档中的接口路径和参数格式多样，不完全符合 RESTful 规范
- 灵活处理特殊接口，避免过度抽象

### Decision: 类型定义策略

**问题**: 如何定义请求参数和响应数据的类型？

**方案**:
- 为每个接口定义独立的请求参数类型（如 `ConfigListReq`、`ConfigDetailReq`）
- 为每个业务实体定义类型（如 `Config`、`ConfigHistory`）
- 响应类型直接使用业务实体类型或分页类型（`PageData<T>`）
- 所有类型定义放在对应的服务文件中

**理由**:
- 类型安全，便于 TypeScript 检查和 IDE 自动补全
- 清晰的类型定义，便于理解和维护
- 符合项目现有的代码风格

### Decision: 认证信息处理

**问题**: API 文档要求所有接口（除登录外）需要在请求头中携带 `accessToken`，部分接口需要在 Query 参数中携带 `username`。

**方案**:
- 认证信息在 HTTP 拦截器中统一处理（需要确认当前拦截器实现）
- Service 层不关心认证细节，只关注业务接口调用
- 如果拦截器未实现，需要在 HTTP 配置层添加认证拦截器

**理由**:
- 统一处理认证信息，避免在每个 Service 方法中重复添加
- 符合关注点分离原则
- 便于后续修改认证策略

## Risks / Trade-offs

### Risk: HTTP 客户端不支持表单格式请求
**Mitigation**: 检查当前实现，如不支持则扩展 `HttpClient` 类，添加表单格式支持。

### Risk: 接口路径和参数格式多样，难以统一抽象
**Mitigation**: 不强制使用 `BaseService` 基类，对于特殊接口直接实现，保持灵活性。

### Risk: 类型定义可能不完全匹配实际 API 响应
**Mitigation**: 严格按照 API 文档定义类型，后续根据实际响应调整。

### Risk: 认证信息处理可能影响现有功能
**Mitigation**: 确认当前拦截器实现，如需要修改，确保不影响现有功能。

## Migration Plan

1. **阶段 1**: 更新认证服务，验证登录功能正常
2. **阶段 2**: 扩展 HTTP 客户端（如需要），支持表单格式和文件上传
3. **阶段 3**: 按模块顺序实现各个服务（配置管理 → 服务管理 → 权限控制 → 命名空间 → 集群 → 系统状态）
4. **阶段 4**: 类型检查和代码风格验证
5. **阶段 5**: 文档和测试验证

## Open Questions

1. 当前 HTTP 拦截器是否已实现认证信息自动添加？
2. HTTP 客户端是否已支持表单格式请求？
3. HTTP 客户端是否已支持文件上传（FormData）？
4. 是否需要为这些服务创建 Mock 接口？（这应该在单独的 change 中处理）
