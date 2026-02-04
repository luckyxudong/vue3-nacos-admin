# Console UI 后台 API 文档

本文档整理了 Console UI 各功能模块对应的后台 API 接口。

---

## 1. 配置管理 (Configuration Management)

配置管理模块提供配置的增删改查、历史版本管理、监听查询、导入导出和同步等功能。

### 1.1 配置列表查询

**API**: `GET /v1/cs/configs`

**功能**: 分页查询配置列表，支持按 Data ID、Group、应用名、配置标签、配置内容、配置类型等条件搜索

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataId | string | 否 | 配置 Data ID，支持模糊搜索 |
| group | string | 否 | 配置分组，支持模糊搜索 |
| appName | string | 否 | 应用名称 |
| config_tags | string | 否 | 配置标签，多个用逗号分隔 |
| config_detail | string | 否 | 配置内容 |
| types | string | 否 | 配置类型，多个用逗号分隔 |
| pageNo | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 10 |
| tenant | string | 否 | 命名空间 ID |
| search | string | 否 | 搜索模式：blur（模糊）/accurate（精确） |

**响应数据结构**:

```json
{
  "pageItems": [
    {
      "id": "number",
      "dataId": "string",
      "group": "string",
      "appName": "string",
      "type": "string",
      "md5": "string"
    }
  ],
  "totalCount": "number",
  "pageNumber": "number",
  "pagesAvailable": "number"
}
```

### 1.2 获取单个配置详情

**API**: `GET /v1/cs/configs?show=all`

**功能**: 获取指定配置的详细信息，也可用于检查配置是否存在

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| show | string | 是 | 固定值: all |
| dataId | string | 是 | 配置 Data ID |
| group | string | 是 | 配置分组 |
| tenant | string | 否 | 命名空间 ID |

**响应数据结构**（配置存在时）:

```json
{
  "id": "number",
  "dataId": "string",
  "group": "string",
  "appName": "string",
  "content": "string",
  "type": "string",
  "md5": "string",
  "desc": "string",
  "configTags": "string"
}
```

**错误响应**（配置不存在时）:

```json
{
  "code": 404,
  "message": "配置不存在",
  "data": null
}
```

**说明**:

- 当配置存在时，返回配置详情（code: 0）
- 当配置不存在时，返回错误响应（code: 404, message: "配置不存在"）
- 此接口常用于新建配置前检查配置是否已存在

### 1.3 创建/更新配置

**API**: `POST /v1/cs/configs`

**功能**: 创建新配置或更新现有配置

**请求参数** (表单格式):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataId | string | 是 | 配置 Data ID |
| group | string | 是 | 配置分组 |
| content | string | 是 | 配置内容 |
| appName | string | 否 | 应用名称 |
| desc | string | 否 | 配置描述 |
| config_tags | string | 否 | 配置标签，多个用逗号分隔 |
| type | string | 否 | 配置类型 |
| tenant | string | 否 | 命名空间 ID |

### 1.4 删除配置

**API**: `DELETE /v1/cs/configs`

**功能**: 删除指定配置

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataId | string | 是 | 配置 Data ID |
| group | string | 是 | 配置分组 |

### 1.5 批量删除配置

**API**: `DELETE /v1/cs/configs?delType=ids`

**功能**: 批量删除配置

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ids | string | 是 | 配置 ID 列表，逗号分隔 |
| tenant | string | 是 | 命名空间 ID |

### 1.6 配置历史列表

**API**: `GET /v1/cs/history`

**功能**: 查询配置的历史版本列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataId | string | 是 | 配置 Data ID |
| group | string | 是 | 配置分组 |
| pageNo | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 10 |
| search | string | 否 | 搜索模式 |

**响应数据结构**:

```json
{
  "pageItems": [
    {
      "id": "number",
      "dataId": "string",
      "group": "string",
      "srcUser": "string",
      "opType": "string",
      "md5": "string",
      "lastModifiedTime": "number"
    }
  ],
  "totalCount": "number",
  "pageNumber": "number",
  "pagesAvailable": "number"
}
```

### 1.7 获取历史配置详情

**API**: `GET /v1/cs/history`

**功能**: 获取指定历史版本的配置内容

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataId | string | 是 | 配置 Data ID |
| group | string | 是 | 配置分组 |
| nid | string | 是 | 历史记录 ID |

### 1.8 配置历史列表（所有有历史的配置）

