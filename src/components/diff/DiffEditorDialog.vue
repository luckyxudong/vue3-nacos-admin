<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import _CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/merge/merge.css'
import 'codemirror/addon/merge/merge.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/properties/properties.js'
import DiffMatchPatch from 'diff-match-patch'

// Make diff-match-patch available globally for CodeMirror
window.diff_match_patch = DiffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0

const props = withDefaults(defineProps<{
  originalContent: string
  modifiedContent: string
  language?: string
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  showConfirm?: boolean
  primaryCancel?: boolean
  open?: boolean
}>(), {
  showConfirm: true,
  primaryCancel: false,
  open: false
})

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'update:open', value: boolean): void
}>()

const isOpen = computed({
  get: () => props.open || false,
  set: (val) => emit('update:open', val)
})

const editorContainer = ref<HTMLElement | null>(null)
let mergeView: any = null

const cmMode = computed(() => {
  const lang = props.language?.toLowerCase() || 'text'
  const modeMap: Record<string, string> = {
    json: 'application/json',
    javascript: 'javascript',
    js: 'javascript',
    xml: 'xml',
    html: 'htmlmixed',
    css: 'css',
    yaml: 'yaml',
    properties: 'properties',
    ini: 'properties',
    text: 'text/plain'
  }
  return modeMap[lang] || 'text/plain'
})

const initMergeView = () => {
  if (!editorContainer.value) return

  if (mergeView) {
    editorContainer.value.innerHTML = ''
    mergeView = null
  }

  mergeView = _CodeMirror.MergeView(editorContainer.value, {
    value: props.modifiedContent,
    origLeft: undefined,
    orig: props.originalContent,
    lineNumbers: true,
    mode: cmMode.value,
    theme: 'default', // or 'xq-light'
    highlightDifferences: true,
    connect: 'align',
    collapseIdentical: false,
    readOnly: true, // Both read-only for confirmation
    revertButtons: false,
  } as any)
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      nextTick(() => {
        initMergeView()
      })
    }
  }
)

onMounted(() => {
  if (props.open) {
    initMergeView()
  }
})

onBeforeUnmount(() => {
  if (mergeView) {
    // CodeMirror MergeView doesn't have a direct `toTextArea` or `dispose` method like regular CM instances.
    // Clearing the container is usually sufficient for cleanup in Vue's lifecycle.
    if (editorContainer.value) {
      editorContainer.value.innerHTML = ''
    }
    mergeView = null
  }
})

const handleConfirm = () => {
  emit('confirm')
  emit('update:open', false)
}
</script>

<template>
  <Dialog v-model="isOpen">
    <DialogContent class="w-[95vw] max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
      <DialogHeader class="px-6 py-4 border-b">
        <DialogTitle>{{ title || '内容比较' }}</DialogTitle>
        <DialogDescription>
          {{ description || '请确认更改内容。' }}
        </DialogDescription>
      </DialogHeader>

      <div class="flex items-center border-b bg-muted/40 text-xs font-medium text-muted-foreground select-none">
        <div class="flex-1 text-center py-2 border-r flex items-center justify-center gap-2">
           <span class="w-2 h-2 rounded-full bg-green-500/50"></span>
           当前值 (Modified)
        </div>
        <div class="flex-1 text-center py-2 flex items-center justify-center gap-2">
           <span class="w-2 h-2 rounded-full bg-red-500/50"></span>
           原始值 (Original)
        </div>
      </div>

      <div class="flex-1 w-full relative overflow-hidden bg-white">
         <div ref="editorContainer" class="h-full w-full text-sm"></div>
      </div>

      <DialogFooter class="px-6 py-4 border-t bg-muted/10 flex justify-end gap-3">
        <Button
          :variant="primaryCancel ? 'default' : 'outline'"
          :class="primaryCancel ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20' : ''"
          @click="isOpen = false"
        >
          {{ cancelText || $t('config.dialog.cancel') }}
        </Button>
        <Button
          v-if="showConfirm !== false"
          class="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          @click="handleConfirm"
        >
          {{ confirmText || '确认发布' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
:deep(.CodeMirror) {
  height: 100%;
  font-family: 'Fira Code', Consolas, monospace;
}
:deep(.CodeMirror-merge) {
  height: 100%;
  border: none;
}
:deep(.CodeMirror-merge-pane) {
  height: 100%;
}
</style>
