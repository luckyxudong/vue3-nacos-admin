export default {
  title: '权限管理',
  search: {
    role: '角色',
    rolePlaceholder: '请输入角色名',
    query: '查询',
    reset: '重置',
  },
  table: {
    role: '角色',
    resource: '资源',
    action: '动作',
    operation: '操作',
  },
  action: {
    add: '添加权限',
    delete: '删除',
    readOnly: '只读',
    writeOnly: '只写',
    readWrite: '读写',
  },
  dialog: {
    addTitle: '添加权限',
    deleteTitle: '删除确认',
    deleteContent: '确定要删除权限 {role} - {resource} - {action} 吗？',
    roleLabel: '角色',
    resourceLabel: '资源',
    actionLabel: '动作',
    rolePlaceholder: '请输入角色名',
    resourcePlaceholder: '请选择资源',
    actionPlaceholder: '请选择动作',
    roleRequired: '角色名不能为空',
    resourceRequired: '资源不能为空',
    actionRequired: '动作不能为空',
    confirmAdd: '确认添加',
  },
  message: {
    addSuccess: '添加权限成功',
    addFailed: '添加权限失败',
    deleteSuccess: '删除权限成功',
    deleteFailed: '删除权限失败',
    fetchFailed: '获取权限列表失败',
  }
}
