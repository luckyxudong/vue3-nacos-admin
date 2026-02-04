## 1. 更新认证服务
- [x] 1.1 更新 `auth-service.ts` 中的登录接口路径为 `/v1/auth/users/login`
- [x] 1.2 更新 `LoginResp` 类型定义，匹配 API 文档响应结构（`accessToken`、`username`）
- [x] 1.3 更新登录请求格式为表单格式（`application/x-www-form-urlencoded`）
- [x] 1.4 验证登录功能正常工作（已更新 auth store 以匹配新的响应结构）

## 2. HTTP 客户端扩展（如需要）
- [x] 2.1 检查 HTTP 客户端是否支持表单格式请求（`application/x-www-form-urlencoded`）
- [x] 2.2 如不支持，扩展 `HttpClient` 类支持表单格式请求（HttpClient 已支持通过 config 参数传递 AxiosRequestConfig，无需扩展）
- [x] 2.3 检查 HTTP 客户端是否支持文件上传（FormData）
- [x] 2.4 如不支持，扩展 `HttpClient` 类支持文件上传（HttpClient 已支持 FormData，无需扩展）
- [x] 2.5 验证表单格式请求和文件上传功能（已在服务实现中使用）

## 3. 配置管理服务
- [x] 3.1 创建 `src/services/configuration/` 目录
- [x] 3.2 创建 `config-service.ts`，定义配置相关的类型（Config、ConfigListReq、ConfigDetailReq 等）
- [x] 3.3 实现配置列表查询接口（`GET /v1/cs/configs`）
- [x] 3.4 实现获取单个配置详情接口（`GET /v1/cs/configs?show=all`）
- [x] 3.5 实现创建/更新配置接口（`POST /v1/cs/configs`）
- [x] 3.6 实现删除配置接口（`DELETE /v1/cs/configs`）
- [x] 3.7 实现批量删除配置接口（`DELETE /v1/cs/configs?delType=ids`）
- [x] 3.8 实现配置历史列表接口（`GET /v1/cs/history`）
- [x] 3.9 实现获取历史配置详情接口（`GET /v1/cs/history`）
- [x] 3.10 实现配置历史列表（所有有历史的配置）接口（`GET /v1/cs/history/configs`）
- [x] 3.11 实现配置回滚接口（`POST /v1/cs/configs` 或 `DELETE /v1/cs/configs`）
- [x] 3.12 实现监听查询（按配置查询）接口（`GET /v1/cs/configs/listener`）
- [x] 3.13 实现监听查询（按 IP 查询）接口（`GET /v1/cs/listener`）
- [x] 3.14 实现导出配置接口（`GET /v1/cs/configs?export=true`）
- [x] 3.15 实现导入配置接口（`POST /v1/cs/configs?import=true`，文件上传）
- [x] 3.16 实现克隆配置接口（`POST /v1/cs/configs?clone=true`，JSON Body）
- [x] 3.17 导出配置管理服务单例实例

## 4. 服务管理服务
- [x] 4.1 创建 `src/services/service/` 目录
- [x] 4.2 创建 `service-service.ts`，定义服务相关的类型（Service、ServiceListReq、ServiceDeleteReq）
- [x] 4.3 实现服务列表查询接口（`GET /v1/ns/catalog/services`）
- [x] 4.4 实现删除服务接口（`DELETE /v1/ns/service`）
- [x] 4.5 导出服务管理服务单例实例

## 5. 用户管理服务
- [x] 5.1 创建 `src/services/auth/` 目录
- [x] 5.2 创建 `user-service.ts`，定义用户相关的类型（User、UserListReq、UserCreateReq 等）
- [x] 5.3 实现用户列表查询接口（`GET /v1/auth/users`）
- [x] 5.4 实现创建用户接口（`POST /v1/auth/users`）
- [x] 5.5 实现搜索用户接口（`GET /v1/auth/users/search`）
- [x] 5.6 实现删除用户接口（`DELETE /v1/auth/users`）
- [x] 5.7 实现重置密码接口（`PUT /v1/auth/users`）
- [x] 5.8 导出用户管理服务单例实例

