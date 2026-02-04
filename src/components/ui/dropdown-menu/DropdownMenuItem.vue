<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
</script>

<template>
  <div
    :class="cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class,
    )"
    :data-disabled="disabled || undefined"
  >
    <slot />
  </div>
</template>
