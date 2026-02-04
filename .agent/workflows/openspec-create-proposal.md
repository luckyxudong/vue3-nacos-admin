---
description: 创建 OpenSpec 变更提案
---

# 创建 OpenSpec 变更提案

引导创建新的 OpenSpec 变更提案，遵循规范驱动开发流程。

## 前置检查

// turbo

1. 查看现有规范，避免重复

```bash
openspec list --specs
```

// turbo

2. 查看活动变更，避免冲突

```bash
openspec list
```

3. 阅读项目规范

- 查看 `openspec/project.md` 了解项目约定
- 查看 `openspec/AGENTS.md` 了解 OpenSpec 使用规范

## 创建提案

4. 与用户确认以下信息：
   - 变更的目的（Why）
   - 变更的内容（What）
   - 影响的范围（Impact）
   - 变更 ID（kebab-case，verb-led，如 `add-user-profile`）

5. 创建变更目录结构

```bash
mkdir -p openspec/changes/<change-id>/specs
```

6. 创建 `proposal.md` 文件，包含：
   - Why（1-2 句话说明问题/机会）
   - What Changes（变更列表，标记破坏性变更）
   - Impact（影响的规范和代码）

7. 创建 `tasks.md` 文件，包含：
   - 实现步骤清单（使用 `- [ ]` 格式）
   - 按逻辑顺序组织任务

8. 如果需要，创建 `design.md` 文件（满足以下条件之一）：
   - 跨服务/模块变更或新架构模式
   - 新外部依赖或重大数据模型变更
   - 安全、性能或迁移复杂性
   - 技术决策需要在编码前明确

9. 创建规范增量文件 `specs/<capability>/spec.md`，使用：
   - `## ADDED Requirements` - 新能力
   - `## MODIFIED Requirements` - 变更行为
   - `## REMOVED Requirements` - 废弃功能
   - `## RENAMED Requirements` - 名称变更

10. 每个需求必须包含至少一个场景：

```markdown
#### Scenario: 场景名称

- **WHEN** 条件
- **THEN** 期望结果
```

## 验证

11. 验证变更提案

```bash
openspec validate <change-id> --strict --no-interactive
```

12. 如果验证失败，根据错误信息修复问题，然后重新验证

## 完成

13. 提案创建完成，等待审批后再开始实现
