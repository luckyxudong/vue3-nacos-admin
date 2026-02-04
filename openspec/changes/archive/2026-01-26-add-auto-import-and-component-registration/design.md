# Design: 自动导入和组件自动注册架构设计

## Context

Vue3 模板项目在开发过程中需要频繁手动编写 `import` 语句来导入 Vue、Vue Router、Pinia 等核心库的 API，以及手动导入组件。这些重复性的工作降低了开发效率，也容易产生遗漏和冲突。

当前项目已集成：
- Vue 3 组合式 API
- Vue Router（通过 `unplugin-vue-router` 实现自动路由）
- Pinia 状态管理
- TypeScript 类型系统

需要解决的问题：
1. 减少样板代码，提升开发效率
2. 避免手动导入导致的遗漏和错误
3. 提供更好的开发体验和类型安全支持
4. 保持与项目现有架构模式一致

## Goals / Non-Goals

### Goals
- 实现 Vue、Vue Router、Pinia 等核心库 API 的自动导入
- 实现 `src/components` 目录下组件的自动注册
- 集成 VueUse 工具集，提供丰富的组合式 API hooks
- 确保 TypeScript 类型安全，自动生成类型定义文件
- 保持与项目现有配置和架构模式一致
- 支持多种文件类型（`.vue`, `.ts`, `.tsx`, `.js`, `.jsx`, `.md`）

### Non-Goals
- 不改变现有的代码结构和目录组织方式
- 不强制使用自动导入，开发者仍可选择手动导入
- 不替换现有的模块化注册模式（`install*` 函数）
- 不实现全局组件的自动注册（仅限 `src/components` 目录）

## Decisions

### Decision: 使用 unplugin-auto-import 实现 API 自动导入
**理由**：
- `unplugin-auto-import` 是 unplugin 生态的核心插件，与 Vite 深度集成
- 支持多种构建工具（Vite、Webpack、Rollup 等），具有良好的可移植性
- 自动生成 TypeScript 类型定义文件，确保类型安全
- 支持多种文件类型，包括 Vue SFC、TypeScript、JavaScript、Markdown
- 社区活跃，维护良好，与 Vue 3 生态兼容性好

**替代方案**：
- 手动维护全局导入：需要修改每个文件，工作量大，容易遗漏
- 使用其他自动导入插件：`unplugin-auto-import` 是主流选择，功能完善
- 使用 Vite 的 `optimizeDeps`：仅适用于依赖预构建，不适用于 API 自动导入

### Decision: 使用 unplugin-vue-components 实现组件自动注册
**理由**：
- `unplugin-vue-components` 是 unplugin 生态的组件自动注册插件
- 与 `unplugin-auto-import` 配合使用，提供一致的开发体验
- 支持按需注册，不会增加不必要的打包体积
- 自动生成 TypeScript 类型定义，确保组件类型安全
- 支持深度扫描和灵活的命名空间配置

**替代方案**：
- 手动全局注册组件：需要在 `main.ts` 中逐个注册，不够灵活
- 使用其他组件自动注册方案：`unplugin-vue-components` 是主流选择
- 使用 Vue 3 的 `<script setup>` 手动导入：仍然需要编写 import 语句

### Decision: 集成 VueUse 工具集
**理由**：
- VueUse 提供了 200+ 个实用的组合式 API hooks
- 与 Vue 3 组合式 API 完美契合，提升开发效率
- 通过自动导入机制，无需手动导入即可使用
- 社区活跃，文档完善，质量高
- 支持 Tree-shaking，按需使用不会增加打包体积

**典型用例**：
- `useDark` + `useToggle`：实现暗黑模式切换，支持持久化
- `useStorage`：响应式的本地存储
- `useMouse`、`useScroll`：鼠标和滚动位置监听
- `useDebounce`、`useThrottle`：防抖和节流

**替代方案**：
- 手动实现常用 hooks：重复造轮子，维护成本高
- 使用其他工具库：VueUse 是 Vue 3 生态中最完善的工具集

### Decision: 插件配置选项选择

#### AutoImport 配置
```typescript
AutoImport({
  include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
  imports: ['vue', VueRouterAutoImports, 'pinia', '@vueuse/core'],
})
```

**配置说明**：
- `include`：支持 `.ts`, `.tsx`, `.js`, `.jsx`, `.vue`, `.md` 文件类型
  - 包含 `.md` 文件以支持 Vue 组件文档中的代码示例
- `imports`：配置自动导入的库
  - `'vue'`：Vue 核心 API
  - `VueRouterAutoImports`：使用 `unplugin-vue-router` 提供的自动路由导入（而非 `vue-router`）
  - `'pinia'`：Pinia 状态管理 API
  - `'@vueuse/core'`：VueUse 工具集

#### Components 配置
```typescript
Components({
  deep: true,
  directoryAsNamespace: false,
})
```

**配置说明**：
- `deep: true`：递归扫描 `src/components` 的所有子目录
  - 允许组件组织在子目录中，如 `src/components/form/input.vue`
- `directoryAsNamespace: false`：组件名不包含目录路径
  - `src/components/form/input.vue` 注册为 `Input` 而非 `FormInput`
  - 简化组件使用，避免命名冲突

**替代配置考虑**：
- `directoryAsNamespace: true`：会增加组件名复杂度，不符合简化使用的目标
- `collapseSamePrefixes: true`：可以合并相同前缀，但当前配置已足够

### Decision: 类型定义文件处理方式
**文件位置**：
- `auto-imports.d.ts`：项目根目录
- `components.d.ts`：项目根目录

