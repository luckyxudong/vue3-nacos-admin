# Change: 添加环境变量管理系统

## Why

在真实的企业级项目中，环境变量管理是必不可少的，它提供了以下核心价值：
1. **安全性**：敏感信息（如 API 密钥、数据库连接字符串）不适合硬编码到代码中
2. **灵活性**：不同的环境（开发、测试、生产）需要使用不同的配置
3. **可维护性**：将配置集中管理，避免在各个角落查找配置开关

当前项目缺乏一套完整、优雅的环境变量管理方案，开发者需要：
- 手动管理多个环境的配置
- 手动编写类型定义以获得 TypeScript 支持
- 直接使用 `import.meta.env` 访问环境变量，缺乏统一的工具类封装
- 在 `vite.config.ts` 中无法方便地访问环境变量

通过添加环境变量管理系统，可以实现：
- 支持多环境配置（dev、uat、prod）
- 提供 TypeScript 类型定义，确保类型安全
- 封装统一的工具类，简化环境变量访问
- 支持在 `vite.config.ts` 中访问环境变量

## What Changes

- **新增环境变量类型定义**：在 `env.d.ts` 中添加 `ImportMetaEnv` 接口定义，支持自定义环境变量的类型提示
- **新增环境变量工具类**：创建 `src/utils/env.ts`，提供 `Env` 类封装环境变量访问，支持字符串、数字、布尔类型的转换
- **新增多环境模式支持**：扩展 `package.json` 中的 scripts，支持 `dev:dev`、`dev:uat`、`build:dev`、`build:uat`、`build:prod` 等多环境命令
- **新增环境变量文件支持**：支持 `.env`、`.env.local`、`.env.[mode]`、`.env.[mode].local` 四种环境变量文件，遵循 Vite 的优先级规则
- **更新 vite.config.ts**：使用 `loadEnv` 函数在配置文件中访问环境变量

## Impact

- **新增能力**：
  - `env-variable-management`：环境变量管理能力
- **受影响代码**：
  - `env.d.ts`：添加环境变量类型定义
  - `src/utils/env.ts`：新增环境变量工具类（新建文件）
  - `package.json`：扩展 scripts 支持多环境
  - `vite.config.ts`：添加 `loadEnv` 支持
  - 所有使用环境变量的组件和工具文件：可以使用 `Env` 工具类替代直接访问 `import.meta.env`
- **开发体验提升**：
  - 提供类型安全的环境变量访问
  - 简化环境变量使用，提供统一的 API
  - 支持多环境配置，提升项目灵活性
  - 提供环境判断的便捷方法（`isDev`、`isUat`、`isProd`）
