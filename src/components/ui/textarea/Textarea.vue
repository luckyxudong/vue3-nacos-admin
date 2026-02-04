<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  rows?: number
  class?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaClass = computed(() =>
  cn(
    'flex min-h-[80px] w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm ring-offset-[var(--background)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  ),
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="textareaClass"
    @input="handleInput"
  />
</template>
