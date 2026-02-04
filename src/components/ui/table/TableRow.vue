<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <tr
    :class="cn(
      'border-b transition-colors hover:bg-[var(--muted)]/50 data-[state=selected]:bg-[var(--muted)]',
      props.class,
    )"
  >
    <slot />
  </tr>
</template>
