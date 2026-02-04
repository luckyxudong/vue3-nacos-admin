## ADDED Requirements

### Requirement: 配置列表页面
系统 SHALL 提供配置列表页面（`src/pages/configuration/list.vue`），用于展示和管理配置列表，支持多条件查询、模糊搜索、分页排序、批量操作等功能。

#### Scenario: 配置列表页面创建
- **WHEN** 创建配置列表页面
- **THEN** 必须创建 `src/pages/configuration/list.vue` 文件
- **AND** 页面使用组合式 API（Composition API）
- **AND** 页面自动生成路由（基于文件系统路由）

#### Scenario: 页面标题和命名空间选择
- **WHEN** 查看配置列表页面
- **THEN** 页面顶部必须显示页面标题
- **AND** 页面顶部必须支持不同命名空间的切换
- **AND** 切换命名空间时必须重新加载数据并重置查询条件

#### Scenario: 基础查询表单
- **WHEN** 查看配置列表页面
- **THEN** 查询表单区域必须包含以下字段：
  - Data ID 输入框（支持模糊/精确搜索）
  - Group 下拉选择（支持自动完成）
  - 模糊搜索开关（Switch 组件，切换模糊/精确搜索模式）
- **AND** 查询表单必须提供查询按钮

#### Scenario: 高级查询区域
- **WHEN** 查看配置列表页面
- **THEN** 必须提供高级查询区域（可展开/收起）
- **AND** 高级查询区域必须包含以下字段：
  - 应用名称（appName）输入框
  - 标签（config_tags）输入框（支持逗号分隔的多个标签）
  - 类型（types）选择（支持多个类型，逗号分隔）
  - 配置内容（config_detail）搜索输入框

#### Scenario: 配置列表表格展示
- **WHEN** 查看配置列表页面
- **THEN** 表格必须展示以下列：
  - Data ID
  - Group
  - 类型（type）
  - 应用（appName）
  - 操作列（详情、编辑、删除、更多菜单）
- **AND** 表格必须支持加载状态显示
- **AND** 表格必须支持空状态显示

#### Scenario: 表格排序功能
- **WHEN** 点击表格列标题
- **THEN** 必须支持按列排序（Data ID、Group、类型、应用）
- **AND** 排序状态必须在列标题上显示（升序/降序/无排序）

#### Scenario: 表格行选择功能
- **WHEN** 查看配置列表表格
- **THEN** 表格必须支持行选择（多选）
- **AND** 必须提供全选/取消全选功能
- **AND** 选中的行必须在视觉上高亮显示

#### Scenario: 分页组件
- **WHEN** 查看配置列表页面
- **THEN** 页面底部必须显示分页组件
- **AND** 分页组件必须支持页码切换
- **AND** 分页组件必须支持每页数量选择
- **AND** 分页组件必须显示总数和当前页信息

#### Scenario: 批量操作栏
- **WHEN** 选中表格中的多行数据
- **THEN** 必须显示批量操作栏
- **AND** 批量操作栏必须提供以下操作：
  - 批量删除
  - 批量克隆
  - 导出选中项

#### Scenario: 操作列功能
- **WHEN** 查看配置列表表格的操作列
- **THEN** 操作列必须提供以下操作：
  - 查看详情（跳转到详情页面）
  - 编辑配置（跳转到编辑页面）
  - 删除配置（单个删除，需要确认）
  - 更多菜单（版本、监听查询等）

#### Scenario: 创建配置按钮
- **WHEN** 查看配置列表页面
- **THEN** 页面必须提供创建配置按钮
- **AND** 点击创建配置按钮必须跳转到创建配置页面

#### Scenario: 配置列表数据加载
- **WHEN** 页面加载或查询条件变化
- **THEN** 必须调用 `configService.getList()` 获取配置列表
- **AND** 必须传递正确的查询参数（dataId, group, appName, config_tags, types, config_detail, search, pageNo, pageSize, tenant）
- **AND** 必须处理加载状态和错误状态

#### Scenario: 查询参数管理
- **WHEN** 用户输入查询条件并点击查询
- **THEN** 必须将查询条件转换为接口参数
- **AND** 模糊搜索模式（`search=blur`）时，dataId 和 group 应自动添加通配符处理
- **AND** 精确搜索模式（`search=accurate`）时，使用完全匹配

#### Scenario: 命名空间切换处理
- **WHEN** 用户切换命名空间
- **THEN** 必须重置查询条件和分页
- **AND** 必须重新加载当前命名空间的配置列表
- **AND** 必须更新 tenant 参数

#### Scenario: 配置列表页面状态管理
- **WHEN** 查看配置列表页面实现
- **THEN** 必须使用组合式 API 的 `ref` 和 `reactive` 管理状态
- **AND** 查询参数状态：dataId, group, appName, config_tags, types, config_detail, search, pageNo, pageSize, tenant
- **AND** 表格状态：selectedRows, loading, sortField, sortOrder
- **AND** 表单状态：isAdvancedQuery, defaultFuzzySearch
