export default {
  list: {
    title: 'Cluster Node List',
    search: {
      nodeIp: 'Node IP',
      nodeIpPlaceholder: 'Please enter node IP',
      query: 'Query',
      reset: 'Reset',
    },
    table: {
      nodeIp: 'Node Address',
      nodeState: 'State',
      extendInfo: 'Node Metadata',
      operation: 'Operation',
      leave: 'Offline',
      empty: 'No cluster node data',
      loading: 'Loading...',
    },
    message: {
      leaveConfirmTitle: 'Confirm Offline',
      leaveConfirmContent: 'Are you sure you want to offline node {node}? It will be removed from the cluster.',
      leaveSuccess: 'Node offlined successfully',
      leaveFailed: 'Node offline failed',
      fetchFailed: 'Failed to fetch cluster node list',
    }
  }
}
