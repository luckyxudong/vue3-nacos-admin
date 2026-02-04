<template>
  <div class="listen-page">
    <!-- 页面标题区域 -->
    <div class="page-title-section animate-in fade-in slide-in-from-top-4 duration-500">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon icon="mdi:eye-outline" class="text-2xl" />
        </div>
        <h1 class="page-title">{{ $t('config.listen.title') }}</h1>
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
          <div class="search-inputs-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div class="search-field">
              <Label class="field-label">{{ $t('config.listen.search.type') }}</Label>
              <DropdownMenu v-slot="{ isOpen, toggle, close }">
                <Button variant="outline" class="compact-input flex items-center justify-between w-full px-4 h-10 border-muted" @click="toggle">
                  <div class="flex items-center gap-2">
                    <Icon type="uno" :icon="dimension === 0 ? 'i-mdi-file-document-outline' : 'i-mdi-laptop'" class="text-primary" />
                    <span>{{ dimension === 0 ? $t('config.listen.search.config') : $t('config.listen.search.ip') }}</span>
                  </div>
                  <Icon type="uno" icon="i-mdi-chevron-down" class="opacity-50 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
                </Button>
                <DropdownMenuContent class="w-[200px] p-1 shadow-xl border-muted-foreground/10" align="start" :is-open="isOpen">
                  <DropdownMenuItem
                    :class="cn('rounded-lg mb-0.5', dimension === 0 && 'bg-primary/10 text-primary font-bold')"
                    @click="() => { handleDimensionChange(0); close() }"
                  >
                    <Icon type="uno" icon="i-mdi-file-document-outline" class="mr-2" />
                    {{ $t('config.listen.search.config') }}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    :class="cn('rounded-lg', dimension === 1 && 'bg-primary/10 text-primary font-bold')"
                    @click="() => { handleDimensionChange(1); close() }"
                  >
                    <Icon type="uno" icon="i-mdi-laptop" class="mr-2" />
                    {{ $t('config.listen.search.ip') }}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <template v-if="dimension === 0">
              <div class="search-field">
                <Label class="field-label required">Data ID</Label>
                <div class="input-control">
                  <Icon type="uno" icon="i-mdi-magnify" class="control-icon" />
                  <Input
                    v-model="queryParams.dataId"
                    :placeholder="$t('config.listen.search.dataIdPlaceholder')"
                    class="compact-input"
                    :class="cn(errors.dataId && 'border-destructive ring-destructive/20')"
                    @input="errors.dataId = ''"
                  />
                </div>
                <p v-if="errors.dataId" class="text-xs text-destructive font-medium mt-1 animate-in fade-in slide-in-from-top-1">{{ errors.dataId }}</p>
              </div>
              <div class="search-field">
                <Label class="field-label required">Group</Label>
                <div class="input-control">
                  <Icon type="uno" icon="i-mdi-folder-outline" class="control-icon" />
                  <Input
                    v-model="queryParams.group"
                    :placeholder="$t('config.listen.search.groupPlaceholder')"
                    class="compact-input"
                    :class="cn(errors.group && 'border-destructive ring-destructive/20')"
                    @input="errors.group = ''"
                  />
                </div>
                <p v-if="errors.group" class="text-xs text-destructive font-medium mt-1 animate-in fade-in slide-in-from-top-1">{{ errors.group }}</p>
              </div>
            </template>

            <template v-else>
              <div class="search-field">
                <Label class="field-label">IP</Label>
                <div class="input-control">
                  <Icon type="uno" icon="i-mdi-laptop" class="control-icon" />
                  <Input v-model="queryParams.ip" :placeholder="$t('config.listen.search.ipPlaceholder')" class="compact-input" />
                </div>
              </div>
            </template>
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

    <!-- 结果列表表格 -->
    <Card class="table-card border-none shadow-sm">
      <CardContent class="p-0">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>{{ $t('config.table.loading') }}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30">
              <template v-if="dimension === 0">
                <TableHead>{{ $t('config.listen.table.ip') }}</TableHead>
              </template>
              <template v-else>
                <TableHead>{{ $t('config.listen.table.dataId') }}</TableHead>
                <TableHead>{{ $t('config.listen.table.group') }}</TableHead>
              </template>
              <TableHead>{{ $t('config.listen.table.md5') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="pageData.length > 0">
              <TableRow
                v-for="(item, index) in pageData"
                :key="index"
                class="transition-all hover:bg-muted/30 group/row"
              >
                <template v-if="dimension === 0">
                  <TableCell>
                    <span class="font-mono text-sm inline-flex items-center gap-2">
                       <Icon type="uno" icon="i-mdi-laptop" class="text-muted-foreground/40 text-xs" />
                       {{ item.ip }}
                    </span>
                  </TableCell>
                </template>
                <template v-else>
                  <TableCell>
                    <span class="font-mono text-sm">{{ item.dataId }}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" class="group-tag">{{ item.group }}</Badge>
                  </TableCell>
                </template>
                <TableCell>
                  <span class="text-xs font-mono opacity-60 truncate block max-w-[400px]" :title="item.md5">{{ item.md5 }}</span>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="!loading">
              <TableCell :colspan="dimension === 0 ? 2 : 3" class="h-64 text-center">
                <div class="flex flex-col items-center justify-center text-muted-foreground">
                  <Icon type="uno" icon="i-mdi-ear-hearing" class="text-5xl mb-2 opacity-10" />
                  <p class="text-sm font-medium opacity-60">{{ $t('config.table.empty') }}</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- 本地分页 -->
        <div v-if="totalDataSource.length > 0" class="pagination-container">
          <div class="pagination-info">
            {{ $t('config.pagination.itemInfo', {
               start: (currentPage - 1) * pageSize + 1,
               end: Math.min(currentPage * pageSize, totalDataSource.length),
               total: totalDataSource.length
            }) }}
          </div>
          <div class="pagination-controls">
            <div class="page-size-picker">
              <span class="text-sm text-muted-foreground">{{ $t('config.pagination.pageSize') }}</span>
              <PageSizeSelector v-model="pageSize" @update:model-value="(val: number) => handlePageSizeChange(val)" />
            </div>
            <div class="page-navigation">
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)"
              >
                <Icon type="uno" icon="i-mdi-chevron-left" />
              </Button>
              <div class="page-numbers">
                <span class="current-page">{{ currentPage }}</span>
                <span class="page-divider">/</span>
                <span class="total-pages">{{ Math.ceil(totalDataSource.length / pageSize) }}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                class="h-8 w-8 p-0"
                :disabled="currentPage >= Math.ceil(totalDataSource.length / pageSize)"
                @click="handlePageChange(currentPage + 1)"
              >
                <Icon type="uno" icon="i-mdi-chevron-right" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
  name: 'ConfigListen'
})

