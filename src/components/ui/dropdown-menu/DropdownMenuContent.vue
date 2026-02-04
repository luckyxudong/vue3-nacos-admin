<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  align?: 'start' | 'end' | 'center'
  side?: 'top' | 'bottom' | 'left' | 'right'
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  align: 'end',
  side: 'bottom',
  isOpen: false,
})

const alignClasses = {
  start: 'left-0',
  end: 'right-0',
  center: 'left-1/2 -translate-x-1/2',
}

const sideClasses = {
  top: 'bottom-full mb-1',
  bottom: 'top-full mt-1',
  left: 'right-full mr-1 top-0',
  right: 'left-full ml-1 top-0',
}
</script>

<template>
  <div
    v-if="isOpen"
    :class="cn(
      'absolute z-[1000] min-w-[8rem] overflow-hidden rounded-md border border-[var(--border)] bg-[var(--popover)] p-1 text-[var(--popover-foreground)] shadow-md animate-in fade-in zoom-in-95 duration-100',
      alignClasses[props.align],
      sideClasses[props.side],
      props.class,
    )"
  >
    <slot />
  </div>
</template>
