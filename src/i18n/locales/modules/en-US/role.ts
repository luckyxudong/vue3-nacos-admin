export default {
  title: 'Role Management',
  search: {
    username: 'Username',
    usernamePlaceholder: 'Enter username',
    role: 'Role',
    rolePlaceholder: 'Enter role name',
    query: 'Query',
    reset: 'Reset',
  },
  table: {
    role: 'Role',
    username: 'Username',
    operation: 'Operation',
  },
  action: {
    bind: 'Bind Role',
    delete: 'Delete',
  },
  dialog: {
    bindTitle: 'Bind Role',
    deleteTitle: 'Delete Confirmation',
    deleteContent: 'Are you sure you want to delete role binding {role} - {username}?',
    roleLabel: 'Role',
    usernameLabel: 'Username',
    rolePlaceholder: 'Enter role name',
    usernamePlaceholder: 'Enter username',
    roleRequired: 'Role name is required',
    usernameRequired: 'Username is required',
    confirmBind: 'Confirm Bind',
  },
  message: {
    bindSuccess: 'Role bound successfully',
    bindFailed: 'Failed to bind role',
    deleteSuccess: 'Deleted successfully',
    deleteFailed: 'Failed to delete record',
    fetchFailed: 'Failed to fetch role list',
  }
}
