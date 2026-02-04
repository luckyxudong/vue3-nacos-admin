export default {
  list: {
    title: '集群节点列表',
    search: {
      nodeIp: '节点 IP',
      nodeIpPlaceholder: '请输入节点 IP',
      query: '查询',
      reset: '重置',
    },
    table: {
      nodeIp: '节点地址',
      nodeState: '状态',
      extendInfo: '节点元数据',
      operation: '操作',
      leave: '下线',
      empty: '暂无集群节点数据',
      loading: '加载中...',
    },
    message: {
      leaveConfirmTitle: '确定要下线该节点吗？',
      leaveConfirmContent: '确定要下线节点 {node} 吗？下线后该节点将从集群中移除。',
      leaveSuccess: '节点下线成功',
      leaveFailed: '节点下线失败',
      fetchFailed: '获取集群节点列表失败',
    }
  }
}
