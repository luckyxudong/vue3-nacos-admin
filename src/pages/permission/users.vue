<template>
  <div class="user-page">
    <!-- 页面标题区域 -->
    <div class="page-title-section animate-in fade-in slide-in-from-top-4 duration-500">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon icon="mdi:account-group" class="text-2xl" />
        </div>
        <h1 class="page-title">{{ $t('user.title') }}</h1>
      </div>
    </div>

    <!-- 查询表单区域 -->
    <Card class="search-card animate-in fade-in slide-in-from-top-6 duration-700">
      <CardContent class="p-5">
        <div class="search-form-layout">
          <div class="search-inputs-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div class="search-field">
              <Label class="field-label">{{ $t('user.search.username') }}</Label>
              <div class="input-control">
                <Icon icon="mdi:account-search-outline" class="control-icon" />
                <Input
                  v-model="queryParams.username"
                  :placeholder="$t('user.search.usernamePlaceholder')"
                  class="compact-input"
                  @keyup.enter="handleSearch"
                />
              </div>
            </div>
          </div>
          <div class="search-buttons">
            <Button @click="handleSearch" :disabled="loading" class="btn-search shadow-sm">
              <Icon v-if="loading" icon="mdi:loading" class="mr-2 animate-spin" />
              {{ $t('user.search.query') }}
            </Button>
            <Button variant="outline" class="btn-reset" @click="handleReset">
              {{ $t('user.search.reset') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 操作栏 -->
    <div class="action-bar animate-in fade-in slide-in-from-top-7 duration-800">
      <div class="flex items-center gap-2">
        <Button @click="handleCreate" class="operation-btn shadow-lg shadow-primary/20 hover-lift">
          <Icon icon="mdi:plus" class="mr-2" />
          {{ $t('user.action.create') }}
        </Button>
      </div>
      <div class="stats-badge bg-background/50 backdrop-blur-sm">
        <Icon icon="mdi:information-outline" class="mr-2 text-primary" />
        <span>{{ $t('config.table.totalConfigs', { total: totalCount }) }}</span>
      </div>
    </div>

    <!-- 用户列表表格 -->
    <Card class="table-card border-none shadow-sm overflow-visible">
      <CardContent class="p-0">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="text-sm font-medium text-muted-foreground">{{ $t('config.table.loading') }}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30 hover:bg-muted/30">
              <TableHead class="font-bold">{{ $t('user.table.username') }}</TableHead>
              <TableHead class="font-bold">{{ $t('user.table.password') }}</TableHead>
              <TableHead class="text-left font-bold">{{ $t('user.table.operation') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="userList.length > 0">
              <TableRow
                v-for="user in userList"
                :key="user.username"
                class="transition-all hover:bg-muted/30 group/row"
              >
                <TableCell>
                  <div class="username-cell">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs">
                        {{ user.username.charAt(0).toUpperCase() }}
                      </div>
                      <span class="font-semibold text-foreground">{{ user.username }}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-1 font-mono text-muted-foreground/30 tracking-widest select-none">
                    ••••••••
                  </div>
                </TableCell>
                <TableCell class="action-cell">
                  <div class="action-buttons-row">
                    <Button variant="ghost" size="sm" class="action-btn text-primary hover:bg-primary/5" @click="handleResetPassword(user)">
                      <Icon icon="mdi:key-variant" class="mr-1.5 text-xs opacity-70" />
                      {{ $t('user.action.resetPassword') }}
                    </Button>
                    <span class="action-separator">|</span>
                    <Button variant="ghost" size="sm" class="action-btn text-destructive hover:bg-destructive/5" @click="handleDelete(user)">
                      <Icon icon="mdi:delete-outline" class="mr-1.5 text-xs opacity-70" />
                      {{ $t('user.action.delete') }}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="!loading">
              <TableCell colspan="3" class="h-64 text-center">
                <div class="flex flex-col items-center justify-center text-muted-foreground">
                  <div class="mb-4 relative">
                    <Icon icon="mdi:account-off-outline" class="text-6xl opacity-10" />
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

    <!-- 新增用户 Dialog -->
    <Dialog v-model="createDialogOpen">
      <DialogContent class="user-dialog max-w-md p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader class="px-6 py-5 border-b bg-muted/5">
          <DialogTitle class="text-xl font-bold flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Icon icon="mdi:account-plus" class="text-lg" />
            </div>
            {{ $t('user.dialog.createTitle') }}
          </DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
             {{ $t('user.dialog.createTitle') }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-5 px-6 py-6">
          <div class="grid gap-2">
            <Label for="username" class="required font-semibold text-sm">{{ $t('user.dialog.usernameLabel') }}</Label>
            <Input
              id="username"
              v-model.trim="createForm.username"
              :placeholder="$t('user.dialog.usernamePlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password" class="required font-semibold text-sm">{{ $t('user.dialog.passwordLabel') }}</Label>
            <Input
              id="password"
              type="password"
              v-model.trim="createForm.password"
              :placeholder="$t('user.dialog.passwordPlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20"
            />
          </div>
          <div class="grid gap-2">
            <Label for="rePassword" class="required font-semibold text-sm">{{ $t('user.dialog.rePasswordLabel') }}</Label>
            <Input
              id="rePassword"
              type="password"
              v-model.trim="createForm.rePassword"
              :placeholder="$t('user.dialog.rePasswordPlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 bg-muted/5 border-t">
          <Button variant="outline" class="h-10 px-6 font-medium" @click="createDialogOpen = false">
            {{ $t('config.dialog.cancel') }}
          </Button>
          <Button
            class="h-10 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            @click="handleCreateConfirm"
            :disabled="submitting"
          >
            <Icon v-if="submitting" icon="mdi:loading" class="mr-2 animate-spin" />
            <Icon v-else icon="mdi:check" class="mr-2" />
            {{ $t('user.dialog.confirmCreate') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 重置密码 Dialog -->
    <Dialog v-model="resetDialogOpen">
      <DialogContent class="user-dialog max-w-md p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader class="px-6 py-5 border-b bg-muted/5">
          <DialogTitle class="text-xl font-bold flex items-center gap-2">
            <div class="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Icon icon="mdi:key-reset" class="text-lg" />
            </div>
            {{ $t('user.dialog.resetTitle') }}
          </DialogTitle>
          <DialogDescription class="text-sm text-muted-foreground">
             {{ $t('user.dialog.resetTitle') }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-5 px-6 py-6">
          <div class="grid gap-2">
            <Label class="font-semibold text-sm">{{ $t('user.dialog.usernameLabel') }}</Label>
            <div class="h-11 px-4 flex items-center bg-muted/50 rounded-lg border border-border/50 font-bold text-primary">
               <Icon icon="mdi:account-outline" class="mr-2 opacity-50" />
               {{ resetForm.username }}
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="newPassword" class="required font-semibold text-sm">{{ $t('user.dialog.passwordLabel') }}</Label>
            <Input
              id="newPassword"
              type="password"
              v-model.trim="resetForm.newPassword"
              :placeholder="$t('user.dialog.passwordPlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20"
            />
          </div>
          <div class="grid gap-2">
            <Label for="resetRePassword" class="required font-semibold text-sm">{{ $t('user.dialog.rePasswordLabel') }}</Label>
            <Input
              id="resetRePassword"
              type="password"
              v-model.trim="resetForm.rePassword"
              :placeholder="$t('user.dialog.rePasswordPlaceholder')"
              class="h-11 rounded-lg border-muted-foreground/20 focus:ring-primary/20"
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4 bg-muted/5 border-t">
          <Button variant="outline" class="h-10 px-6 font-medium" @click="resetDialogOpen = false">
            {{ $t('config.dialog.cancel') }}
          </Button>
          <Button
            class="h-10 px-8 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            @click="handleResetConfirm"
            :disabled="submitting"
          >
            <Icon v-if="submitting" icon="mdi:loading" class="mr-2 animate-spin" />
            <Icon v-else icon="mdi:check" class="mr-2" />
            {{ $t('user.dialog.confirmReset') }}
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
    locales: ['user', 'config'],
  },
})

defineOptions({
  name: 'UserManagement'
})

import { userService } from '@/services/auth/user-service'
import type { User, UserListReq } from '@/services/auth/user-service'
import { confirm, alertError } from '@/utils/dialog'
import { toastSuccess } from '@/utils/toast'

// 查询参数
const queryParams = ref<UserListReq>({
  username: '',
  pageNo: 1,
  pageSize: 20,
  search: 'blur',
})

const loading = ref(false)
const submitting = ref(false)
const userList = ref<User[]>([])
const totalCount = ref(0)

// 新增用户表单
const createDialogOpen = ref(false)
const createForm = ref({
  username: '',
  password: '',
  rePassword: ''
})

// 重置密码表单
const resetDialogOpen = ref(false)
const resetForm = ref({
  username: '',
  newPassword: '',
  rePassword: ''
})

// 初始化
onMounted(() => {
  handleSearch()
})

// 查询
const handleSearch = async () => {
  loading.value = true
  try {
    const params = { ...queryParams.value }
    const username = params.username?.trim()

    if (username) {
      params.username = `*${username}*`
      params.search = 'blur'
    } else {
      params.username = ''
      params.search = 'accurate'
    }

    const res = await userService.getList(params)
    userList.value = res.pageItems || []
    totalCount.value = res.totalCount || 0
  } catch (err) {
    userList.value = []
    totalCount.value = 0
    console.error(err)
    alertError(t('user.message.fetchFailed'))
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
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

// 新增
const handleCreate = () => {
  createForm.value = {
    username: '',
    password: '',
    rePassword: ''
  }
  createDialogOpen.value = true
}

const handleCreateConfirm = async () => {
  const { username, password, rePassword } = createForm.value

  if (!username) return alertError(t('user.dialog.usernameRequired'))
  if (!password) return alertError(t('user.dialog.passwordRequired'))
  if (password !== rePassword) return alertError(t('user.dialog.passwordNotMatch'))

  submitting.value = true
  try {
    await userService.create({ username, password })
    toastSuccess(t('user.message.createSuccess'))
    createDialogOpen.value = false
    handleSearch()
  } catch {
    alertError(t('user.message.createFailed'))
  } finally {
    submitting.value = false
  }
}

// 重置密码
const handleResetPassword = (user: User) => {
  resetForm.value = {
    username: user.username,
    newPassword: '',
    rePassword: ''
  }
  resetDialogOpen.value = true
}

const handleResetConfirm = async () => {
  const { username, newPassword, rePassword } = resetForm.value

  if (!newPassword) return alertError(t('user.dialog.passwordRequired'))
  if (newPassword !== rePassword) return alertError(t('user.dialog.passwordNotMatch'))

  submitting.value = true
  try {
    await userService.resetPassword({ username, newPassword })
    toastSuccess(t('user.message.resetSuccess'))
    resetDialogOpen.value = false
    handleSearch()
  } catch {
    alertError(t('user.message.resetFailed'))
  } finally {
    submitting.value = false
  }
}

// 删除
const handleDelete = async (user: User) => {
  const ok = await confirm(
    t('user.dialog.deleteContent', { username: user.username }),
    t('user.dialog.deleteTitle'),
    { type: 'danger' }
  )

  if (ok) {
    try {
      await userService.delete({ username: user.username })
      toastSuccess(t('user.message.deleteSuccess'))
      handleSearch()
    } catch {
      alertError(t('user.message.deleteFailed'))
    }
  }
}
</script>

<style scoped lang="scss">
.user-page {
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
    height: 40px !important;
  }
}

.action-buttons-row {
  @apply flex items-center justify-start gap-1.5;
}

.action-separator {
  @apply text-muted-foreground/20 text-xs mx-0.5 pointer-events-none;
}

.action-btn {
  @apply h-9 px-3 text-xs font-bold rounded-lg transition-all flex items-center;
  &.text-primary { @apply text-primary; }
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

:deep(.user-dialog) {
  @apply rounded-3xl overflow-hidden;
  background: var(--wm-bg-color-base);
}

.required::after {
  content: ' *';
  @apply text-destructive ml-0.5;
}
</style>
