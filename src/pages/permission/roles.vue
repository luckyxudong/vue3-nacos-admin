<template>
  <div class="role-page">
    <!-- 页面标题区域 -->
    <div class="page-title-section animate-in fade-in slide-in-from-top-4 duration-500">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon icon="mdi:account-key" class="text-2xl" />
        </div>
        <h1 class="page-title">{{ $t('role.title') }}</h1>
      </div>
    </div>

    <!-- 查询表单区域 -->
    <Card class="search-card animate-in fade-in slide-in-from-top-6 duration-700">
      <CardContent class="p-5">
        <div class="search-form-layout">
          <div class="search-inputs-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <!-- 角色查询 -->
            <div class="search-field">
              <Label class="field-label">{{ $t('role.search.role') }}</Label>
              <div class="input-control">
                <Icon icon="mdi:shield-account-outline" class="control-icon" />
                <Input
                  v-model="queryParams.role"
                  :placeholder="$t('role.search.rolePlaceholder')"
                  class="compact-input"
                  @keyup.enter="handleSearch"
                />
              </div>
            </div>
            <!-- 用户名查询 -->
            <div class="search-field">
              <Label class="field-label">{{ $t('role.search.username') }}</Label>
              <div class="input-control">
                <Icon icon="mdi:account-search-outline" class="control-icon" />
                <Input
                  v-model="queryParams.username"
                  :placeholder="$t('role.search.usernamePlaceholder')"
                  class="compact-input"
                  @keyup.enter="handleSearch"
                />
              </div>
            </div>
          </div>
          <div class="search-buttons">
            <Button @click="handleSearch" :disabled="loading" class="btn-search shadow-sm">
              <Icon v-if="loading" icon="mdi:loading" class="mr-2 animate-spin" />
              {{ $t('role.search.query') }}
            </Button>
            <Button variant="outline" class="btn-reset" @click="handleReset">
              {{ $t('role.search.reset') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 操作栏 -->
    <div class="action-bar animate-in fade-in slide-in-from-top-7 duration-800">
      <div class="flex items-center gap-2">
        <Button @click="handleBind" class="operation-btn shadow-lg shadow-primary/20 hover-lift">
          <Icon icon="mdi:link-plus" class="mr-2" />
          {{ $t('role.action.bind') }}
        </Button>
      </div>
      <div class="stats-badge bg-background/50 backdrop-blur-sm">
        <Icon icon="mdi:information-outline" class="mr-2 text-primary" />
        <span>{{ $t('config.table.totalConfigs', { total: totalCount }) }}</span>
      </div>
    </div>

    <!-- 角色列表表格 -->
    <Card class="table-card border-none shadow-sm overflow-visible">
      <CardContent class="p-0">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="text-sm font-medium text-muted-foreground">{{ $t('config.table.loading') }}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30 hover:bg-muted/30">
              <TableHead class="font-bold">{{ $t('role.table.role') }}</TableHead>
              <TableHead class="font-bold">{{ $t('role.table.username') }}</TableHead>
              <TableHead class="text-left font-bold">{{ $t('role.table.operation') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="roleList.length > 0">
              <TableRow
                v-for="(item, index) in roleList"
                :key="`${item.role}-${item.username}-${index}`"
                class="transition-all hover:bg-muted/30 group/row"
              >
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Badge :variant="item.role === 'ROLE_ADMIN' ? 'default' : 'secondary'" class="rounded-md px-2 py-0.5 text-xs font-semibold">
                      {{ item.role }}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs uppercase">
                      {{ (item.username || '').charAt(0) }}
                    </div>
                    <span class="font-semibold text-foreground">{{ item.username }}</span>
                  </div>
                </TableCell>
                <TableCell class="action-cell">
                  <div class="action-buttons-row">
                    <Button
                      v-if="item.role !== 'ROLE_ADMIN'"
                      variant="ghost"
                      size="sm"
                      class="action-btn text-destructive hover:bg-destructive/5"
                      @click="handleDelete(item)"
                    >
                      <Icon icon="mdi:delete-outline" class="mr-1.5 text-xs opacity-70" />
                      {{ $t('role.action.delete') }}
                    </Button>
                    <span v-else class="text-xs text-muted-foreground opacity-50 italic">System Protected</span>
                  </div>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="!loading">
              <TableCell colspan="3" class="h-64 text-center">
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

    <!-- 绑定角色 Dialog -->
    <Dialog v-model="bindDialogOpen">
      <DialogContent class="role-dialog max-w-md p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader class="px-6 py-5 border-b bg-muted/5">
          <DialogTitle class="text-xl font-bold flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Icon icon="mdi:link-variant-plus" class="text-lg" />
            </div>
            {{ $t('role.dialog.bindTitle') }}
          </DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
             {{ $t('role.dialog.bindTitle') }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-5 px-6 py-6">
          <!-- 角色名 -->
          <div class="grid gap-2">
            <Label for="roleName" class="required font-semibold text-sm">{{ $t('role.dialog.roleLabel') }}</Label>
            <Input
              id="roleName"
              v-model.trim="bindForm.role"
              :placeholder="$t('role.dialog.rolePlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20"
            />
          </div>
          <!-- 用户名 -->
          <div class="grid gap-2">
            <Label for="username" class="required font-semibold text-sm">{{ $t('role.dialog.usernameLabel') }}</Label>
            <div class="relative">
              <Input
                id="username"
                v-model.trim="bindForm.username"
                :placeholder="$t('role.dialog.usernamePlaceholder')"
                class="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20"
                @input="handleUserSearch"
                @focus="showUserList = true"
              />
              <!-- 简单的用户下拉列表 -->
              <div v-if="showUserList && filteredUsers.length > 0" class="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                <div
                  v-for="user in filteredUsers"
                  :key="user.username"
                  class="px-4 py-2 hover:bg-muted cursor-pointer transition-colors flex items-center gap-2"
                  @mousedown="selectUser(user.username)"
                >
                   <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                      {{ user.username.charAt(0).toUpperCase() }}
                   </div>
                   <span class="text-sm">{{ user.username }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 bg-muted/5 border-t">
          <Button variant="outline" class="h-10 px-6 font-medium" @click="bindDialogOpen = false">
            {{ $t('config.dialog.cancel') }}
          </Button>
          <Button
            class="h-10 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            @click="handleBindConfirm"
            :disabled="submitting"
          >
            <Icon v-if="submitting" icon="mdi:loading" class="mr-2 animate-spin" />
            <Icon v-else icon="mdi:check" class="mr-2" />
            {{ $t('role.dialog.confirmBind') }}
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
    locales: ['role', 'config'],
  },
})

defineOptions({
  name: 'RoleManagement'
})

import { roleService } from '@/services/auth/role-service'
import type { Role, RoleListReq } from '@/services/auth/role-service'
import { userService } from '@/services/auth/user-service'
import type { User } from '@/services/auth/user-service'
import { confirm, alertError } from '@/utils/dialog'
import { toastSuccess } from '@/utils/toast'

// 查询参数
const queryParams = ref<RoleListReq>({
  role: '',
  username: '',
  pageNo: 1,
  pageSize: 20,
  search: 'blur',
})

const loading = ref(false)
const submitting = ref(false)
const roleList = ref<Role[]>([])
const totalCount = ref(0)

// 绑定角色表单
const bindDialogOpen = ref(false)
const bindForm = ref({
  role: '',
  username: ''
})

// 用户搜索相关
const showUserList = ref(false)
const filteredUsers = ref<User[]>([])
const allUsers = ref<User[]>([])

// 初始化
onMounted(() => {
  handleSearch()
  fetchAllUsers()
})

// 获取所有用户用于下拉选择 (如果用户不多可以一次性获取，或者根据输入过滤)
const fetchAllUsers = async () => {
  try {
    const res = await userService.getList({ pageNo: 1, pageSize: 100 })
    allUsers.value = res.pageItems || []
    filteredUsers.value = [...allUsers.value]
  } catch (err) {
    console.error('Failed to fetch users', err)
  }
}

const handleUserSearch = () => {
  const q = bindForm.value.username.toLowerCase()
  if (!q) {
    filteredUsers.value = [...allUsers.value]
  } else {
    filteredUsers.value = allUsers.value.filter(u => u.username.toLowerCase().includes(q))
  }
  showUserList.value = true
}

const selectUser = (username: string) => {
  bindForm.value.username = username
  showUserList.value = false
}

// 查询
const handleSearch = async () => {
  loading.value = true
  try {
    const params = { ...queryParams.value }
    const role = params.role?.trim()
    const username = params.username?.trim()

    params.search = 'blur'
    if (role) params.role = `*${role}*`
    if (username) params.username = `*${username}*`

    const res = await roleService.getList(params)
    roleList.value = res.pageItems || []
    totalCount.value = res.totalCount || 0
  } catch (err) {
    roleList.value = []
    totalCount.value = 0
    console.error(err)
    alertError(t('role.message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  queryParams.value.role = ''
  queryParams.value.username = ''
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

// 绑定
const handleBind = () => {
  bindForm.value = {
    role: '',
    username: ''
  }
  bindDialogOpen.value = true
}

const handleBindConfirm = async () => {
  const { role, username } = bindForm.value

  if (!role) return alertError(t('role.dialog.roleRequired'))
  if (!username) return alertError(t('role.dialog.usernameRequired'))

  submitting.value = true
  try {
    await roleService.create({ role, username })
    toastSuccess(t('role.message.bindSuccess'))
    bindDialogOpen.value = false
    handleSearch()
  } catch {
    alertError(t('role.message.bindFailed'))
  } finally {
    submitting.value = false
  }
}

// 删除
const handleDelete = async (item: Role) => {
  const ok = await confirm(
    t('role.dialog.deleteContent', { role: item.role, username: item.username }),
    t('role.dialog.deleteTitle'),
    { type: 'danger' }
  )

  if (ok) {
    try {
      await roleService.delete({ role: item.role, username: item.username })
      toastSuccess(t('role.message.deleteSuccess'))
      handleSearch()
    } catch {
      alertError(t('role.message.deleteFailed'))
    }
  }
}

// 点击外部关闭用户列表
onMounted(() => {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.relative')) {
      showUserList.value = false
    }
  })
})
</script>

<style scoped lang="scss">
.role-page {
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

:deep(.role-dialog) {
  @apply rounded-3xl overflow-hidden;
  background: var(--wm-bg-color-base);
}

.required::after {
  content: ' *';
  @apply text-destructive ml-0.5;
}
</style>
