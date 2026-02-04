<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <nav
    role="navigation"
    aria-label="pagination"
    :class="cn('mx-auto flex w-full justify-center', props.class)"
  >
    <slot />
  </nav>
</template>
