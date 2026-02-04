## 1. Mock 数据优化

- [x] 1.1 重构 `mock/config.ts`，将 `configList` 改为按 tenant 分组的结构（`configListByTenant: Record<string, Config[]>`）
- [x] 1.2 添加 tenant 数据初始化函数，为每个命名空间生成独立的配置数据（30-50 条）
- [x] 1.3 实现 tenant 过滤逻辑，根据 `tenant` 参数获取对应命名空间的配置列表
- [x] 1.4 实现模糊搜索逻辑，处理通配符 `*`（当 `search=blur` 时）
- [x] 1.5 实现多条件组合过滤（dataId, group, appName, config_tags, types, config_detail）
- [x] 1.6 实现分页处理逻辑（先过滤，再分页）
- [x] 1.7 更新 CRUD 操作，确保创建/更新/删除操作按 tenant 隔离

## 2. shadcn-vue 组件安装

- [x] 2.1 手动安装 table 组件（Table, TableHeader, TableBody, TableRow, TableHead, TableCell）
- [x] 2.2 手动安装 select 组件（Select）
- [x] 2.3 手动安装 switch 组件（Switch）
- [x] 2.4 手动安装 pagination 组件（Pagination, PaginationContent, PaginationItem, PaginationLink）
- [x] 2.5 手动安装 form 组件（Form, FormItem）
- [x] 2.6 手动安装 dropdown-menu 组件（DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem）
- [x] 2.7 （可选）手动安装 badge 组件（Badge）
- [x] 2.8 （可选）手动安装 dialog 组件（Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter）
- [x] 2.9 （可选）安装 combobox 组件（暂未实现，可后续添加）

## 3. 配置列表页面实现

- [x] 3.1 创建配置列表页面文件 `src/pages/config/list.vue`（注意：路径为 config 而非 configuration）
- [x] 3.2 实现页面标题和命名空间选择组件
- [x] 3.3 实现查询表单区域（Data ID、Group、模糊搜索开关）
- [x] 3.4 实现高级查询区域（可展开/收起，包含应用名称、标签、类型、配置内容）
- [x] 3.5 实现配置列表表格（Data ID、Group、类型、应用、操作列）
- [x] 3.6 实现表格排序功能（按列排序）
- [x] 3.7 实现表格行选择功能（多选）
- [x] 3.8 实现分页组件（页码切换、每页数量选择、总数显示）
- [x] 3.9 实现批量操作栏（批量删除、批量克隆、导出选中）
- [x] 3.10 实现操作列功能（详情、编辑、删除、更多菜单）
- [x] 3.11 集成 `configService.getList()` 调用接口
- [x] 3.12 实现加载状态和错误状态处理
- [x] 3.13 实现命名空间切换时重新加载数据

## 4. 测试验证

- [ ] 4.1 测试 tenant 隔离功能（不同 tenant 返回不同数据）
- [ ] 4.2 测试模糊搜索功能（`search=blur` 时支持通配符）
- [ ] 4.3 测试精确搜索功能（`search=accurate` 时完全匹配）
- [ ] 4.4 测试多条件组合查询功能
- [ ] 4.5 测试分页功能
- [ ] 4.6 测试表格排序功能
- [ ] 4.7 测试批量操作功能
- [ ] 4.8 测试命名空间切换功能
