<template>
  <div class="cluster-nodes-page">
    <!-- 页面标题区域 -->
    <div class="page-title-section animate-in fade-in slide-in-from-top-4 duration-500">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon icon="mdi:server-network" class="text-2xl" />
        </div>
        <h1 class="page-title">{{ $t('cluster.list.title') }}</h1>
      </div>
    </div>

    <!-- 查询表单区域 -->
    <Card class="search-card animate-in fade-in slide-in-from-top-6 duration-700">
      <CardContent class="p-5">
        <div class="search-form-layout">
          <div class="search-inputs-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div class="search-field">
              <Label class="field-label">{{ $t('cluster.list.search.nodeIp') }}</Label>
              <div class="input-control">
                <Icon type="uno" icon="i-mdi-magnify" class="control-icon" />
                <Input
                  v-model="queryParams.keyword"
                  :placeholder="$t('cluster.list.search.nodeIpPlaceholder')"
                  class="compact-input"
                  @keyup.enter="handleSearch"
                />
              </div>
            </div>
          </div>
          <div class="search-buttons">
            <Button @click="handleSearch" :disabled="loading" class="btn-search shadow-sm">
              <Icon v-if="loading" type="uno" icon="i-mdi-loading" class="mr-2 animate-spin" />
              {{ $t('cluster.list.search.query') }}
            </Button>
            <Button variant="outline" class="btn-reset" @click="handleReset">
              {{ $t('cluster.list.search.reset') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 节点列表表格 -->
    <Card class="table-card border-none shadow-sm">
      <CardContent class="p-0 relative">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>{{ $t('cluster.list.table.loading') }}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30">
              <TableHead>{{ $t('cluster.list.table.nodeIp') }}</TableHead>
              <TableHead>{{ $t('cluster.list.table.nodeState') }}</TableHead>
              <TableHead>{{ $t('cluster.list.table.extendInfo') }}</TableHead>
              <TableHead>{{ $t('cluster.list.table.operation') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="nodeList.length > 0">
              <TableRow
                v-for="node in nodeList"
                :key="node.address"
                class="transition-all hover:bg-muted/30 group/row"
              >
                <TableCell>
                  <div class="font-mono text-sm font-semibold">{{ node.address }}</div>
                </TableCell>
                <TableCell>
                  <Badge :variant="getStateVariant(node.state)" :class="getStateClass(node.state)" class="font-bold">
                    {{ node.state }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" class="text-primary hover:bg-primary/10 h-8 gap-1" @click="viewExtendInfo(node)">
                    <Icon type="uno" icon="i-mdi-information-outline" class="text-base" />
                    {{ $t('cluster.list.table.extendInfo') }}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="text-destructive hover:bg-destructive/10 h-8"
                    @click="handleLeave(node)"
                  >
                    {{ $t('cluster.list.table.leave') }}
                  </Button>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="!loading">
              <TableCell colspan="4" class="h-64 text-center">
                <div class="flex flex-col items-center justify-center text-muted-foreground">
                  <Icon type="uno" icon="i-mdi-server-off" class="text-5xl mb-2 opacity-20" />
                  <p>{{ $t('cluster.list.table.empty') }}</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- 分页 -->
        <div v-if="totalCount > 0" class="pagination-container">
          <div class="pagination-info">
            {{ $t('config.pagination.itemInfo', {
               start: ((queryParams.pageNo || 1) - 1) * (queryParams.pageSize || 10) + 1,
               end: Math.min((queryParams.pageNo || 1) * (queryParams.pageSize || 10), totalCount),
               total: totalCount
            }) }}
          </div>
          <div class="pagination-controls">
            <div class="page-size-picker">
              <span class="text-xs text-muted-foreground">{{ $t('config.pagination.pageSize') }}</span>
              <PageSizeSelector v-model="queryParams.pageSize" @update:model-value="handlePageSizeChange" />
            </div>
            <div class="page-navigation">
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                :disabled="queryParams.pageNo === 1"
                @click="handlePageChange(queryParams.pageNo - 1)"
              >
                <Icon type="uno" icon="i-mdi-chevron-left" />
              </Button>
              <div class="page-numbers">
                <span class="current-page">{{ queryParams.pageNo }}</span>
                <span class="page-divider">/</span>
                <span class="total-pages">{{ Math.ceil(totalCount / queryParams.pageSize) }}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                :disabled="queryParams.pageNo >= Math.ceil(totalCount / queryParams.pageSize)"
                @click="handlePageChange(queryParams.pageNo + 1)"
              >
                <Icon type="uno" icon="i-mdi-chevron-right" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 节点元数据 Dialog -->
    <Dialog v-model="infoDialogOpen">
      <DialogContent class="w-[800px] max-w-[95vw] bg-background rounded-2xl shadow-2xl border-none">
        <DialogHeader>
          <DialogTitle class="text-xl font-bold flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Icon type="uno" icon="i-mdi-information-outline" />
            </div>
            {{ $t('cluster.list.table.extendInfo') }}
          </DialogTitle>
          <DialogDescription class="font-mono">{{ selectedNode?.address }}</DialogDescription>
        </DialogHeader>
        <div class="mt-4 bg-muted/30 p-5 rounded-xl border border-muted overflow-auto max-h-[60vh]">
          <pre class="text-xs font-mono leading-relaxed">{{ JSON.stringify(selectedNode?.extendInfo, null, 2) }}</pre>
        </div>
        <DialogFooter class="mt-6">
          <Button variant="outline" class="rounded-lg" @click="infoDialogOpen = false">
            {{ $t('config.history.action.return') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { clusterService, type ClusterNode } from '@/services/cluster/cluster-service'
import { confirm, alertError, alertSuccess } from '@/utils/dialog'

const { t } = useI18n()

definePage({
  meta: {
    locales: ['cluster', 'config'],
  },
})

defineOptions({
  name: 'ClusterNodes'
})


// 查询参数
const queryParams = reactive({
  keyword: '',
  pageNo: 1,
  pageSize: 10,
})

const loading = ref(false)
const nodeList = ref<ClusterNode[]>([])
const totalCount = ref(0)

// 详情 Dialog
const infoDialogOpen = ref(false)
const selectedNode = ref<ClusterNode | null>(null)

// 获取列表
const fetchNodeList = async () => {
  loading.value = true
  try {
    const res = await clusterService.getNodeList({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      keyword: queryParams.keyword.trim()
    })
    if (Array.isArray(res)) {
      nodeList.value = res
      totalCount.value = res.length
    } else {
      nodeList.value = res.data || []
      totalCount.value = res.count || (res.data ? res.data.length : 0)
    }
  } catch (err) {
    console.error(err)
    alertError(t('cluster.list.message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.pageNo = 1
  fetchNodeList()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.pageNo = 1
  fetchNodeList()
}

// 分页
const handlePageChange = (page: number) => {
  queryParams.pageNo = page
  fetchNodeList()
}

const handlePageSizeChange = (val: string | number) => {
  queryParams.pageSize = Number(val)
  queryParams.pageNo = 1
  fetchNodeList()
}



// 状态样式
const getStateVariant = (state?: string) => {
  if (state === 'UP') return 'default'
  if (state === 'DOWN') return 'destructive'
  return 'secondary'
}

const getStateClass = (state?: string) => {
  if (state === 'SUSPICIOUS') return 'bg-orange-500/10 text-orange-600 border-orange-200'
  if (state === 'UP') return 'bg-green-500/10 text-green-600 border-green-200'
  return ''
}

// 查看详情
const viewExtendInfo = (node: ClusterNode) => {
  selectedNode.value = node
  infoDialogOpen.value = true
}

// 下线节点
const handleLeave = async (node: ClusterNode) => {
  const ok = await confirm(
    t('cluster.list.message.leaveConfirmContent', { node: node.address }),
    t('cluster.list.message.leaveConfirmTitle')
  )

  if (ok) {
    try {
      loading.value = true
      await clusterService.leave({ nodes: [node.address] })
      alertSuccess(t('cluster.list.message.leaveSuccess'))
      fetchNodeList()
    } catch (err) {
      console.error(err)
      alertError(t('cluster.list.message.leaveFailed'))
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => {
  fetchNodeList()
})
</script>

<style scoped lang="scss">
.cluster-nodes-page {
  @apply p-6 min-h-screen relative;
  background-color: var(--wm-bg-color-page);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, var(--wm-color-primary-light-9) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
    opacity: 0.5;
  }
}


.page-title-section {
  @apply mb-6;
  .page-title {
    @apply text-2xl font-bold tracking-tight mb-0;
    color: var(--wm-color-text-primary);
  }
}

.search-card {
  @apply mb-6 border-none shadow-sm rounded-xl overflow-hidden;
}

.search-form-layout {
  @apply flex flex-col xl:flex-row xl:items-end gap-5;
}

.search-inputs-grid {
  @apply grid gap-4 flex-1;
}

.search-field {
  @apply flex flex-col gap-1.5;
  .field-label {
    @apply text-sm font-semibold text-muted-foreground ml-0.5;
  }
}

.input-control {
  @apply relative;
  .compact-input {
    @apply h-10 pl-9 text-sm rounded-lg transition-all border-muted;
    background-color: var(--wm-bg-color-page);
    &:focus {
      @apply ring-2 ring-primary/10 border-primary shadow-sm;
      background-color: var(--wm-bg-color-base);
    }
  }
  .control-icon {
    @apply absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60;
  }
}

.search-buttons {
  @apply flex items-center gap-2.5 justify-end xl:mb-0.5;
}

.btn-search {
  @apply h-10 px-6 rounded-lg font-semibold bg-primary text-white transition-all border-2 border-transparent;
  &:hover {
    @apply opacity-90 shadow-sm;
    transform: translateY(-1px);
  }
}

.btn-reset {
  @apply h-10 px-6 rounded-lg font-medium border-2 transition-all;
  border-color: var(--wm-border-color-base);
  color: var(--wm-color-text-regular);
  &:hover {
    @apply bg-muted/50 border-muted-foreground/30;
    transform: translateY(-1px);
  }
}

.table-card {
  @apply overflow-hidden rounded-xl border border-muted/20 shadow-sm relative z-10;
  :deep(th) {
    @apply py-3 px-4 bg-muted/30 font-bold text-sm !important;
  }
  :deep(td) {
    @apply py-2 px-4 text-sm !important;
    height: 60px !important;
  }
}

.loading-overlay {
  @apply absolute inset-0 z-50 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl;
  background-color: rgba(255, 255, 255, 0.4);
}

.pagination-container {
  @apply p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4;
}

.pagination-info {
  @apply text-sm text-muted-foreground font-medium;
}

.pagination-controls {
  @apply flex items-center gap-6;
}

.page-size-picker {
  @apply flex items-center gap-2;
}

.page-navigation {
  @apply flex items-center gap-2;
}

.page-numbers {
  @apply flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/50 text-sm font-bold;
  .current-page { color: var(--wm-color-primary); }
  .page-divider { @apply opacity-30; }
}

.loading-spinner {
  @apply w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4;
}
</style>

