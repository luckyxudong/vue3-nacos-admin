---
description: 归档已完成的 OpenSpec 变更
---

# 归档 OpenSpec 变更

将已部署的变更归档到 `changes/archive/` 目录。

## 前置条件

1. 确认变更已经：
   - 完成所有实现任务
   - 通过测试
   - 已部署到目标环境

## 步骤

2. 询问用户要归档的变更 ID

3. 确认是否需要更新规范：
   - 如果变更涉及新功能或修改现有功能 → 需要更新规范
   - 如果仅是工具或配置变更 → 使用 `--skip-specs` 跳过规范更新

// turbo

4. 归档变更（更新规范）

```bash
openspec archive <change-id> --yes
```

或者（跳过规范更新）

```bash
openspec archive <change-id> --skip-specs --yes
```

// turbo

5. 验证归档后的状态

```bash
openspec validate --strict --no-interactive
```

6. 确认归档结果：
   - 变更已移动到 `changes/archive/YYYY-MM-DD-<change-id>/`
   - 如果未使用 `--skip-specs`，规范已更新到 `specs/` 目录
   - 验证通过

## 完成

7. 归档完成，可以提交代码到版本控制系统
