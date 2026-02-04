---
description: 验证 OpenSpec 变更或规范
---

# 验证 OpenSpec

验证变更或规范的格式和内容是否符合规范。

## 步骤

1. 询问用户要验证的项目（变更 ID、规范 ID，或留空验证所有）

// turbo

2. 执行严格验证

```bash
openspec validate <item-name> --strict --no-interactive
```

如果用户未指定项目名称，使用：

```bash
openspec validate --strict --no-interactive
```

3. 如果验证失败：
   - 查看错误信息
   - 根据错误类型提供修复建议
   - 常见错误：
     - "Change must have at least one delta" - 检查 `specs/` 目录是否存在且有 `.md` 文件
     - "Requirement must have at least one scenario" - 检查场景格式是否为 `#### Scenario:`
     - 场景解析失败 - 确保使用 4 个 `#` 号，不要用粗体或列表

4. 修复后重新验证，直到通过
