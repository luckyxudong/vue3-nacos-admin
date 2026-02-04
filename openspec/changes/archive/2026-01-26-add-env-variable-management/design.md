# 环境变量管理系统设计

## Context

Vue3/Vite 项目需要一套完整的环境变量管理方案，支持多环境配置、类型安全、以及便捷的访问方式。Vite 本身提供了基础的环境变量支持，但需要在此基础上构建更完善的工具层。

## Goals / Non-Goals

### Goals
- 提供类型安全的环境变量访问
- 支持多环境配置（dev、uat、prod）
- 封装统一的工具类，简化环境变量使用
- 支持在 `vite.config.ts` 中访问环境变量
- 遵循 Vite 的环境变量文件优先级规则

### Non-Goals
- 不实现环境变量的运行时动态切换（环境变量在构建时确定）
- 不实现环境变量的加密存储（敏感信息应通过其他方式管理）
- 不实现环境变量的验证和校验机制（保持简单）

## Decisions

### Decision: 使用 Vite 原生环境变量机制
**What**: 使用 Vite 提供的环境变量文件（`.env`、`.env.local`、`.env.[mode]`、`.env.[mode].local`）和 `import.meta.env` API。

**Why**: 
- Vite 已经提供了完善的环境变量支持，无需引入额外的依赖
- `import.meta.env` 是 Vite 的标准 API，与构建工具深度集成
- 环境变量在构建时注入，性能开销为零

**Alternatives considered**:
- 使用第三方库（如 `dotenv`）：增加了依赖，且可能与 Vite 的机制冲突
- 自定义环境变量加载机制：重复造轮子，维护成本高

### Decision: 封装 Env 工具类而非直接使用 import.meta.env
**What**: 创建 `src/utils/env.ts` 工具类，封装环境变量访问逻辑。

**Why**:
- 提供统一的 API，简化使用
- 支持类型转换（字符串转数字、布尔值）
- 提供环境判断的便捷方法
- 便于未来扩展（如添加验证、默认值处理等）

**Alternatives considered**:
- 直接使用 `import.meta.env`：代码分散，缺乏统一性
- 使用组合式函数（如 `useEnv()`）：对于工具类场景，静态方法更合适

### Decision: 支持三种环境（dev、uat、prod）
**What**: 在 `package.json` 中提供 `dev:dev`、`dev:uat`、`build:dev`、`build:uat`、`build:prod` 等命令。

**Why**:
- 覆盖企业级项目的常见环境需求
- 开发环境通常不连接生产环境，因此不提供 `dev:prod` 命令
- 保持简单，避免过度设计

**Alternatives considered**:
- 支持更多环境（如 sit、poc）：根据实际需求可以扩展，当前保持最小集
- 使用环境变量而非 mode：Vite 的 mode 机制更符合约定

### Decision: 在 env.d.ts 中定义类型而非自动生成
**What**: 手动在 `env.d.ts` 中定义 `ImportMetaEnv` 接口。

**Why**:
- 类型定义文件简单，手动维护成本低
- 可以添加注释说明每个环境变量的用途
- 避免自动生成带来的复杂性

**Alternatives considered**:
- 自动生成类型定义：需要额外的工具和配置，当前需求下不必要
- 使用类型推断：TypeScript 无法推断 `import.meta.env` 的自定义属性类型

### Decision: 在 vite.config.ts 中使用 loadEnv
**What**: 使用 Vite 提供的 `loadEnv` 函数在配置文件中加载环境变量。

**Why**:
- `vite.config.ts` 运行在 Node.js 环境，无法使用 `import.meta.env`
- `loadEnv` 是 Vite 官方提供的解决方案
- 可以根据 mode 动态加载对应的环境变量文件

**Alternatives considered**:
- 使用 `process.env`：无法利用 Vite 的环境变量文件机制
- 手动读取 `.env` 文件：重复实现，且无法处理优先级

## Risks / Trade-offs

### Risk: 环境变量文件可能被误提交到版本控制
**Mitigation**: 
- `.env.local` 和 `.env.[mode].local` 文件默认已在 `.gitignore` 中忽略
- 提供 `.env.example` 文件作为模板，不包含敏感信息

### Risk: 环境变量类型定义可能不同步
**Mitigation**:
- 在文档中说明需要同步更新 `env.d.ts` 和 `.env` 文件
- 考虑未来添加类型检查工具（非当前范围）

### Trade-off: 工具类封装 vs 直接使用
**Trade-off**: 封装工具类增加了抽象层，但提供了更好的开发体验和未来扩展性。选择封装是因为收益大于成本。

## Migration Plan

### 现有代码迁移
1. 查找项目中所有直接使用 `import.meta.env` 的地方
2. 逐步替换为 `Env` 工具类的方法
3. 更新类型定义，确保类型安全

### 向后兼容
- `import.meta.env` 仍然可用，不会破坏现有代码
- 迁移是渐进式的，可以逐步进行

## Open Questions

- 是否需要添加环境变量验证机制？（当前不实现）
- 是否需要支持环境变量的默认值？（当前通过 `Env.get()` 的 `defaultValue` 参数支持）
- 是否需要支持环境变量的文档生成？（当前不实现）
