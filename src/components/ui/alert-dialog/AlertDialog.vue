<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: boolean
  class?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue ?? false,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      :class="cn('fixed inset-0 z-[10000] flex items-center justify-center', props.class)"
    >
      <!-- 遮罩层 -->
      <div class="fixed inset-0 bg-black/50" />
      <!-- 内容 -->
      <div class="relative z-10">
        <slot :close="() => emit('update:modelValue', false)" />
      </div>
    </div>
  </Teleport>
</template>
