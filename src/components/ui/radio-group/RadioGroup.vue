<script setup lang="ts">
import { provide, computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const groupClass = computed(() =>
  cn('grid gap-2', props.class),
)

const updateValue = (value: string) => {
  if (!props.disabled) {
    emit('update:modelValue', value)
  }
}

provide('radioGroup', {
  modelValue: computed(() => props.modelValue),
  disabled: computed(() => props.disabled),
  updateValue,
})
</script>

<template>
  <div :class="groupClass" role="radiogroup">
    <slot />
  </div>
</template>
