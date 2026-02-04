<template>
  <div class="permission-page">
    <!-- 页面标题区域 -->
    <div class="page-title-section animate-in fade-in slide-in-from-top-4 duration-500">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon icon="mdi:shield-check" class="text-2xl" />
        </div>
        <h1 class="page-title">{{ $t('permission.title') }}</h1>
      </div>
    </div>

    <!-- 查询表单区域 -->
    <Card class="search-card animate-in fade-in slide-in-from-top-6 duration-700">
      <CardContent class="p-5">
        <div class="search-form-layout">
          <div class="search-inputs-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <!-- 角色查询 -->
            <div class="search-field">
              <Label class="field-label">{{ $t('permission.search.role') }}</Label>
              <div class="input-control">
                <Icon icon="mdi:shield-account-outline" class="control-icon" />
                <Input
                  v-model="queryParams.role"
                  :placeholder="$t('permission.search.rolePlaceholder')"
                  class="compact-input"
                  @keyup.enter="handleSearch"
                />
              </div>
            </div>
          </div>
          <div class="search-buttons">
            <Button @click="handleSearch" :disabled="loading" class="btn-search shadow-sm">
              <Icon v-if="loading" icon="mdi:loading" class="mr-2 animate-spin" />
              {{ $t('permission.search.query') }}
            </Button>
            <Button variant="outline" class="btn-reset" @click="handleReset">
              {{ $t('permission.search.reset') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 操作栏 -->
    <div class="action-bar animate-in fade-in slide-in-from-top-7 duration-800">
      <div class="flex items-center gap-2">
        <Button @click="handleAdd" class="operation-btn shadow-lg shadow-primary/20 hover-lift">
          <Icon icon="mdi:shield-plus" class="mr-2" />
          {{ $t('permission.action.add') }}
        </Button>
      </div>
      <div class="stats-badge bg-background/50 backdrop-blur-sm">
        <Icon icon="mdi:information-outline" class="mr-2 text-primary" />
        <span>{{ $t('config.table.totalConfigs', { total: totalCount }) }}</span>
      </div>
    </div>

    <!-- 权限列表表格 -->
    <Card class="table-card border-none shadow-sm overflow-visible">
      <CardContent class="p-0">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="text-sm font-medium text-muted-foreground">{{ $t('config.table.loading') }}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30 hover:bg-muted/30">
              <TableHead class="font-bold">{{ $t('permission.table.role') }}</TableHead>
              <TableHead class="font-bold">{{ $t('permission.table.resource') }}</TableHead>
              <TableHead class="font-bold">{{ $t('permission.table.action') }}</TableHead>
              <TableHead class="text-left font-bold">{{ $t('permission.table.operation') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="permissionList.length > 0">
              <TableRow
                v-for="(item, index) in permissionList"
                :key="`${item.role}-${item.resource}-${item.action}-${index}`"
                class="transition-all hover:bg-muted/30 group/row"
              >
                <TableCell>
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-primary">{{ item.role }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span class="font-medium text-foreground">{{ formatResource(item.resource) }}</span>
                </TableCell>
                <TableCell>
                  <span class="font-semibold" :class="getActionClass(item.action)">
                    {{ getActionText(item.action) }}
                  </span>
                </TableCell>
                <TableCell class="action-cell">
                  <div class="action-buttons-row">
                    <Button
                      variant="ghost"
                      size="sm"
                      class="action-btn text-destructive hover:bg-destructive/5"
                      @click="handleDelete(item)"
                    >
                      <Icon icon="mdi:delete-outline" class="mr-1.5 text-xs opacity-70" />
                      {{ $t('permission.action.delete') }}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="!loading">
              <TableCell colspan="4" class="h-64 text-center">
                <div class="flex flex-col items-center justify-center text-muted-foreground">
                  <div class="mb-4 relative">
                    <Icon icon="mdi:shield-off-outline" class="text-6xl opacity-10" />
                    <Icon icon="mdi:magnify" class="text-2xl absolute -bottom-1 -right-1 opacity-20" />
                  </div>
                  <p class="text-base font-medium opacity-60">{{ $t('config.table.empty') }}</p>
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
                <Icon icon="mdi:chevron-left" />
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
                <Icon icon="mdi:chevron-right" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 添加权限 Dialog -->
    <Dialog v-model="addDialogOpen">
      <DialogContent class="permission-dialog max-w-md p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader class="px-6 py-5 border-b bg-muted/5">
          <DialogTitle class="text-xl font-bold flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Icon icon="mdi:shield-plus" class="text-lg" />
            </div>
            {{ $t('permission.dialog.addTitle') }}
          </DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
             {{ $t('permission.dialog.addTitle') }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-5 px-6 py-6">
          <!-- 角色名 -->
          <div class="grid gap-2">
            <Label for="roleName" class="required font-semibold text-sm">{{ $t('permission.dialog.roleLabel') }}</Label>
            <Input
              id="roleName"
              v-model.trim="addForm.role"
              :placeholder="$t('permission.dialog.rolePlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20"
            />
          </div>
          <!-- 资源 -->
          <div class="grid gap-2">
            <Label for="resource" class="required font-semibold text-sm">{{ $t('permission.dialog.resourceLabel') }}</Label>
            <Select
              id="resource"
              v-model="addForm.resource"
              :placeholder="namespaces.length === 0 ? '加载中...' : $t('permission.dialog.resourcePlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20"
            >
              <option
                v-for="ns in namespaces"
                :key="ns.namespace"
                :value="`${ns.namespace}:*:*`"
              >
                {{ ns.namespaceShowName }}{{ ns.namespace ? ` (${ns.namespace})` : '' }}
              </option>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="action" class="required font-semibold text-sm">{{ $t('permission.dialog.actionLabel') }}</Label>
            <Select
              id="action"
              v-model="addForm.action"
              :placeholder="$t('permission.dialog.actionPlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20"
            >
              <option value="r">{{ $t('permission.action.readOnly') }} (r)</option>
              <option value="w">{{ $t('permission.action.writeOnly') }} (w)</option>
              <option value="rw">{{ $t('permission.action.readWrite') }} (rw)</option>
            </Select>
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 bg-muted/5 border-t">
          <Button variant="outline" class="h-10 px-6 font-medium" @click="addDialogOpen = false">
            {{ $t('config.dialog.cancel') }}
          </Button>
          <Button
            class="h-10 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            @click="handleAddConfirm"
            :disabled="submitting"
          >
            <Icon v-if="submitting" icon="mdi:loading" class="mr-2 animate-spin" />
            <Icon v-else icon="mdi:check" class="mr-2" />
            {{ $t('permission.dialog.confirmAdd') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

definePage({
  meta: {
    locales: ['permission', 'config'],
  },
})

defineOptions({
  name: 'PermissionManagement'
})

import { permissionService } from '@/services/auth/permission-service'
import type { Permission, PermissionListReq } from '@/services/auth/permission-service'
import { namespaceService } from '@/services/namespace/namespace-service'
import type { Namespace } from '@/services/namespace/namespace-service'
import { confirm, alertError } from '@/utils/dialog'
import { toastSuccess } from '@/utils/toast'

// 查询参数
const queryParams = ref<PermissionListReq>({
  role: '',
  pageNo: 1,
  pageSize: 20,
  search: 'blur',
})

const loading = ref(false)
const submitting = ref(false)
const permissionList = ref<Permission[]>([])
const totalCount = ref(0)

// 添加权限表单
const addDialogOpen = ref(false)
const addForm = ref({
  role: '',
  resource: '',
  action: ''
})

// 命名空间列表
const namespaces = ref<Namespace[]>([])



// 初始化
onMounted(() => {
  handleSearch()
  fetchNamespaces()
})

// 获取命名空间列表
const fetchNamespaces = async () => {
  try {
    const res = await namespaceService.getList()
    namespaces.value = res || []
  } catch (err) {
    console.error('Failed to fetch namespaces', err)
  }
}



// 查询
const handleSearch = async () => {
  loading.value = true
  try {
    const params = { ...queryParams.value }
    const role = params.role?.trim()

    params.search = 'blur'
    if (role) params.role = `*${role}*`

    const res = await permissionService.getList(params)
    permissionList.value = res.pageItems || []
    totalCount.value = res.totalCount || 0
  } catch (err) {
    permissionList.value = []
    totalCount.value = 0
    console.error(err)
    alertError(t('permission.message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryParams.value.role = ''
  queryParams.value.pageNo = 1
  handleSearch()
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

// 添加
const handleAdd = () => {
  addForm.value = {
    role: '',
    resource: '',
    action: ''
  }
  addDialogOpen.value = true
}

const handleAddConfirm = async () => {
  const { role, resource, action } = addForm.value

  if (!role) return alertError(t('permission.dialog.roleRequired'))
  if (!resource) return alertError(t('permission.dialog.resourceRequired'))
  if (!action) return alertError(t('permission.dialog.actionRequired'))

  submitting.value = true
  try {
    await permissionService.create({ role, resource, action })
    toastSuccess(t('permission.message.addSuccess'))
    addDialogOpen.value = false
    handleSearch()
  } catch {
    alertError(t('permission.message.addFailed'))
  } finally {
    submitting.value = false
  }
}

// 删除
const handleDelete = async (item: Permission) => {
  const ok = await confirm(
    t('permission.dialog.deleteContent', { role: item.role, resource: formatResource(item.resource), action: getActionText(item.action) }),
    t('permission.dialog.deleteTitle'),
    { type: 'danger' }
  )

  if (ok) {
    try {
      await permissionService.delete({ role: item.role, resource: item.resource, action: item.action })
      toastSuccess(t('permission.message.deleteSuccess'))
      handleSearch()
    } catch {
      alertError(t('permission.message.deleteFailed'))
    }
  }
}

// 格式化资源显示
const formatResource = (resource: string): string => {
  const [namespace] = resource.split(':')
  const ns = namespaces.value.find(n => n.namespace === namespace)
  if (ns) {
    return ns.namespaceShowName + (ns.namespace ? ` (${ns.namespace})` : '')
  }
  return resource
}

// 获取动作文本
const getActionText = (action: string): string => {
  const actionMap: Record<string, string> = {
    'r': `${t('permission.action.readOnly')} (r)`,
    'w': `${t('permission.action.writeOnly')} (w)`,
    'rw': `${t('permission.action.readWrite')} (rw)`,
  }
  return actionMap[action] || action
}

// 获取动作样式类
const getActionClass = (action: string): string => {
  const classMap: Record<string, string> = {
    'r': 'text-blue-600 dark:text-blue-400',
    'w': 'text-amber-600 dark:text-amber-400',
    'rw': 'text-primary',
  }
  return classMap[action] || 'text-foreground'
}


</script>

<style scoped lang="scss">
.permission-page {
  @apply p-6 min-h-screen font-sans;
  background-color: var(--wm-bg-color-page);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, var(--wm-color-primary-light-9) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
    opacity: 0.6;
  }
}

.hover-lift {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
}

.page-title-section {
  @apply mb-8;
  .page-title {
    @apply text-2xl font-bold tracking-tight mb-0;
    color: var(--wm-color-text-primary);
  }
}

.search-card {
  @apply mb-6 border-none shadow-sm rounded-2xl overflow-hidden;
  background-color: var(--wm-bg-color-base);
}

.search-form-layout {
  @apply flex flex-col xl:flex-row xl:items-end gap-6;
}

.search-inputs-grid {
  @apply grid gap-6 flex-1;
}

.search-field {
  @apply flex flex-col gap-2;
  .field-label {
    @apply text-sm font-bold text-muted-foreground/80 ml-0.5 uppercase tracking-wider;
    &.required::after {
      content: ' *';
      @apply text-destructive ml-0.5;
    }
  }
}

.input-control {
  @apply relative;
  .compact-input {
    @apply h-11 pl-10 text-sm rounded-xl transition-all border-muted font-medium;
    background-color: var(--wm-bg-color-page);
    &:focus {
      @apply ring-4 ring-primary/10 border-primary shadow-sm;
      background-color: var(--wm-bg-color-base);
    }
  }
  .control-icon {
    @apply absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 text-lg;
  }
}

.search-buttons {
  @apply flex items-center gap-3 justify-end xl:mb-0.5;
}

.btn-search {
  @apply h-11 px-8 rounded-xl font-bold bg-primary text-white transition-all border-none relative overflow-hidden;
  &::after {
    content: '';
    @apply absolute inset-0 bg-white/10 opacity-0 transition-opacity;
  }
  &:hover {
    @apply opacity-90 shadow-lg shadow-primary/25;
    transform: translateY(-1px);
    &::after { @apply opacity-100; }
  }
}

.btn-reset {
  @apply h-11 px-6 rounded-xl font-semibold border-2 transition-all;
  border-color: var(--wm-border-color-base);
  color: var(--wm-color-text-regular);
  &:hover {
    @apply bg-muted/30 border-muted-foreground/20;
    transform: translateY(-1px);
  }
}

.action-bar {
  @apply flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 px-1 relative z-20;
}

.operation-btn {
  @apply h-11 px-8 rounded-xl font-bold bg-primary text-white border-none;
}

.stats-badge {
  @apply flex items-center text-sm px-5 py-2 rounded-2xl border shadow-sm transition-all;
  border-color: var(--wm-border-color-base);
}

.table-card {
  @apply overflow-hidden rounded-xl border border-muted/20 shadow-sm relative z-10;
  :deep(th) {
    @apply py-2 px-4 bg-muted/30 font-bold text-sm !important;
  }
  :deep(td) {
    @apply py-1 px-4 text-sm !important;
    height: 48px !important;
  }
}

.action-buttons-row {
  @apply flex items-center justify-start gap-1.5;
}

.action-btn {
  @apply h-9 px-3 text-xs font-bold rounded-lg transition-all flex items-center;
  &.text-destructive { @apply text-destructive; }
}

.loading-overlay {
  @apply absolute inset-0 z-50 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl;
  background-color: rgba(255, 255, 255, 0.6);
  :global([data-theme='dark']) & {
    background-color: rgba(0, 0, 0, 0.6);
  }
}
.loading-spinner {
  @apply w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4;
}

.pagination-container {
  @apply flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-muted/20 gap-4;
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
  .current-page {
    color: var(--wm-color-primary);
  }
  .page-divider {
    @apply text-muted-foreground/50;
  }
  .total-pages {
    @apply text-muted-foreground;
  }
}

:deep(.permission-dialog) {
  @apply rounded-3xl overflow-hidden;
  background: var(--wm-bg-color-base);
}

.required::after {
  content: ' *';
  @apply text-destructive ml-0.5;
}
</style>
