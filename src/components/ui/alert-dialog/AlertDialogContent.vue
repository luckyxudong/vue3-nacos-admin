<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :class="cn(
      'relative z-[10001] grid w-fit min-w-[480px] max-w-[95vw] gap-4 border border-[var(--border)] bg-[var(--background)] p-6 shadow-lg sm:rounded-lg',
      props.class,
    )"
    @click.stop
  >
    <slot />
  </div>
</template>