import { configService } from '@/services/configuration/config-service'
import { namespaceService } from '@/services/namespace/namespace-service'
import { toastSuccess } from '@/utils/toast'
import { cn } from '@/lib/utils'

/**
 * 监听查询逻辑：
 * 维度 0 (配置): 输入 Data ID, Group；接口 /v1/cs/configs/listener；结果列表中的列为 IP, MD5
 * 维度 1 (IP): 输入 IP；接口 /v1/cs/listener；结果列表中的列为 Data ID, Group, MD5
 */

// 查询维度：0 - 配置，1 - IP
const dimension = ref(0)

// 校验错误
const errors = ref({
  dataId: '',
  group: '',
})

// 查询参数
const queryParams = ref({
  dataId: '',
  group: '',
  ip: '',
})

// 分页控制
const currentPage = ref(1)
const pageSize = ref(10)

// 命名空间控制
const currentTenant = ref('')
const namespaces = ref<Array<{ namespace: string; namespaceShowName: string }>>([])
const namespacesLoading = ref(true)

const currentTenantShowName = computed(() => {
  const ns = namespaces.value.find(n => n.namespace === currentTenant.value)
  return ns ? ns.namespaceShowName : (currentTenant.value || 'public')
})

// 数据
const totalDataSource = ref<any[]>([])
const loading = ref(false)