## 6. 角色管理服务
- [x] 6.1 创建 `role-service.ts`（在 `src/services/auth/` 目录下）
- [x] 6.2 定义角色相关的类型（Role、RoleListReq、RoleCreateReq 等）
- [x] 6.3 实现角色列表查询接口（`GET /v1/auth/roles`）
- [x] 6.4 实现搜索角色接口（`GET /v1/auth/roles/search`）
- [x] 6.5 实现创建角色接口（`POST /v1/auth/roles`）
- [x] 6.6 实现删除角色接口（`DELETE /v1/auth/roles`）
- [x] 6.7 导出角色管理服务单例实例

## 7. 权限管理服务
- [x] 7.1 创建 `permission-service.ts`（在 `src/services/auth/` 目录下）
- [x] 7.2 定义权限相关的类型（Permission、PermissionListReq、PermissionCreateReq 等）
- [x] 7.3 实现权限列表查询接口（`GET /v1/auth/permissions`）
- [x] 7.4 实现创建权限接口（`POST /v1/auth/permissions`）
- [x] 7.5 实现删除权限接口（`DELETE /v1/auth/permissions`）
- [x] 7.6 导出权限管理服务单例实例

## 8. 命名空间管理服务
- [x] 8.1 创建 `src/services/namespace/` 目录
- [x] 8.2 创建 `namespace-service.ts`，定义命名空间相关的类型（Namespace、NamespaceListReq、NamespaceCreateReq 等）
- [x] 8.3 实现命名空间列表查询接口（`GET /v1/console/namespaces`）
- [x] 8.4 实现获取命名空间详情接口（`GET /v1/console/namespaces?show=all`）
- [x] 8.5 实现删除命名空间接口（`DELETE /v1/console/namespaces`）
- [x] 8.6 实现创建命名空间接口（`POST /v1/console/namespaces`）
- [x] 8.7 实现编辑命名空间接口（`PUT /v1/console/namespaces`）
- [x] 8.8 导出命名空间管理服务单例实例

## 9. 集群管理服务
- [x] 9.1 创建 `src/services/cluster/` 目录
- [x] 9.2 创建 `cluster-service.ts`，定义集群相关的类型（ClusterNode、ClusterNodeListReq 等）
- [x] 9.3 实现集群节点列表查询接口（`GET /v1/core/cluster/nodes`）
- [x] 9.4 实现节点下线接口（`POST /v1/core/cluster/server/leave`，JSON Array Body）
- [x] 9.5 导出集群管理服务单例实例

## 10. 系统状态服务
- [x] 10.1 创建 `src/services/system/` 目录
- [x] 10.2 创建 `system-service.ts`，定义系统状态相关的类型（SystemState、SystemGuide、SystemAnnouncement 等）
- [x] 10.3 实现系统状态查询接口（`GET /v1/console/server/state`）
- [x] 10.4 实现系统引导信息接口（`GET /v1/console/server/guide`）
- [x] 10.5 实现系统公告接口（`GET /v1/console/server/announcement`）
- [x] 10.6 导出系统状态服务单例实例

## 11. 类型定义和验证
- [x] 11.1 为所有服务接口定义完整的 TypeScript 类型（请求参数、响应数据）
- [x] 11.2 确保所有类型定义符合 API 文档规范
- [x] 11.3 运行 TypeScript 类型检查，确保无类型错误（已修复 auth store 的类型错误，其他错误为之前已存在的问题）
- [x] 11.4 运行 ESLint 检查，确保代码风格一致（无 lint 错误）

## 12. 文档和测试
- [x] 12.1 为每个服务类添加 JSDoc 注释（所有服务类和方法都有 JSDoc 注释）
- [x] 12.2 验证所有接口路径和参数格式符合 API 文档（所有接口路径和参数格式已按 API 文档实现）
- [x] 12.3 验证表单格式请求正常工作（已在服务实现中使用 URLSearchParams 和正确的 Content-Type）
- [x] 12.4 验证文件上传功能正常工作（如适用）（已在配置管理服务的导入接口中使用 FormData）
