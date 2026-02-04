# Design: shadcn-vue 集成设计

## Context

项目当前已具备：
- Vue 3 + TypeScript + Vite 技术栈
- UnoCSS（通过 presetWind4，与 Tailwind CSS 兼容）
- SCSS 设计令牌系统（CSS 变量）
- 组件自动注册系统（`unplugin-vue-components`）
- 主题切换支持（通过 `data-theme` 属性）

shadcn-vue 是一个组件代码分发平台，需要：
- `clsx` 和 `tailwind-merge` 用于类名合并
- `components.json` 配置文件
- `cn` 工具函数
- CSS 变量定义
- 组件目录（`src/components/ui/`）

## Goals / Non-Goals

### Goals
- 完整集成 shadcn-vue 组件系统
- 保持与现有设计令牌系统的兼容性
- 确保组件自动注册系统正常工作
- 支持深色/浅色主题切换
- 保持类型安全

### Non-Goals
- 不强制替换现有组件系统
- 不修改现有设计令牌的核心定义
- 不强制使用所有 shadcn-vue 组件

## Decisions

### Decision: 使用 zinc 作为基础色系
**选择**：使用 `zinc` 作为 shadcn-vue 的基础色系

**理由**：
- `zinc` 是中性色系，与项目现有的中性色系统兼容
- shadcn-vue 默认支持 zinc 色系
- 可以更好地与项目现有的设计令牌系统集成

**替代方案**：
- 使用其他色系（如 slate、gray）需要额外的颜色映射工作

### Decision: 使用 CSS 变量而非硬编码颜色
**选择**：在 `_shadcn.scss` 中使用 CSS 变量定义主题

**理由**：
- 与项目现有的设计令牌系统保持一致
- 支持主题切换（深色/浅色模式）
- 便于后续与项目设计令牌映射

**实现方式**：
- 在 `:root` 中定义浅色主题变量
- 在 `[data-theme='dark']` 中定义深色主题变量
- 使用 SCSS 变量定义颜色值，然后映射到 CSS 变量

### Decision: cn 工具函数位置
**选择**：将 `cn` 函数放在 `src/lib/utils.ts`

**理由**：
- 符合 shadcn-vue 的约定（`@/lib/utils`）
- `lib` 目录通常用于工具函数和库代码
- 与项目现有的工具函数组织方式一致

**配置**：
- `components.json` 中设置 `aliases.utils` 为 `@/lib/utils`
- TypeScript 路径别名已配置 `@` 指向 `src`

### Decision: UnoCSS 主题映射（可选）
**选择**：可选地将 shadcn-vue CSS 变量映射到 UnoCSS 主题

**理由**：
- shadcn-vue 组件主要使用 CSS 变量，不依赖 UnoCSS 主题配置
- 映射到 UnoCSS 主题可以提供额外的工具类支持
- 保持灵活性，不强制要求

**实现方式**：
- 在 `uno.config.ts` 的 `theme.colors` 中添加变量映射
- 在 `theme.borderRadius` 中添加 `DEFAULT: 'var(--radius)'`

### Decision: 组件目录结构
**选择**：shadcn-vue 组件安装在 `src/components/ui/` 目录

**理由**：
- 符合 shadcn-vue 的默认约定
- 与项目现有的组件目录结构兼容
- 组件自动注册系统已配置 `deep: true`，会自动扫描子目录

**配置**：
- `components.json` 中设置 `aliases.components` 为 `@/components`
- shadcn-vue CLI 会自动将组件安装到 `src/components/ui/` 子目录

### Decision: 组件自动注册集成
**选择**：利用现有的组件自动注册系统

**理由**：
- 项目已配置 `unplugin-vue-components`，支持深度扫描
- shadcn-vue 组件会自动被识别和注册
- 无需手动导入，保持开发体验一致性

**验证**：
- 确认 `deep: true` 配置已启用
- 确认组件类型定义自动生成（`components.d.ts`）

## Risks / Trade-offs

### Risk: 设计令牌冲突
**风险**：shadcn-vue 的 CSS 变量可能与项目现有的设计令牌冲突

**缓解措施**：
- shadcn-vue 使用独立的变量命名空间（如 `--background`、`--primary`）
- 项目设计令牌使用不同的命名空间（如 `--wm-color-primary`）
- 可以通过映射将两者关联，但不强制

### Risk: UnoCSS 兼容性
**风险**：shadcn-vue 使用 Tailwind CSS 类名，可能与 UnoCSS 不完全兼容

**缓解措施**：
- 项目使用 `presetWind4`，提供 Tailwind CSS 兼容的工具类
- shadcn-vue 组件主要使用 CSS 变量，对工具类的依赖较少
- 测试验证组件在 UnoCSS 环境下正常工作

### Risk: 组件更新和维护
**风险**：shadcn-vue 组件代码直接存在于项目中，更新需要手动操作

**缓解措施**：
- 文档中说明组件更新流程
- 建议对组件进行自定义修改时添加注释
- 使用版本控制跟踪组件变更

## Migration Plan

### 步骤 1: 安装依赖和初始化
1. 安装 `clsx` 和 `tailwind-merge`
2. 运行 shadcn-vue 初始化命令
3. 配置 `components.json`

### 步骤 2: 创建工具函数和样式
1. 创建 `cn` 工具函数
2. 创建 shadcn-vue CSS 变量文件
3. 导入 CSS 变量到样式系统

### 步骤 3: 可选配置
1. 更新 UnoCSS 配置（可选）
2. 验证组件自动注册

### 步骤 4: 测试和验证
1. 安装测试组件（如 Button）
2. 验证组件使用和样式
3. 验证主题切换

### 回滚计划
如果集成出现问题：
1. 删除 `components.json`
2. 删除 `src/lib/utils.ts`
3. 删除 `src/assets/scss/settings/_shadcn.scss`
4. 从 `package.json` 移除依赖
5. 恢复 `src/assets/scss/settings/index.scss`

## Open Questions

- [ ] 是否需要将 shadcn-vue 的 CSS 变量映射到项目现有的设计令牌？
- [ ] 是否需要为所有 shadcn-vue 组件创建包装组件？
- [ ] 如何处理 shadcn-vue 组件的自定义修改和更新？
