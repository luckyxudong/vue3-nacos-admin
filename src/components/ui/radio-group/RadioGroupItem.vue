<script setup lang="ts">
import { inject, computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  id?: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const radioGroup = inject<{
  modelValue: { value: string | undefined }
  disabled: { value: boolean }
  updateValue: (value: string) => void
}>('radioGroup', null as any)

const isChecked = computed(() => radioGroup?.modelValue.value === props.value)
const isDisabled = computed(() => props.disabled || radioGroup?.disabled.value || false)

const itemClass = computed(() =>
  cn(
    'aspect-square h-4 w-4 rounded-full border border-[var(--primary)] text-[var(--primary)] ring-offset-[var(--background)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  ),
)

const handleClick = () => {
  if (!isDisabled.value && radioGroup) {
    radioGroup.updateValue(props.value)
  }
}
</script>

<template>
  <button
    :id="id"
    type="button"
    role="radio"
    :aria-checked="isChecked"
    :disabled="isDisabled"
    :class="itemClass"
    @click="handleClick"
  >
    <span
      v-if="isChecked"
      class="absolute inset-0 flex items-center justify-center"
    >
      <span class="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
    </span>
  </button>
</template>

<style scoped>
button {
  position: relative;
}
</style>
