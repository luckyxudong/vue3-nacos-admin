export default {
  title: 'Permission Management',
  search: {
    role: 'Role',
    rolePlaceholder: 'Enter role name',
    query: 'Query',
    reset: 'Reset',
  },
  table: {
    role: 'Role',
    resource: 'Resource',
    action: 'Action',
    operation: 'Operation',
  },
  action: {
    add: 'Add Permission',
    delete: 'Delete',
    readOnly: 'Read Only',
    writeOnly: 'Write Only',
    readWrite: 'Read & Write',
  },
  dialog: {
    addTitle: 'Add Permission',
    deleteTitle: 'Delete Confirmation',
    deleteContent: 'Are you sure you want to delete permission {role} - {resource} - {action}?',
    roleLabel: 'Role',
    resourceLabel: 'Resource',
    actionLabel: 'Action',
    rolePlaceholder: 'Enter role name',
    resourcePlaceholder: 'Select resource',
    actionPlaceholder: 'Select action',
    roleRequired: 'Role name is required',
    resourceRequired: 'Resource is required',
    actionRequired: 'Action is required',
    confirmAdd: 'Confirm Add',
  },
  message: {
    addSuccess: 'Permission added successfully',
    addFailed: 'Failed to add permission',
    deleteSuccess: 'Permission deleted successfully',
    deleteFailed: 'Failed to delete permission',
    fetchFailed: 'Failed to fetch permission list',
  }
}
