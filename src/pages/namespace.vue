<template>
  <div class="namespace-page">
    <TooltipProvider :delay-duration="300">
    <!-- 页面标题区域 -->
    <div class="page-title-section animate-in fade-in slide-in-from-top-4 duration-500">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-primary/10 text-primary">
            <Icon icon="mdi:domain" class="text-2xl" />
          </div>
          <h1 class="page-title">{{ t('namespace.title') }}</h1>
          <Badge variant="secondary" class="rounded-full px-4 py-1 text-sm font-semibold">
            {{ namespaceList.length }} {{ t('namespace.title') }}
          </Badge>
        </div>
        <div class="flex items-center gap-3">
          <Button @click="handleRefresh" variant="outline" class="btn-reset">
            <Icon type="uno" icon="i-mdi-refresh" :class="{ 'animate-spin': loading }" class="mr-2" />
            {{ t('namespace.action.refresh') }}
          </Button>
          <Button @click="handleAdd" class="btn-search shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
            <Icon type="uno" icon="i-mdi-plus" class="mr-2" />
            {{ t('namespace.action.add') }}
          </Button>
        </div>
      </div>
    </div>

    <!-- 列表表格区域 -->
    <Card class="table-card border-none shadow-sm animate-in fade-in slide-in-from-top-6 duration-700">
      <CardContent class="p-0 relative">
        <div v-if="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>{{ t('namespace.table.loading') }}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow class="bg-muted/30">
              <TableHead class="w-[200px]">{{ t('namespace.table.name') }}</TableHead>
              <TableHead class="w-[250px]">{{ t('namespace.table.id') }}</TableHead>
              <TableHead class="min-w-[200px]">{{ t('namespace.table.description') }}</TableHead>
              <TableHead class="w-[120px]">{{ t('namespace.table.configCount') }}</TableHead>
              <TableHead class="text-left w-[240px]">{{ t('namespace.table.operations') }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="namespaceList.length > 0">
              <TableRow
                v-for="ns in namespaceList"
                :key="ns.namespace"
                class="transition-all hover:bg-muted/30 group/row"
              >
                <TableCell>
                  <div class="flex items-center gap-2 whitespace-nowrap">
                    <span class="font-bold text-foreground">{{ ns.type === 0 ? 'public(保留空间)' : ns.namespaceShowName }}</span>
                    <Badge v-if="ns.type === 0 || ns.type === 1" variant="outline" class="text-xs py-0 px-1.5 opacity-70">
                      System
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <code class="text-sm bg-muted/50 px-1.5 py-0.5 rounded font-mono text-primary font-bold whitespace-nowrap">
                    {{ ns.type === 0 ? '-' : ns.namespace }}
                  </code>
                </TableCell>
                <TableCell>
                  <Tooltip v-if="ns.namespaceDesc && ns.namespaceDesc.length > 30">
                    <TooltipTrigger as-child>
                      <span class="text-foreground/90 text-sm line-clamp-1 font-medium max-w-[300px] cursor-help">
                        {{ ns.namespaceDesc }}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" :side-offset="5">
                      <p class="max-w-xs break-all">{{ ns.namespaceDesc }}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span v-else class="text-foreground/90 text-sm font-medium">
                    {{ ns.namespaceDesc || '-' }}
                  </span>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-1.5 text-foreground">
                    <span class="font-bold border-none">{{ ns.configCount ?? 0 }}</span>
                    <span class="text-xs opacity-40 font-medium">/ {{ ns.quota ?? 200 }}</span>
                  </div>
                </TableCell>
                <TableCell class="action-cell">
                  <div class="action-buttons-row">
                    <Button variant="ghost" size="sm" class="action-btn text-primary" @click="handleDetail(ns)">
                      {{ t('namespace.action.details') }}
                    </Button>
                    <span class="action-separator">|</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="action-btn"
                      :class="ns.type === 0 || ns.type === 1 ? 'opacity-30 cursor-not-allowed' : 'text-primary'"
                      :disabled="ns.type === 0 || ns.type === 1"
                      @click="handleEdit(ns)"
                    >
                      {{ t('namespace.action.edit') }}
                    </Button>
                    <span class="action-separator">|</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="action-btn text-destructive"
                      :class="ns.type === 0 || ns.type === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-destructive/10'"
                      :disabled="ns.type === 0 || ns.type === 1"
                      @click="handleDelete(ns)"
                    >
                      {{ t('namespace.action.delete') }}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </template>
            <TableRow v-else-if="!loading">
              <TableCell colspan="5" class="h-64 text-center">
                <div class="flex flex-col items-center justify-center text-muted-foreground">
                  <Icon type="uno" icon="i-mdi-folder-open-outline" class="text-5xl mb-2 opacity-20" />
                  <p>{{ t('namespace.table.empty') }}</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- 新增/编辑 Dialog -->
    <Dialog v-model="formDialogOpen">
      <DialogContent class="max-w-xl rounded-2xl overflow-hidden p-0 gap-0">
        <DialogHeader class="px-6 py-5 border-b bg-muted/10">
          <DialogTitle class="flex items-center gap-2 text-xl font-bold">
            <div class="p-2 rounded-xl bg-primary/10 text-primary">
              <Icon type="uno" :icon="dialogMode === 'add' ? 'i-mdi-plus-box' : 'i-mdi-pencil-box'" class="text-xl" />
            </div>
            {{ dialogMode === 'add' ? t('namespace.dialog.addTitle') : t('namespace.dialog.editTitle') }}
          </DialogTitle>
          <DialogDescription class="ml-11">
            {{ dialogMode === 'add' ? t('namespace.dialog.addTitle') : t('namespace.dialog.editTitle') }}
          </DialogDescription>
        </DialogHeader>

        <div class="p-8 space-y-6">
          <!-- Namespace ID (Add mode only) -->
          <div v-if="dialogMode === 'add'" class="space-y-2">
            <Label class="text-sm font-semibold flex items-center gap-1.5 ml-1">
              {{ t('namespace.dialog.id') }}
              <span class="text-xs text-muted-foreground font-normal">(Optional 不填则自动生成)</span>
            </Label>
            <div class="relative group">
              <Icon type="uno" icon="i-mdi-identifier" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
              <Input
                v-model="form.namespaceId"
                :placeholder="t('namespace.dialog.idPlaceholder')"
                class="pl-10 h-11 transition-all rounded-xl"
                @input="validateId"
              />
            </div>
            <p v-if="errors.namespaceId" class="text-xs text-destructive ml-1">
              {{ errors.namespaceId }}
            </p>
          </div>

          <!-- Namespace Name -->
          <div class="space-y-2">
            <Label class="text-sm font-semibold flex items-center gap-1.5 ml-1">
              {{ t('namespace.dialog.name') }}
              <span class="text-destructive">*</span>
            </Label>
            <div class="relative group">
              <Icon type="uno" icon="i-mdi-tag-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
              <Input
                v-model="form.namespaceShowName"
                :placeholder="t('namespace.dialog.namePlaceholder')"
                class="pl-10 h-11 transition-all rounded-xl"
                @input="validateName"
              />
            </div>
            <p v-if="errors.namespaceShowName" class="text-xs text-destructive ml-1">
              {{ errors.namespaceShowName }}
            </p>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label class="text-sm font-semibold flex items-center gap-1.5 ml-1">
              {{ t('namespace.dialog.description') }}
              <span class="text-destructive">*</span>
            </Label>
            <div class="relative group">
              <Icon type="uno" icon="i-mdi-text-box-outline" class="absolute left-3 top-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
              <Textarea
                v-model="form.namespaceDesc"
                :placeholder="t('namespace.dialog.descriptionPlaceholder')"
                class="pl-10 py-3 min-h-[100px] transition-all rounded-xl"
                @input="validateDesc"
              />
            </div>
            <p v-if="errors.namespaceDesc" class="text-xs text-destructive ml-1">
              {{ errors.namespaceDesc }}
            </p>
          </div>
        </div>

        <div class="px-6 py-4 border-t bg-muted/5 flex justify-end gap-3 uppercase font-bold text-sm tracking-wider">
          <Button variant="outline" class="h-10 px-6 rounded-xl border hover:bg-muted transition-colors" @click="formDialogOpen = false">
            {{ t('config.dialog.cancel') }}
          </Button>
          <Button
            class="h-10 px-8 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
            :disabled="submitting || hasErrors"
            @click="handleSubmit"
          >
            <Icon v-if="submitting" type="uno" icon="i-mdi-loading" class="mr-2 animate-spin" />
            {{ dialogMode === 'add' ? t('namespace.dialog.confirmCreate') : t('namespace.dialog.confirmEdit') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 详情 Dialog -->
    <Dialog v-model="detailsDialogOpen">
      <DialogContent class="max-w-3xl rounded-2xl overflow-hidden p-0 gap-0">
        <DialogHeader class="px-6 py-5 border-b bg-muted/10">
          <DialogTitle class="flex items-center gap-2 text-xl font-bold">
            <div class="p-2 rounded-xl bg-primary/10 text-primary">
              <Icon type="uno" icon="i-mdi-information-outline" class="text-xl" />
            </div>
            {{ t('namespace.dialog.detailTitle') }}
          </DialogTitle>
        </DialogHeader>

        <div class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-1.5">
              <p class="text-xs uppercase font-bold tracking-widest text-muted-foreground">{{ t('namespace.dialog.name') }}</p>
              <p class="text-sm font-semibold text-foreground">{{ namespaceDetail?.namespaceShowName }}</p>
            </div>
            <div class="space-y-1.5">
              <p class="text-xs uppercase font-bold tracking-widest text-muted-foreground">{{ t('namespace.dialog.id') }}</p>
              <p class="text-sm font-mono text-primary font-bold break-all">{{ namespaceDetail?.namespace || 'public (default)' }}</p>
            </div>
            <div class="space-y-1.5">
              <p class="text-xs uppercase font-bold tracking-widest text-muted-foreground">{{ t('namespace.dialog.quota') }}</p>
              <p class="text-sm font-semibold text-foreground">{{ namespaceDetail?.configCount }} / {{ namespaceDetail?.quota ?? 200 }}</p>
            </div>
            <div class="space-y-1.5">
              <p class="text-xs uppercase font-bold tracking-widest text-muted-foreground">Type</p>
              <Badge variant="secondary" class="font-bold text-xs bg-primary/10 text-primary border-none">{{ namespaceDetail?.type === 0 ? 'Public' : 'Custom' }}</Badge>
            </div>
          </div>
          <div class="space-y-1.5 pt-4 border-t border-muted/50">
            <p class="text-xs uppercase font-bold tracking-widest text-muted-foreground">{{ t('namespace.dialog.description') }}</p>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ namespaceDetail?.namespaceDesc || '-' }}</p>
          </div>
        </div>

        <div class="px-6 py-4 border-t bg-muted/5 flex justify-end">
          <Button class="h-10 px-8 rounded-xl font-bold uppercase text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5" @click="detailsDialogOpen = false">
            {{ t('config.history.action.return') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </TooltipProvider>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { namespaceService } from '@/services/namespace/namespace-service'
import type { Namespace } from '@/services/namespace/namespace-service'
import { confirm, alertError, alertSuccess } from '@/utils/dialog'
import { toastSuccess } from '@/utils/toast'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const { t } = useI18n()

definePage({
  meta: {
    locales: ['namespace', 'config'],
  },
})

defineOptions({
  name: 'NamespaceManager'
})

// 数据状态
const namespaceList = ref<Namespace[]>([])
const loading = ref(false)
const submitting = ref(false)

// Dialog 状态
const formDialogOpen = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const detailsDialogOpen = ref(false)
const namespaceDetail = ref<Namespace | null>(null)

// 表单状态
const form = reactive({
  namespaceId: '',
  namespaceShowName: '',
  namespaceDesc: ''
})

const errors = reactive({
  namespaceId: '',
  namespaceShowName: '',
  namespaceDesc: ''
})

const hasErrors = computed(() => {
  return errors.namespaceShowName !== '' || errors.namespaceDesc !== '' || errors.namespaceId !== ''
})

// 加载列表数据
const loadData = async () => {
  loading.value = true
  try {
    namespaceList.value = await namespaceService.getList()
  } catch {
    alertError(t('namespace.message.fetchListFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 表单校验
const validateId = () => {
  if (!form.namespaceId) {
    errors.namespaceId = ''
    return
  }
  if (form.namespaceId.length > 128) {
    errors.namespaceId = t('namespace.dialog.idTooLong')
    return
  }
  const chartReg = /^[\w-]+$/
  if (!chartReg.test(form.namespaceId)) {
    errors.namespaceId = t('namespace.dialog.idInvalid')
    return
  }
  errors.namespaceId = ''
}

const validateName = () => {
  if (!form.namespaceShowName) {
    errors.namespaceShowName = t('namespace.dialog.nameRequired')
    return
  }
  const chartReg = /[@#$%^&*]+/g
  if (chartReg.test(form.namespaceShowName)) {
    errors.namespaceShowName = t('namespace.dialog.invalidChars')
    return
  }
  errors.namespaceShowName = ''
}

const validateDesc = () => {
  if (!form.namespaceDesc) {
    errors.namespaceDesc = t('namespace.dialog.descRequired')
    return
  }
  const chartReg = /[@#$%^&*]+/g
  if (chartReg.test(form.namespaceDesc)) {
    errors.namespaceDesc = t('namespace.dialog.invalidChars')
    return
  }
  errors.namespaceDesc = ''
}

// 操作处理器
const handleRefresh = () => {
  loadData()
}

const handleAdd = () => {
  dialogMode.value = 'add'
  form.namespaceId = ''
  form.namespaceShowName = ''
  form.namespaceDesc = ''
  errors.namespaceId = ''
  errors.namespaceShowName = ''
  errors.namespaceDesc = ''
  formDialogOpen.value = true
}

const handleEdit = async (ns: Namespace) => {
  try {
    loading.value = true
    const detail = await namespaceService.getDetail({ namespaceId: ns.namespace })
    dialogMode.value = 'edit'
    form.namespaceId = detail.namespace
    form.namespaceShowName = detail.namespaceShowName
    form.namespaceDesc = detail.namespaceDesc || ''
    errors.namespaceId = ''
    errors.namespaceShowName = ''
    errors.namespaceDesc = ''
    formDialogOpen.value = true
  } catch {
    alertError(t('namespace.message.fetchDetailFailed'))
  } finally {
    loading.value = false
  }
}

const handleDetail = async (ns: Namespace) => {
  try {
    loading.value = true
    namespaceDetail.value = await namespaceService.getDetail({ namespaceId: ns.namespace })
    detailsDialogOpen.value = true
  } catch {
    alertError(t('namespace.message.fetchDetailFailed'))
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  validateName()
  validateDesc()
  if (dialogMode.value === 'add') validateId()

  if (hasErrors.value) return

  submitting.value = true
  try {
    if (dialogMode.value === 'add') {
      await namespaceService.create({
        namespaceId: form.namespaceId,
        namespaceShowName: form.namespaceShowName,
        namespaceDesc: form.namespaceDesc
      })
      alertSuccess(t('namespace.message.createSuccess'))
    } else {
      await namespaceService.edit({
        namespaceId: form.namespaceId,
        namespaceShowName: form.namespaceShowName,
        namespaceDesc: form.namespaceDesc
      })
      alertSuccess(t('namespace.message.editSuccess'))
    }
    formDialogOpen.value = false
    loadData()
  } catch (err: any) {
    const msg = err.response?.data?.message || (dialogMode.value === 'add' ? t('namespace.message.createFailed') : t('namespace.message.editFailed'))
    alertError(msg)
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (ns: Namespace) => {
  const ok = await confirm(
    h('div', { class: 'pt-4 space-y-4' }, [
      h('p', { class: 'text-sm font-medium' }, t('namespace.dialog.deleteConfirmMsg')),
      h('div', { class: 'bg-muted/30 p-4 rounded-xl border border-border/50 space-y-2' }, [
        h('div', { class: 'flex items-baseline gap-3' }, [
          h('span', { class: 'text-xs uppercase font-bold text-muted-foreground w-24 shrink-0' }, t('namespace.table.name')),
          h('span', { class: 'text-sm font-bold text-destructive break-all' }, ns.namespaceShowName)
        ]),
        h('div', { class: 'flex items-baseline gap-3' }, [
          h('span', { class: 'text-xs uppercase font-bold text-muted-foreground w-24 shrink-0' }, t('namespace.table.id')),
          h('span', { class: 'text-sm font-mono font-bold text-destructive break-all' }, ns.namespace || 'public')
        ])
      ])
    ]),
    t('namespace.dialog.deleteConfirmTitle')
  )

  if (ok) {
    try {
      loading.value = true
      await namespaceService.delete({ namespaceId: ns.namespace })
      toastSuccess(t('namespace.message.deleteSuccess'))
      loadData()
    } catch {
      alertError(t('namespace.message.deleteFailed'))
    } finally {
      loading.value = false
    }
  }
}
</script>

<style scoped lang="scss">
.namespace-page {
  @apply p-6 min-h-screen relative;
  background-color: var(--wm-bg-color-page);

  &::before {
    content: '';
    @apply absolute top-0 right-0 w-[400px] h-[400px];
    background: radial-gradient(circle, var(--wm-color-primary-light-9) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
    opacity: 0.4;
  }
}

.page-title-section {
  @apply mb-8 relative z-10;
  .page-title {
    @apply text-2xl font-bold tracking-tight text-foreground mb-0;
  }
}

.table-card {
  @apply overflow-hidden rounded-2xl border-none relative z-10 bg-background/50 backdrop-blur-sm;

  :deep(th) {
    @apply py-2 px-4 bg-muted/30 font-bold text-sm !important;
  }

  :deep(td) {
    @apply py-1 px-4 text-sm !important;
    height: 40px !important;
    border-bottom: 1px solid var(--wm-border-color-extra-light);
  }

  :deep(tr:last-child td) {
    @apply border-b-0;
  }
}

.action-buttons-row {
  @apply flex items-center gap-1;
}

.action-separator {
  @apply text-muted-foreground/30 text-sm mx-0.5 pointer-events-none;
}

.action-btn {
  @apply h-8 px-2 text-sm font-semibold hover:bg-muted/50 rounded-md transition-colors;
  &:hover:not(:disabled) {
    color: var(--wm-color-primary) !important;
  }
  &.text-destructive:hover:not(:disabled) {
    color: var(--wm-color-danger) !important;
    background-color: var(--wm-color-danger-light-9) !important;
  }
}

.loading-overlay {
  @apply absolute inset-0 z-50 backdrop-blur-sm flex flex-col items-center justify-center bg-background/40;
}

.loading-spinner {
  @apply w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4;
}

.btn-reset {
  @apply h-11 px-5 rounded-xl font-bold transition-all border-2;
  &:hover {
    @apply -translate-y-0.5 shadow-md;
  }
}

.btn-search {
  @apply h-11 px-6 rounded-xl font-bold transition-all;
  &:hover {
    @apply -translate-y-0.5 shadow-lg shadow-primary/20;
  }
}
</style>
