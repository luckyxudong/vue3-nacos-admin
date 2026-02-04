<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const switchClass = computed(() =>
  cn(
    'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50',
    props.modelValue
      ? 'bg-[var(--primary)]'
      : 'bg-[var(--input)]',
    props.class,
  ),
)

const thumbClass = computed(() =>
  cn(
    'pointer-events-none block h-5 w-5 rounded-full bg-[var(--background)] shadow-lg ring-0 transition-transform',
    props.modelValue ? 'translate-x-5' : 'translate-x-0',
  ),
)

const handleClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    :class="switchClass"
    @click="handleClick"
  >
    <span :class="thumbClass" />
  </button>
</template>
