## ADDED Requirements

### Requirement: 环境变量类型定义
系统 SHALL 在 `env.d.ts` 中提供环境变量的 TypeScript 类型定义，确保类型安全和 IDE 自动补全。

#### Scenario: ImportMetaEnv 接口定义
- **WHEN** 开发者在 `env.d.ts` 中定义 `ImportMetaEnv` 接口
- **THEN** 接口应包含所有自定义环境变量的类型声明（以 `VITE_` 前缀开头）
- **AND** 环境变量应使用 `readonly` 修饰符，确保不可修改
- **AND** TypeScript 应识别这些类型定义

#### Scenario: ImportMeta 接口扩展
- **WHEN** 开发者在 `env.d.ts` 中扩展 `ImportMeta` 接口
- **THEN** 接口应包含 `readonly env: ImportMetaEnv` 属性
- **AND** 使用 `import.meta.env` 时应提供类型提示和自动补全

#### Scenario: 类型提示验证
- **WHEN** 开发者在代码中使用 `import.meta.env.VITE_APP_NAME`
- **THEN** IDE 应提供自动补全和类型提示
- **AND** TypeScript 编译器应进行类型检查

### Requirement: 环境变量工具类
系统 SHALL 提供 `Env` 工具类，封装环境变量的访问逻辑，支持类型转换和环境判断。

#### Scenario: 字符串类型环境变量获取
- **WHEN** 开发者调用 `Env.get('VITE_APP_NAME')`
- **THEN** 方法应返回对应的环境变量值（字符串类型）
- **AND** 如果环境变量不存在且提供了默认值，应返回默认值
- **AND** 方法应支持泛型，允许指定返回类型

#### Scenario: 数字类型环境变量获取
- **WHEN** 开发者调用 `Env.getNumber('VITE_PORT', 3000)`
- **THEN** 方法应将环境变量值转换为数字类型
- **AND** 如果环境变量不存在，应返回默认值（如果提供）
- **AND** 如果环境变量值为空字符串或无效数字，应返回 `NaN` 或默认值

#### Scenario: 布尔类型环境变量获取
- **WHEN** 开发者调用 `Env.getBoolean('VITE_DEBUG', false)`
- **THEN** 方法应将环境变量值转换为布尔类型
- **AND** 字符串 `'true'` 或 `'1'` 应转换为 `true`
- **AND** 其他值应转换为 `false`
- **AND** 如果环境变量不存在，应返回默认值（如果提供）

#### Scenario: 当前环境获取
- **WHEN** 开发者访问 `Env.env`
- **THEN** 属性应返回当前环境（'dev' | 'uat' | 'prod'）
- **AND** 应从 `VITE_ENV` 环境变量读取，如果不存在则默认为 'dev'
- **AND** 属性应为只读属性

#### Scenario: 环境判断方法
- **WHEN** 开发者访问 `Env.isDev`
- **THEN** 属性应返回布尔值，表示当前是否为开发环境
- **AND** 当 `Env.env === 'dev'` 时应返回 `true`

- **WHEN** 开发者访问 `Env.isUat`
- **THEN** 属性应返回布尔值，表示当前是否为 UAT 环境
- **AND** 当 `Env.env === 'uat'` 时应返回 `true`

- **WHEN** 开发者访问 `Env.isProd`
- **THEN** 属性应返回布尔值，表示当前是否为生产环境
- **AND** 当 `Env.env === 'prod'` 时应返回 `true`

### Requirement: 多环境模式支持
系统 SHALL 在 `package.json` 中提供多环境的启动和构建命令。

#### Scenario: 开发环境命令
- **WHEN** 开发者执行 `pnpm dev:dev`
- **THEN** 命令应使用 `vite --mode dev` 启动开发服务器
- **AND** 应用应加载 `.env.dev` 和 `.env.dev.local` 文件（如果存在）

- **WHEN** 开发者执行 `pnpm dev:uat`
- **THEN** 命令应使用 `vite --mode uat` 启动开发服务器
- **AND** 应用应加载 `.env.uat` 和 `.env.uat.local` 文件（如果存在）

#### Scenario: 构建环境命令
- **WHEN** 开发者执行 `pnpm build:dev`
- **THEN** 命令应使用 `--mode dev` 参数构建应用
- **AND** 构建应加载 `.env.dev` 和 `.env.dev.local` 文件（如果存在）

- **WHEN** 开发者执行 `pnpm build:uat`
- **THEN** 命令应使用 `--mode uat` 参数构建应用
- **AND** 构建应加载 `.env.uat` 和 `.env.uat.local` 文件（如果存在）

- **WHEN** 开发者执行 `pnpm build:prod`
- **THEN** 命令应使用 `--mode prod` 参数构建应用
- **AND** 构建应加载 `.env.prod` 和 `.env.prod.local` 文件（如果存在）

### Requirement: 环境变量文件优先级
系统 SHALL 遵循 Vite 的环境变量文件加载优先级规则。

#### Scenario: 文件优先级规则
- **WHEN** 多个环境变量文件包含相同的变量名
- **THEN** 优先级应为：`.env.[mode].local` > `.env.[mode]` > `.env.local` > `.env`
- **AND** 高优先级的文件应覆盖低优先级的文件中的同名变量

#### Scenario: 环境变量文件加载
- **WHEN** 开发者启动应用（mode 为 dev）
- **THEN** 系统应加载以下文件（如果存在）：`.env`、`.env.local`、`.env.dev`、`.env.dev.local`
- **AND** 所有文件中的环境变量应合并，遵循优先级规则

### Requirement: vite.config.ts 环境变量支持
系统 SHALL 在 `vite.config.ts` 中支持访问环境变量。

#### Scenario: loadEnv 函数使用
- **WHEN** 开发者在 `vite.config.ts` 中使用 `loadEnv` 函数
- **THEN** 函数应从 `vite` 包导入
- **AND** 函数应接收三个参数：`mode`（当前模式）、`process.cwd()`（项目根目录）、`'VITE_'`（环境变量前缀）
- **AND** 函数应根据 mode 加载对应的环境变量文件

#### Scenario: defineConfig 函数形式
- **WHEN** 开发者在 `vite.config.ts` 中使用 `defineConfig`
- **THEN** `defineConfig` 应使用函数形式，接收 `{ mode }` 参数
- **AND** 函数应返回配置对象
- **AND** 配置对象可以使用 `loadEnv` 加载的环境变量

#### Scenario: 配置文件中访问环境变量
- **WHEN** 开发者在 `vite.config.ts` 中调用 `loadEnv(mode, process.cwd(), 'VITE_')`
- **THEN** 函数应返回包含所有 `VITE_` 前缀环境变量的对象
- **AND** 开发者可以通过 `env['VITE_APP_NAME']` 访问环境变量
- **AND** 环境变量值应为字符串类型