**API**: `GET /v1/cs/history/configs`

**功能**: 获取所有有历史记录的配置文件列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tenant | string | 否 | 命名空间 ID |

### 1.9 配置回滚

**API**: `POST /v1/cs/configs` 或 `DELETE /v1/cs/configs`

**功能**: 将配置回滚到历史版本

- 当原操作为 INSERT(I) 时，使用 DELETE 请求
- 当原操作为 UPDATE(U) 或 DELETE(D) 时，使用 POST 请求

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataId | string | 是 | 配置 Data ID |
| group | string | 是 | 配置分组 |
| content | string | 是 | 回滚后的配置内容 |
| appName | string | 否 | 应用名称 |
| tenant | string | 否 | 命名空间 ID |

### 1.10 监听查询（按配置查询）

**API**: `GET /v1/cs/configs/listener`

**功能**: 查询监听指定配置的客户端列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| dataId | string | 是 | 配置 Data ID |
| group | string | 是 | 配置分组 |

**响应数据结构**:

```json
{
  "collectStatus": "number",
  "lisentersGroupkeyStatus": {
    "ip:port": "md5值"
  }
}
```

### 1.11 监听查询（按 IP 查询）

**API**: `GET /v1/cs/listener`

**功能**: 查询指定客户端监听的所有配置

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| ip | string | 是 | 客户端 IP |
| tenant | string | 否 | 命名空间 ID |

### 1.12 导出配置

**API**: `GET /v1/cs/configs?export=true`

**功能**: 导出配置到文件

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| export | string | 是 | 固定值: true |
| tenant | string | 否 | 命名空间 ID |
| group | string | 否 | 分组 |
| appName | string | 否 | 应用名称 |
| dataId | string | 否 | Data ID |
| ids | string | 否 | 配置 ID 列表，逗号分隔 |

### 1.13 导入配置

**API**: `POST /v1/cs/configs?import=true`

**功能**: 从文件导入配置

**请求参数** (表单上传):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 导入的文件 |
| policy | string | 是 | 冲突处理策略: ABORT/SKIP/OVERWRITE |
| tenant | string | 是 | 目标命名空间 ID |
| namespace | string | 是 | 目标命名空间 ID |

### 1.14 克隆配置

**API**: `POST /v1/cs/configs?clone=true`

**功能**: 将配置克隆到另一个命名空间

**请求参数** (JSON Body):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| - | array | 是 | 配置数组 |
| cfgId | number | 是 | 配置 ID |
| dataId | string | 是 | 配置 Data ID |
| group | string | 是 | 配置分组 |

**Query 参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| clone | string | 是 | 固定值: true |
| tenant | string | 是 | 目标命名空间 ID |
| policy | string | 是 | 冲突处理策略 |
| namespaceId | string | 否 | 命名空间 ID |

---

## 2. 服务管理 (Service Management)

服务管理模块提供服务的增删改查、订阅者管理等功能。

### 2.1 服务列表查询

**API**: `GET /v1/ns/catalog/services`

**功能**: 分页查询服务列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceNameParam | string | 否 | 服务名称 |
| groupNameParam | string | 否 | 分组名称 |
| pageNo | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 10 |
| hasIpCount | boolean | 否 | 是否隐藏空服务 |
| withInstances | boolean | 否 | 是否包含实例信息 |

**响应数据结构**:

```json
{
  "count": "number",
  "serviceList": [
    {
      "name": "string",
      "groupName": "string",
      "clusterCount": "number",
      "ipCount": "number",
      "healthyInstanceCount": "number",
      "triggerFlag": "string"
    }
  ]
}
```

### 2.2 删除服务

**API**: `DELETE /v1/ns/service`

**功能**: 删除指定服务

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| serviceName | string | 是 | 服务名称 |
| groupName | string | 是 | 分组名称 |

---

## 3. 权限控制 (Authority Control)

权限控制模块提供用户管理、角色管理和权限管理功能。

### 3.1 用户管理

#### 3.1.1 用户列表查询

**API**: `GET /v1/auth/users`

**功能**: 分页查询用户列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNo | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量 |
| username | string | 否 | 用户名，支持模糊搜索 |
| search | string | 否 | 搜索模式: blur/accurate |

**响应数据结构**:

```json
{
  "totalCount": "number",
  "pageNumber": "number",
  "pagesAvailable": "number",
  "pageItems": [
    {
      "username": "string",
      "password": "string"
    }
  ]
}
```

