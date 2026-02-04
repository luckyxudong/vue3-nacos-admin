<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string | number
  disabled?: boolean
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectClass = computed(() =>
  cn(
    'flex h-10 w-full items-center justify-between rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm ring-offset-[var(--background)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  ),
)

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    :class="selectClass"
    @change="handleChange"
  >
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <slot />
  </select>
</template>
