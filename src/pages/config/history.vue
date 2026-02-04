<template>
  <div class="history-page">
    <!-- 页面标题区域 -->
    <div class="page-title-section animate-in fade-in slide-in-from-top-4 duration-500">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon icon="mdi:history" class="text-2xl" />
        </div>
        <h1 class="page-title">{{ $t('menu.configHistory') }}</h1>
        <Badge
          variant="secondary"
          class="rounded-full px-4 py-1 text-sm font-semibold transition-colors flex items-center gap-1"
          :class="currentTenant ? 'cursor-pointer hover:bg-muted-foreground/20' : ''"
          @click="handleCopyNamespace"
          :title="currentTenant ? $t('config.message.copySuccess') : ''"
        >
          {{ currentTenantShowName }}
          <Icon v-if="currentTenant" icon="mdi:content-copy" class="ml-1 text-xs opacity-30 hover:opacity-100 transition-opacity" />
        </Badge>
      </div>
    </div>

    <!-- 命名空间快速切换 -->
    <div class="namespace-container animate-in fade-in slide-in-from-top-5 duration-600">
      <div v-if="namespacesLoading" class="namespace-tabs">
        <div v-for="i in 5" :key="i" class="namespace-tab-item skeleton-tab"></div>
      </div>
      <div v-else class="namespace-tabs">
        <div
          v-for="ns in namespaces"
          :key="ns.namespace"
          class="namespace-tab-item"
          :class="{ active: currentTenant === ns.namespace }"
          @click="handleTenantChange(ns.namespace)"
        >
          {{ ns.namespaceShowName }}
        </div>
      </div>
    </div>

    <!-- 查询表单区域 -->
    <Card class="search-card animate-in fade-in slide-in-from-top-6 duration-700">
      <CardContent class="p-5">
        <div class="search-form-layout">
          <div class="search-inputs-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <div class="search-field">
              <Label class="field-label required">{{ $t('config.history.search.dataId') }}</Label>
              <div class="input-control">
                <Icon type="uno" icon="i-mdi-magnify" class="control-icon" />
                <Input v-model="queryParams.dataId" :placeholder="$t('config.history.search.dataIdPlaceholder')" class="compact-input" />
              </div>
            </div>
            <div class="search-field">
              <Label class="field-label required">{{ $t('config.history.search.group') }}</Label>
              <div class="input-control">
                <Icon type="uno" icon="i-mdi-folder-outline" class="control-icon" />
                <Input v-model="queryParams.group" :placeholder="$t('config.history.search.groupPlaceholder')" class="compact-input" />
              </div>
            </div>
          </div>
          <div class="search-buttons">
            <Button @click="handleSearch" :disabled="loading" class="btn-search shadow-sm">
              <Icon v-if="loading" type="uno" icon="i-mdi-loading" class="mr-2 animate-spin" />
              {{ $t('config.search.query') }}
            </Button>
            <Button variant="outline" class="btn-reset" @click="handleReset">
              {{ $t('config.search.reset') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 历史列表表格 -->
    <Card class="table-card border-none shadow-sm">
      <CardContent class="p-0">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>{{ $t('config.table.loading') }}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30">
              <TableHead>Data ID</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>{{ $t('config.history.table.operator') }}</TableHead>
              <TableHead>{{ $t('config.history.dialog.opType') }}</TableHead>
              <TableHead>{{ $t('config.history.table.lastUpdateTime') }}</TableHead>
              <TableHead class="text-left">{{ $t('config.history.table.operations') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="historyList.length > 0">
              <TableRow
                v-for="history in historyList"
                :key="history.id"
                class="transition-all hover:bg-muted/30 group/row"
              >
                <TableCell>
                  <div class="data-id-cell">
                    <span class="font-mono text-sm">{{ history.dataId }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" class="group-tag">{{ history.group }}</Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center text-muted-foreground">
                    {{ history.srcUser || '-' }}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge v-if="history.opType" variant="secondary" class="font-bold text-xs">
                    {{ getOpType(history.opType) }}
                  </Badge>
                  <span v-else class="text-muted-foreground">-</span>
                </TableCell>
                <TableCell>
                  <div class="flex items-center text-muted-foreground">
                    {{ formatTime(history.lastModifiedTime) }}
                  </div>
                </TableCell>
                <TableCell class="action-cell">
                  <div class="action-buttons-row transition-opacity duration-200">
                    <Button variant="ghost" size="sm" class="action-btn text-primary" @click="handleView(history)">
                      {{ $t('config.history.action.details') }}
                    </Button>
                    <span class="action-separator">|</span>
                    <Button variant="ghost" size="sm" class="action-btn text-info" @click="handleRollback(history)">
                      {{ $t('config.history.action.rollback') }}
                    </Button>
                    <span class="action-separator">|</span>
                    <Button variant="ghost" size="sm" class="action-btn text-primary" @click="handleCompare(history)">
                      {{ $t('config.history.action.compare') }}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="!loading">
              <TableCell colspan="5" class="h-64 text-center">
                <div class="flex flex-col items-center justify-center text-muted-foreground">
                  <Icon type="uno" icon="i-mdi-history" class="text-5xl mb-2 opacity-20" />
                  <p v-if="!queryParams.dataId || !queryParams.group">{{ $t('config.history.placeholder.selectConfig') }}</p>
                  <p v-else>{{ $t('config.table.empty') }}</p>
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
              <PageSizeSelector v-model="queryParams.pageSize" @update:model-value="(val: number) => handlePageSizeChange(val)" />
            </div>
            <div class="page-navigation">
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                :disabled="(queryParams.pageNo || 1) === 1"
                @click="handlePageChange((queryParams.pageNo || 1) - 1)"
              >
                <Icon type="uno" icon="i-mdi-chevron-left" />
              </Button>
              <div class="page-numbers">
                <span class="current-page">{{ queryParams.pageNo || 1 }}</span>
                <span class="page-divider">/</span>
                <span class="total-pages">{{ Math.ceil(totalCount / (queryParams.pageSize || 10)) }}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                :disabled="(queryParams.pageNo || 1) >= Math.ceil(totalCount / (queryParams.pageSize || 10))"
                @click="handlePageChange((queryParams.pageNo || 1) + 1)"
              >
                <Icon type="uno" icon="i-mdi-chevron-right" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 详情 Dialog -->
    <Dialog v-model="detailDialogOpen">
      <DialogContent class="config-create-dialog max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader class="px-6 py-4 border-b bg-muted/5">
          <DialogTitle class="flex items-center gap-2 text-xl font-bold text-foreground">
            <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Icon type="uno" :icon="dialogMode === 'rollback' ? 'i-mdi-history' : 'i-mdi-information-outline'" class="text-xl" />
            </div>
             {{ dialogMode === 'rollback' ? $t('config.history.dialog.rollbackTitle') : $t('config.history.dialog.detailTitle') }}
          </DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
            {{ $t('config.dialog.detailDesc') }}
          </DialogDescription>
        </DialogHeader>

        <!-- Meta Info Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-3 px-6 py-4 bg-muted/5 border-b">
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground w-24 shrink-0 uppercase tracking-wider font-semibold">{{ $t('config.history.dialog.namespace') }}</span>
            <span class="text-sm font-medium truncate">{{ currentTenantShowName }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground w-24 shrink-0 uppercase tracking-wider font-semibold">{{ $t('config.history.dialog.srcIp') }}</span>
            <span class="text-sm font-medium truncate">{{ (historyDetail as any)?.srcIp || '-' }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground w-24 shrink-0 uppercase tracking-wider font-semibold">Data ID</span>
            <span class="text-sm font-bold font-mono text-primary">{{ historyDetail?.dataId }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground w-24 shrink-0 uppercase tracking-wider font-semibold">{{ $t('config.history.dialog.opType') }}</span>
            <Badge v-if="(historyDetail as any)?.opType" variant="secondary" class="font-bold text-xs">
                {{ getOpType((historyDetail as any)?.opType) }}
            </Badge>
            <span v-else class="text-sm font-medium">-</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground w-24 shrink-0 uppercase tracking-wider font-semibold">Group</span>
            <span class="text-sm font-medium truncate">{{ historyDetail?.group }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground w-24 shrink-0 uppercase tracking-wider font-semibold">MD5</span>
            <span class="text-sm font-mono opacity-60 truncate block" :title="historyDetail?.md5">{{ historyDetail?.md5 || '-' }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm text-muted-foreground w-24 shrink-0 uppercase tracking-wider font-semibold">{{ $t('config.history.dialog.operator') }}</span>
            <span class="text-sm font-medium">{{ (historyDetail as any)?.srcUser || '-' }}</span>
          </div>
        </div>

        <div class="flex-1 min-h-0 relative overflow-hidden bg-background">
             <MonacoEditor
                v-if="historyDetail"
                :value="historyDetail.content"
                :language="historyDetail.type?.toLowerCase() || 'plaintext'"
                theme="vs-dark"
                :options="{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: 'Fira Code, Consolas, monospace',
                  automaticLayout: true,
                }"
                class="absolute inset-0"
              />
        </div>

        <div class="p-4 border-t bg-muted/5 flex justify-end items-center px-6 gap-3">
            <Button
              v-if="dialogMode === 'rollback'"
              class="min-w-[120px] h-10 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              @click="handleRollbackSubmit"
            >
              <Icon type="uno" icon="i-mdi-history" class="mr-2" />
              {{ $t('config.history.dialog.rollbackAction') }}
            </Button>
            <Button variant="outline" class="min-w-[120px] h-10 font-bold border-2 text-muted-foreground hover:text-foreground transition-colors" @click="detailDialogOpen = false">
              <Icon type="uno" icon="i-mdi-keyboard-return" class="mr-2" />
              {{ $t('config.history.action.return') }}
            </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Diff Editor Dialog -->
    <DiffEditorDialog
      v-model:open="diffDialogOpen"
      :originalContent="originalContent"
      :modifiedContent="modifiedContent"
      :language="diffLanguage"
      :title="$t('config.history.dialog.compareTitle')"
      :description="$t('config.history.dialog.compareDesc')"
      :showConfirm="false"
      :cancelText="$t('config.history.action.return')"
      :primaryCancel="true"
      @confirm="handleRollbackConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

definePage({
  meta: {
    locales: ['config'],
  },
})

defineOptions({
  name: 'ConfigHistory'
})

import { configService } from '@/services/configuration/config-service'
import type { Config, ConfigHistory, ConfigHistoryListReq } from '@/services/configuration/config-service'
import { namespaceService } from '@/services/namespace/namespace-service'
import { confirm, alertError, alertSuccess } from '@/utils/dialog'
import { toastSuccess } from '@/utils/toast'
import MonacoEditor from 'monaco-editor-vue3'
import DiffEditorDialog from '@/components/diff/DiffEditorDialog.vue'

// 查询参数
const queryParams = ref<ConfigHistoryListReq & { tenant?: string }>({
  dataId: '',
  group: '',
  pageNo: 1,
  pageSize: 10,
  search: 'accurate',
  tenant: '',
})

// 当前命名空间
const currentTenant = ref('')
const namespaces = ref<Array<{ namespace: string; namespaceShowName: string }>>([])
const namespacesLoading = ref(true)

const currentTenantShowName = computed(() => {
  const ns = namespaces.value.find(n => n.namespace === currentTenant.value)
  return ns ? ns.namespaceShowName : (currentTenant.value || 'public')
})

// 历史列表数据
const historyList = ref<ConfigHistory[]>([])
const totalCount = ref(0)
const loading = ref(false)

// 详情 Dialog
const detailDialogOpen = ref(false)
const dialogMode = ref<'view' | 'rollback'>('view')
const historyDetail = ref<Config | null>(null)

// Diff Dialog
const diffDialogOpen = ref(false)
const originalContent = ref('') // 历史版本内容
const modifiedContent = ref('') // 最新版本内容
const diffLanguage = ref('plaintext')
const rollbackRecord = ref<ConfigHistory | null>(null)

// 挂载时获取命名空间
onMounted(async () => {
    try {
        const nsList = await namespaceService.getList()
        namespaces.value = nsList.map((n: any) => ({
            namespace: n.namespace || '',
            namespaceShowName: n.namespaceShowName || n.namespace || 'public'
        }))

        // 初始化从 URL 获取参数
        const urlParams = new URLSearchParams(window.location.search)
        currentTenant.value = urlParams.get('namespace') || ''
        queryParams.value.dataId = urlParams.get('dataId') || ''
        queryParams.value.group = urlParams.get('group') || ''

        if (queryParams.value.dataId && queryParams.value.group) {
            handleSearch()
        }
    } finally {
        namespacesLoading.value = false
    }
})

// 监听命名空间切换
const handleTenantChange = (tenant: string) => {
    currentTenant.value = tenant
    handleReset()
}

// 格式化操作类型
const getOpType = (type: string | undefined) => {
    if (!type) return ''
    const typeMap: Record<string, string> = {
        U: t('config.history.dialog.opUpdate'),
        I: t('config.history.dialog.opInsert'),
        D: t('config.history.dialog.opDelete'),
    }
    return typeMap[type] || type
}

// 格式化时间
const formatTime = (time: number | undefined) => {
    if (!time) return '-'
    return new Date(time).toLocaleString()
}

// 查询历史
const handleSearch = async () => {
    // Trim 头尾空格
    queryParams.value.dataId = queryParams.value.dataId?.trim() || ''
    queryParams.value.group = queryParams.value.group?.trim() || ''

    if (!queryParams.value.dataId || !queryParams.value.group) {
        // Nacos 历史查询必须指定 Data ID 和 Group
        return
    }

    loading.value = true
    try {
        queryParams.value.tenant = currentTenant.value
        const res = await configService.getHistoryList(queryParams.value)
        historyList.value = res.pageItems || []
        totalCount.value = res.totalCount || 0
    } catch (err: any) {
        historyList.value = []
        totalCount.value = 0
        // 如果后端返回 400 且包含非法字符提示，给予更友好的提示
        const errorMsg = err?.response?.data || err?.message || ''
        if (errorMsg.includes('illegal characters')) {
            alertError(t('config.dialog.dataIdInvalid'))
        } else {
            console.error(err)
        }
    } finally {
        loading.value = false
    }
}

const handleReset = () => {
    queryParams.value.dataId = ''
    queryParams.value.group = ''
    queryParams.value.pageNo = 1
    historyList.value = []
    totalCount.value = 0
}

const handlePageChange = (pageNo: number) => {
    queryParams.value.pageNo = pageNo
    handleSearch()
}

const handlePageSizeChange = (pageSize: number) => {
    queryParams.value.pageSize = pageSize
    queryParams.value.pageNo = 1
    handleSearch()
}

// 查看详情
const handleView = async (record: ConfigHistory) => {
    try {
        const res = await configService.getHistoryDetail({
            dataId: record.dataId,
            group: record.group,
            nid: String(record.id)
        })
        historyDetail.value = res
        dialogMode.value = 'view'
        detailDialogOpen.value = true
    } catch (err) {
        alertError(t('config.message.fetchDetailFailed'))
    }
}

// 比对
const handleCompare = async (record: ConfigHistory) => {
    try {
        loading.value = true
        // 获取历史版本
        const historyRes = await configService.getHistoryDetail({
            dataId: record.dataId,
            group: record.group,
            nid: String(record.id)
        })
        // 获取最新版本
        const latestRes = await configService.getDetail({
            dataId: record.dataId,
            group: record.group,
            tenant: currentTenant.value
        })

        originalContent.value = historyRes.content || ''
        modifiedContent.value = latestRes.content || ''
        diffLanguage.value = latestRes.type?.toLowerCase() || 'plaintext'
        rollbackRecord.value = record
        diffDialogOpen.value = true
    } catch {
        alertError(t('config.message.fetchDetailFailed'))
    } finally {
        loading.value = false
    }
}

// 回滚 (打开详情框模式)
const handleRollback = async (record: ConfigHistory) => {
    try {
        const res = await configService.getHistoryDetail({
            dataId: record.dataId,
            group: record.group,
            nid: String(record.id)
        })
        historyDetail.value = res
        rollbackRecord.value = record
        dialogMode.value = 'rollback'
        detailDialogOpen.value = true
    } catch (err) {
        alertError(t('config.message.fetchDetailFailed'))
    }
}

// 执行回滚
const handleRollbackSubmit = async () => {
    if (!rollbackRecord.value || !historyDetail.value) return

    const record = rollbackRecord.value
    const isInsert = record.opType === 'I'

    const ok = await confirm(
        h('div', { class: 'space-y-4 pt-4' }, [
            h('p', { class: 'text-sm font-medium leading-relaxed' }, [
                t('config.history.dialog.rollbackConfirmMsg'),
                isInsert ? h('span', { class: 'text-destructive font-bold ml-1' }, t('config.history.dialog.rollbackDeleteTip')) : ''
            ]),
            h('div', { class: 'space-y-2 bg-muted/30 p-4 rounded-lg border border-border/50' }, [
                h('div', { class: 'flex items-baseline gap-3' }, [
                    h('span', { class: 'text-xs text-muted-foreground w-16 shrink-0 font-semibold uppercase tracking-wider' }, 'Data ID'),
                    h('span', { class: 'text-sm text-destructive font-bold font-mono break-all' }, record.dataId)
                ]),
                h('div', { class: 'flex items-baseline gap-3' }, [
                    h('span', { class: 'text-xs text-muted-foreground w-16 shrink-0 font-semibold uppercase tracking-wider' }, 'Group'),
                    h('span', { class: 'text-sm text-destructive font-bold break-all' }, record.group)
                ])
            ])
        ]),
        t('config.history.dialog.rollbackConfirmTitle')
    )

    if (ok) {
        try {
            await configService.rollback({
                dataId: record.dataId,
                group: record.group,
                content: historyDetail.value.content || '',
                appName: historyDetail.value.appName,
                tenant: currentTenant.value
            }, record.opType as any || 'U')

            // 回滚成功弹出提示框
            await alertSuccess(t('config.message.rollbackSuccess'))
            // 停留在当前回滚配置弹出框，刷新列表即可
            handleSearch()
        } catch {
            alertError(t('config.message.rollbackFailed'))
        }
    }
}

// 从比对弹窗确认回滚
const handleRollbackConfirm = () => {
    if (rollbackRecord.value) {
        handleRollback(rollbackRecord.value)
    }
}

// 复制命名空间 ID
const handleCopyNamespace = () => {
    if (!currentTenant.value) return
    navigator.clipboard.writeText(currentTenant.value)
    toastSuccess(t('config.message.copySuccess'))
}
</script>

<style scoped lang="scss">
.history-page {
  @apply p-6 min-h-screen;
  background-color: var(--wm-bg-color-page);
  position: relative;

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

// Micro-animations utilities
.hover-lift {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
}

// 页面标题区域
.page-title-section {
  @apply mb-6;

  .page-title {
    @apply text-2xl font-bold tracking-tight mb-0;
    color: var(--wm-color-text-primary);
  }
}

// 命名空间页签样式
.namespace-container {
  @apply mb-6 p-1.5 rounded-xl border border-muted shadow-sm;
  background-color: var(--wm-bg-color-base);
}

.namespace-tabs {
  @apply flex flex-wrap items-center gap-1.5 p-1;
}

.namespace-tab-item {
  @apply px-4 py-1.5 text-sm rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap;
  color: var(--wm-color-text-regular);
  font-weight: 500;
  border: 1px solid transparent;

  &:hover {
    @apply shadow-sm;
    background-color: var(--wm-bg-color-page);
    color: var(--wm-color-primary);
    border-color: var(--wm-border-color-base);
  }

  &.active {
    @apply bg-primary text-white shadow-md;
    border-color: var(--wm-color-primary);
    transform: translateY(-1px);

    &:hover {
      @apply bg-primary text-white focus:outline-none;
      opacity: 0.9;
    }
  }

  &.skeleton-tab {
    @apply bg-muted/60;
    min-width: 80px;
    height: 30px;
    cursor: default;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

// 搜索栏重构样式
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

    &.required::after {
        content: ' *';
        @apply text-destructive ml-0.5;
    }
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

// Action Bar
.action-bar {
  @apply flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 px-1 relative z-20;
}

.stats-badge {
  @apply flex items-center text-sm text-muted-foreground px-4 py-1.5 rounded-xl border shadow-sm transition-all;
  background-color: var(--wm-bg-color-base);
  border-color: var(--wm-border-color-base);
}

// Table Styles
.table-card {
  @apply overflow-hidden rounded-xl border border-muted/20 shadow-sm relative z-10;

  :deep(th) {
    @apply py-2 px-4 bg-muted/30 font-bold text-sm !important;
  }

  :deep(td) {
    @apply py-1 px-4 text-sm !important;
    height: 40px !important;
  }
}

.data-id-cell {
  @apply flex items-center;

  span {
    @apply font-semibold;
    color: var(--wm-color-text-primary);
  }
}

.group-tag {
  @apply px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider;
  background-color: var(--wm-color-primary-light-9);
  color: var(--wm-color-primary);
  border: 1px solid var(--wm-color-primary-light-8);
}

.action-cell {
  @apply w-[220px];
}

.action-buttons-row {
  @apply flex items-center justify-start gap-1;
}

.action-separator {
  @apply text-muted-foreground/30 text-sm mx-0.5 pointer-events-none;
}

.action-btn {
  @apply h-8 px-2 text-sm font-semibold hover:bg-muted/50 rounded-md transition-colors;

  &.text-primary { @apply text-primary hover:text-primary/80; }
  &.text-info { color: #3b82f6; }
}

// Dialog Refinements
:deep(.config-create-dialog) {
  @apply rounded-3xl overflow-hidden shadow-2xl transition-all;
  background: var(--wm-bg-color-base);
}

.loading-overlay {
  @apply absolute inset-0 z-50 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl;
  background-color: rgba(255, 255, 255, 0.4);

  :global([data-theme='dark']) & {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.loading-spinner {
  @apply w-12 h-12 border-4 rounded-full animate-spin mb-4;
  border-color: var(--wm-color-primary-light-7);
  border-top-color: var(--wm-color-primary);
}

// 分页重构
.pagination-container {
  @apply flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-muted/20 gap-4;
  background-color: var(--wm-bg-color-base);
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
  @apply flex items-center gap-3;
}

.page-numbers {
  @apply flex items-center gap-1.5 px-3 py-1 bg-muted/20 rounded-md text-sm font-bold;
  .current-page { color: var(--wm-color-primary); }
  .page-divider { @apply text-muted-foreground/50; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}
</style>
