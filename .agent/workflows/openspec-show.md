---
description: 查看 OpenSpec 变更或规范详情
---

# 查看 OpenSpec 详情

查看指定变更或规范的详细信息。

## 步骤

1. 询问用户要查看的项目名称（变更 ID 或规范 ID）

// turbo

2. 查看详情

```bash
openspec show <item-name>
```

## 高级选项

如果需要查看 JSON 格式或特定内容：

// turbo

3. 查看变更的增量内容（JSON 格式）

```bash
openspec show <change-id> --json --deltas-only
```

// turbo

4. 查看规范的详细信息（JSON 格式）

```bash
openspec show <spec-id> --type spec --json
```