// 计算当前页展示的数据
const pageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return totalDataSource.value.slice(start, end)
})

onMounted(async () => {
  try {
    const nsList = await namespaceService.getList()
    namespaces.value = nsList.map((n: any) => ({
      namespace: n.namespace || '',
      namespaceShowName: n.namespaceShowName || n.namespace || 'public'
    }))

    // 从 URL 获取初始化参数
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

const handleTenantChange = (tenant: string) => {
  currentTenant.value = tenant
  handleReset()
}

const handleDimensionChange = (val: number) => {
    dimension.value = val
    totalDataSource.value = []
    currentPage.value = 1
    errors.value.dataId = ''
    errors.value.group = ''
}

const handleSearch = async () => {
    // 重置错误
    errors.value.dataId = ''
    errors.value.group = ''

    if (dimension.value === 0) {
        let hasError = false
        if (!queryParams.value.dataId.trim()) {
            errors.value.dataId = t('config.listen.message.dataIdRequired')
            hasError = true
        }
        if (!queryParams.value.group.trim()) {
            errors.value.group = t('config.listen.message.groupRequired')
            hasError = true
        }
        if (hasError) return
    }

    loading.value = true
    try {
        let res
        if (dimension.value === 0) {
            res = await configService.getListenerByConfig({
                dataId: queryParams.value.dataId.trim(),
                group: queryParams.value.group.trim(),
                tenant: currentTenant.value,
                namespaceId: currentTenant.value
            })
        } else {
            res = await configService.getListenerByIp({
                ip: queryParams.value.ip.trim(),
                tenant: currentTenant.value,
                namespaceId: currentTenant.value
            })
        }

        if (res.collectStatus === 200) {
            const status = res.lisentersGroupkeyStatus
            const list = []
            for (const key in status) {
                if (dimension.value === 1) {
                    const [dataId, group] = key.split('+')
                    list.push({ dataId, group, md5: status[key] })
                } else {
                    list.push({ ip: key, md5: status[key] })
                }
            }
            totalDataSource.value = list
            currentPage.value = 1
        } else {
            totalDataSource.value = []
        }
    } catch (err: any) {
        totalDataSource.value = []
        console.error(err)
    } finally {
        loading.value = false
    }
}

const handleReset = () => {
  queryParams.value.dataId = ''
  queryParams.value.group = ''
  queryParams.value.ip = ''
  totalDataSource.value = []
  currentPage.value = 1
  errors.value.dataId = ''
  errors.value.group = ''
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handlePageSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCopyNamespace = () => {
  if (!currentTenant.value) return
  navigator.clipboard.writeText(currentTenant.value)
  toastSuccess(t('config.message.copySuccess'))
}
</script>

<style scoped lang="scss">
.listen-page {
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

// 搜索栏样式
.search-card {
  @apply mb-6 border-none shadow-sm rounded-xl overflow-visible;
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

:deep(.compact-input) {
  @apply h-10 text-sm rounded-lg transition-all border-muted;
  background-color: var(--wm-bg-color-page);
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

.group-tag {
  @apply px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider;
  background-color: var(--wm-color-primary-light-9);
  color: var(--wm-color-primary);
  border: 1px solid var(--wm-color-primary-light-8);
}

// Pagination
.pagination-container {
  @apply flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-muted/10 border-t gap-4;
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
  @apply flex items-center gap-1 mx-2;
  .current-page { @apply text-sm font-bold text-primary; }
  .page-divider { @apply text-muted-foreground opacity-40; }
  .total-pages { @apply text-sm font-medium text-muted-foreground; }
}

.loading-overlay {
  @apply absolute inset-0 z-50 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-2xl bg-background/40;

  .loading-spinner {
    @apply w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
