## MODIFIED Requirements

### Requirement: 创建配置按钮
系统 SHALL 提供创建配置功能，用户可以通过点击按钮打开创建配置对话框。

#### Scenario: 创建配置按钮
- **WHEN** 查看配置列表页面
- **THEN** 页面必须提供创建配置按钮
- **AND** 点击创建配置按钮必须打开创建配置 Dialog 弹出框

## ADDED Requirements

### Requirement: 创建配置 Dialog
系统 SHALL 提供创建配置的 Dialog 弹出框，包含完整的表单字段和验证逻辑。

#### Scenario: Dialog 弹出框结构
- **WHEN** 点击创建配置按钮
- **THEN** 必须显示 Dialog 弹出框
- **AND** Dialog 必须包含 DialogContent、DialogHeader、DialogTitle、DialogFooter 组件
- **AND** Dialog 必须支持打开/关闭状态管理

#### Scenario: 表单字段 - Data ID
- **WHEN** 打开创建配置 Dialog
- **THEN** 表单必须包含 Data ID 输入框（Input 组件）
- **AND** Data ID 字段为必填项
- **AND** Data ID 字段必须验证不能包含特殊字符 `@#\$%\^&\*\s`
- **AND** 验证失败时必须显示错误提示

#### Scenario: 表单字段 - Group
- **WHEN** 打开创建配置 Dialog
- **THEN** 表单必须包含 Group 输入框（Input 组件）
- **AND** Group 字段为必填项，默认值为 `DEFAULT_GROUP`
- **AND** Group 字段必须验证最大长度 127
- **AND** Group 字段必须验证不能包含特殊字符 `@#\$%\^&\*\s`
- **AND** 验证失败时必须显示错误提示

#### Scenario: 表单字段 - 标签
- **WHEN** 打开创建配置 Dialog
- **THEN** 表单必须包含标签输入框（Input 组件）
- **AND** 标签字段为可选项
- **AND** 标签字段支持多个标签用逗号分隔

#### Scenario: 表单字段 - 归属应用
- **WHEN** 打开创建配置 Dialog
- **THEN** 表单必须包含归属应用输入框（Input 组件）
- **AND** 归属应用字段为可选项
- **AND** 后续可扩展为带搜索的 Select 组件

#### Scenario: 表单字段 - 描述
- **WHEN** 打开创建配置 Dialog
- **THEN** 表单必须包含描述输入框（Textarea 组件）
- **AND** 描述字段为可选项
- **AND** 支持多行输入

#### Scenario: 表单字段 - 配置格式
- **WHEN** 打开创建配置 Dialog
- **THEN** 表单必须包含配置格式选择（RadioGroup 组件）
- **AND** 配置格式字段为必填项，默认值为 `TEXT`
- **AND** 支持的格式选项：TEXT、JSON、XML、YAML、HTML、Properties
- **AND** 支持 v-model 双向绑定

#### Scenario: 表单字段 - 配置内容
- **WHEN** 打开创建配置 Dialog
- **THEN** 表单必须包含配置内容输入框（Textarea 组件）
- **AND** 配置内容字段为必填项
- **AND** 配置内容输入框必须使用深色主题样式
- **AND** 配置内容输入框必须显示行号（通过样式模拟）
- **AND** 配置内容输入框必须使用等宽字体

#### Scenario: 配置格式语法验证
- **WHEN** 用户选择配置格式并输入配置内容
- **THEN** 提交前必须对配置内容进行格式校验
- **AND** TEXT 格式无需格式校验（纯文本）
- **AND** JSON 格式必须使用 `JSON.parse()` 验证，捕获异常并提示错误位置
- **AND** XML 格式必须使用 DOMParser 验证 XML 格式
- **AND** YAML 格式必须使用 js-yaml 库验证 YAML 格式
- **AND** HTML 格式必须使用 DOMParser 验证 HTML 格式
- **AND** Properties 格式必须验证 key=value 格式，支持转义字符和续行
- **AND** 格式校验失败时必须显示错误提示

#### Scenario: 提交前检查配置是否存在
- **WHEN** 用户填写表单并点击提交
- **THEN** 提交前必须先进行格式校验
- **AND** 格式校验失败时，必须询问用户是否继续提交
- **AND** 格式校验通过后，必须调用 `configService.getDetail` 检查配置是否存在
- **AND** 如果配置已存在，必须显示错误提示并阻止提交
- **AND** 如果配置不存在（404），允许继续提交

#### Scenario: 提交配置
- **WHEN** 用户填写表单并点击提交
- **THEN** 必须调用 `configService.createOrUpdate` 接口
- **AND** 必须传递正确的参数：dataId、group、content、appName、desc、config_tags、type、tenant
- **AND** type 参数必须转换为小写（text/json/xml/yaml/html/properties）
- **AND** tenant 参数必须使用当前命名空间（currentTenant）
- **AND** 提交成功后必须关闭 Dialog 并刷新配置列表
- **AND** 提交成功后必须显示成功提示
- **AND** 提交失败时必须显示错误提示

#### Scenario: Dialog 关闭时重置表单
- **WHEN** Dialog 关闭
- **THEN** 必须重置所有表单字段为初始值
- **AND** 必须清除所有验证错误提示

#### Scenario: 表单验证错误显示
- **WHEN** 表单字段验证失败
- **THEN** 必须在对应字段下方显示错误提示
- **AND** 错误提示必须清晰说明验证失败的原因