#### 3.1.2 创建用户

**API**: `POST /v1/auth/users`

**功能**: 创建新用户

**请求参数** (表单格式):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

#### 3.1.3 搜索用户

**API**: `GET /v1/auth/users/search`

**功能**: 按用户名搜索用户

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |

#### 3.1.4 删除用户

**API**: `DELETE /v1/auth/users`

**功能**: 删除指定用户

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 要删除的用户名 |

#### 3.1.5 重置密码

**API**: `PUT /v1/auth/users`

**功能**: 重置用户密码

**请求参数** (表单格式):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| newPassword | string | 是 | 新密码 |

### 3.2 角色管理

#### 3.2.1 角色列表查询

**API**: `GET /v1/auth/roles`

**功能**: 分页查询角色列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNo | int | 否 | 页码 |
| pageSize | int | 否 | 每页数量 |

**响应数据结构**:

```json
{
  "totalCount": "number",
  "pageNumber": "number",
  "pagesAvailable": "number",
  "pageItems": [
    {
      "role": "string",
      "username": "string"
    }
  ]
}
```

#### 3.2.2 搜索角色

**API**: `GET /v1/auth/roles/search`

**功能**: 按角色名搜索

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| role | string | 是 | 角色名 |

#### 3.2.3 创建角色

**API**: `POST /v1/auth/roles`

**功能**: 创建新角色

**请求参数** (表单格式):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| role | string | 是 | 角色名 |
| username | string | 是 | 用户名 |

#### 3.2.4 删除角色

**API**: `DELETE /v1/auth/roles`

**功能**: 删除指定角色

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| role | string | 是 | 角色名 |

### 3.3 权限管理

#### 3.3.1 权限列表查询

**API**: `GET /v1/auth/permissions`

**功能**: 分页查询权限列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNo | int | 否 | 页码 |
| pageSize | int | 否 | 每页数量 |

**响应数据结构**:

```json
{
  "totalCount": "number",
  "pageNumber": "number",
  "pagesAvailable": "number",
  "pageItems": [
    {
      "role": "string",
      "resource": "string",
      "action": "string"
    }
  ]
}
```

#### 3.3.2 创建权限

**API**: `POST /v1/auth/permissions`

**功能**: 为角色添加权限

**请求参数** (表单格式):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| role | string | 是 | 角色名 |
| resource | string | 是 | 资源 |
| action | string | 是 | 操作 |

#### 3.3.3 删除权限

**API**: `DELETE /v1/auth/permissions`

**功能**: 删除指定权限

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| role | string | 是 | 角色名 |
| resource | string | 是 | 资源 |
| action | string | 是 | 操作 |

---

## 4. 命名空间管理 (Namespace Management)

命名空间管理模块提供命名空间的查询、创建、编辑和删除功能。

### 4.1 命名空间列表查询

**API**: `GET /v1/console/namespaces`

**功能**: 获取所有命名空间列表

**响应数据结构**:

```json
{
  "code": "number",
  "data": [
    {
      "namespace": "string",
      "namespaceShowName": "string",
      "namespaceDesc": "string",
      "type": "number",
      "configCount": "number",
      "quota": "number"
    }
  ]
}
```

### 4.2 获取命名空间详情

**API**: `GET /v1/console/namespaces?show=all`

**功能**: 获取指定命名空间的详细信息

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| namespaceId | string | 是 | 命名空间 ID |

**响应数据结构**:

```json
{
  "namespace": "string",
  "namespaceShowName": "string",
  "namespaceDesc": "string",
  "configCount": "number",
  "quota": "number"
}
```

### 4.3 删除命名空间

**API**: `DELETE /v1/console/namespaces`

**功能**: 删除指定命名空间

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| namespaceId | string | 是 | 命名空间 ID |

### 4.4 创建命名空间

**API**: `POST /v1/console/namespaces`

**功能**: 创建新命名空间

**请求参数** (表单格式):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| namespaceId | string | 否 | 命名空间 ID |
| namespaceShowName | string | 是 | 命名空间显示名称 |
| namespaceDesc | string | 否 | 命名空间描述 |

### 4.5 编辑命名空间

**API**: `PUT /v1/console/namespaces`

**功能**: 编辑命名空间信息

