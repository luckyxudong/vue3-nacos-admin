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

const close = () => {
  isOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        :class="cn('fixed inset-0 z-[9999] flex items-center justify-center', props.class)"
      >
        <!-- 遮罩层 -->
        <div class="fixed inset-0 bg-black/50 transition-opacity duration-200" />
        <!-- 内容 -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div v-if="isOpen" class="relative z-10">
            <slot :close="close" />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