**TypeScript 配置**：
- 在 `tsconfig.app.json` 的 `include` 数组中添加这两个文件
- 文件会自动生成，无需手动维护
- 文件应添加到 `.gitignore`（可选，但通常建议忽略）

**理由**：
- 自动生成的文件不应提交到版本控制（或至少不应手动编辑）
- 类型定义文件会在开发服务器启动时自动更新
- 确保类型定义与代码保持同步

### Decision: 插件在 Vite 插件数组中的位置
**插件顺序**：
```typescript
plugins: [
  VueRouter({}),           // 必须在 vue() 之前
  vue(),                    // Vue SFC 支持
  vueJsx(),                 // JSX 支持
  vueDevTools(),            // Vue DevTools
  UnoCSS(),                 // UnoCSS
  AutoImport({}),           // 自动导入（位置灵活）
  Components({}),           // 组件自动注册（位置灵活）
  // ... 其他插件
]
```

**注意事项**：
- `VueRouter` 必须在 `vue()` 之前（`unplugin-vue-router` 的要求）
- `AutoImport` 和 `Components` 的位置相对灵活，但建议放在 Vue 相关插件之后
- 确保在需要使用自动导入的文件处理之前加载这些插件

## Risks / Trade-offs

### 风险：依赖增加和构建时间
**风险**：新增多个依赖包，可能增加项目体积和构建时间
**缓解措施**：
- `unplugin-auto-import` 和 `unplugin-vue-components` 是开发依赖，不会打包到生产环境
- `@vueuse/core` 支持 Tree-shaking，只打包使用的 hooks
- 插件在构建时运行，对运行时性能无影响
- 类型定义文件生成是增量更新，不会显著影响构建时间

### 风险：类型定义文件同步问题
**风险**：自动生成的类型定义文件可能与代码不同步
**缓解措施**：
- 类型定义文件在开发服务器启动时自动生成和更新
- 使用 TypeScript 严格模式确保类型检查
- 在 CI/CD 流程中添加类型检查步骤
- 建议将类型定义文件添加到 `.gitignore`，避免版本冲突

### 风险：IDE 支持问题
**风险**：某些 IDE 可能无法正确识别自动导入的 API
**缓解措施**：
- 确保 TypeScript 配置正确包含类型定义文件
- 使用支持 Vue 3 和 TypeScript 的 IDE（如 VSCode + Volar）
- 重启 IDE 或重新加载窗口以确保类型定义生效

### 权衡：自动化 vs 显式性
**权衡**：自动导入减少了样板代码，但可能降低代码的显式性
**决策**：
- 优先考虑开发效率和一致性
- 通过类型定义文件保持类型安全
- 开发者仍可选择手动导入（如果偏好显式性）
- 在代码审查时注意检查自动导入的使用是否合理

### 权衡：组件命名空间 vs 简化使用
**权衡**：`directoryAsNamespace: false` 简化了组件使用，但可能导致命名冲突
**缓解措施**：
- 通过合理的组件目录组织避免命名冲突
- 如果确实需要命名空间，可以修改配置为 `true`
- 在项目规范中明确组件的命名和组织方式

## Migration Plan

### 迁移步骤

#### 阶段 1：依赖安装
1. 安装 `unplugin-auto-import` 开发依赖
2. 安装 `unplugin-vue-components` 开发依赖
3. 安装 `@vueuse/core` 运行时依赖

#### 阶段 2：配置更新
1. 在 `vite.config.ts` 中导入并配置 `AutoImport` 插件
2. 在 `vite.config.ts` 中导入并配置 `Components` 插件
3. 在 `tsconfig.app.json` 的 `include` 中添加 `auto-imports.d.ts`
4. 在 `tsconfig.app.json` 的 `include` 中添加 `components.d.ts`

#### 阶段 3：验证和测试
1. 重启开发服务器，验证类型定义文件自动生成
2. 测试 Vue API 自动导入（如 `ref`, `computed`）
3. 测试 Vue Router API 自动导入（如 `useRouter`, `useRoute`）
4. 测试 Pinia API 自动导入（如 `defineStore`, `storeToRefs`）
5. 测试 VueUse hooks 自动导入（如 `useDark`, `useToggle`）
6. 测试组件自动注册功能

#### 阶段 4：代码迁移（可选）
1. 逐步移除现有代码中的手动 import 语句
2. 移除组件的手动导入语句
3. 更新代码示例和文档

### 回滚计划
如果出现问题，可以按以下步骤回滚：
1. 从 `vite.config.ts` 中移除 `AutoImport` 和 `Components` 插件配置
2. 从 `tsconfig.app.json` 中移除类型定义文件的引用
3. 卸载相关依赖包
4. 恢复手动 import 语句（如果有备份）
5. 删除自动生成的类型定义文件

### 兼容性考虑
- 自动导入功能是向后兼容的，不影响现有的手动导入代码
- 组件自动注册不会影响全局注册的组件
- 开发者可以选择性地使用自动导入功能

## Open Questions

- [ ] 是否需要将 `auto-imports.d.ts` 和 `components.d.ts` 添加到 `.gitignore`？
- [ ] 是否需要为特定目录或文件排除自动导入（如测试文件）？
- [ ] 是否需要支持自定义自动导入规则（如项目特定的工具函数）？
- [ ] 组件自动注册是否需要支持排除某些组件（如内部工具组件）？
- [ ] 是否需要为 VueUse hooks 的使用提供最佳实践指南？
- [ ] 是否需要考虑自动导入对代码审查的影响（如何识别自动导入的 API）？