**请求参数** (表单格式):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| namespaceId | string | 是 | 命名空间 ID |
| namespaceShowName | string | 是 | 命名空间显示名称 |
| namespaceDesc | string | 否 | 命名空间描述 |

### 4.6 检查命名空间 ID 是否存在

**API**: `GET /v1/console/namespaces?checkNamespaceIdExist=true`

**功能**: 检查指定的命名空间 ID 是否已经存在

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| checkNamespaceIdExist | boolean | 是 | 固定值: true |
| customNamespaceId | string | 是 | 待检查的命名空间 ID |

**响应**: `boolean` (true/false)

---

## 5. 集群管理 (Cluster Management)

集群管理模块提供集群节点列表查询和节点管理功能。

### 5.1 集群节点列表查询

**API**: `GET /v1/core/cluster/nodes`

**功能**: 分页查询集群节点列表

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pageNo | int | 否 | 页码，默认 1 |
| pageSize | int | 否 | 每页数量，默认 10 |
| keyword | string | 否 | 关键字搜索 |
| withInstances | boolean | 否 | 是否包含实例信息 |

**响应数据结构**:

```json
{
  "count": "number",
  "data": [
    {
      "address": "string",
      "state": "string",
      "extendInfo": "object",
      "voteFor": "string"
    }
  ]
}
```

### 5.2 节点下线

**API**: `POST /v1/core/cluster/server/leave`

**功能**: 使节点从集群中下线

**请求参数** (Body - JSON Array):

```json
["ip:port", "ip:port"]
```

---

## 6. 认证与系统状态 (Authentication & System State)

### 6.1 用户登录

**API**: `POST /v1/auth/users/login`

**功能**: 用户登录认证

**请求参数** (表单格式):
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应数据结构**:

```json
{
  "accessToken": "string",
  "username": "string"
}
```

### 6.2 系统状态查询

**API**: `GET /v1/console/server/state`

**功能**: 获取系统运行状态和配置

**响应数据结构**:

```json
{
  "version": "string",
  "standalone_mode": "string",
  "function_mode": "string",
  "login_page_enabled": "string",
  "auth_enabled": "string",
  "console_ui_enabled": "string",
  "auth_admin_request": "string",
  "startup_mode": "string",
  "config_retention_days": "number"
}
```

### 6.3 系统引导信息

**API**: `GET /v1/console/server/guide`

**功能**: 获取系统引导信息（当控制台禁用时显示）

**响应数据结构**:

```json
{
  "data": "string"
}
```

### 6.4 系统公告

**API**: `GET /v1/console/server/announcement`

**功能**: 获取系统公告

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| language | string | 是 | 语言: zh-CN / en-US |

---

## 7. 请求头与认证

### 7.1 认证请求头

所有 API 调用（除登录接口外）需要在请求头中携带认证信息:

| 请求头名     | 说明                              |
| ------------ | --------------------------------- |
| accessToken  | 访问令牌，从登录接口获取          |
| Content-Type | application/x-www-form-urlencoded |

### 7.2 Query 参数认证

部分接口需要在 URL Query 参数中携带用户名:

| 参数名   | 说明                   |
| -------- | ---------------------- |
| username | 用户名，从登录接口获取 |

### 7.3 公共请求参数

| 参数名      | 说明     |
| ----------- | -------- |
| accessToken | 访问令牌 |
| username    | 用户名   |

---

## 8. 响应状态码说明

| 状态码 | 说明               |
| ------ | ------------------ |
| 200    | 请求成功           |
| 401    | 未授权，需要登录   |
| 403    | 禁止访问，权限不足 |
| 404    | 资源不存在         |
| 500    | 服务器内部错误     |

### 8.1 业务响应码

| 响应码 | 说明             |
| ------ | ---------------- |
| 200    | 操作成功         |
| 100001 | 命名空间不存在   |
| 100002 | 元数据非法       |
| 100003 | 导入数据验证错误 |
| 100004 | 导入数据格式错误 |
| 100005 | 导入数据内容错误 |

---

## 9. 错误处理

### 9.1 请求错误响应

```json
{
  "message": "错误信息"
}
```

### 9.2 HTTP 错误

| HTTP 状态码 | 处理方式       |
| ----------- | -------------- |
| 401, 403    | 跳转到登录页面 |
| 其他        | 显示错误消息   |

---

## 10. 接口版本

当前 API 版本: **v1**

所有接口路径均以 `/v1/` 开头。
