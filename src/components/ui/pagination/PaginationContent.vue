<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <ul :class="cn('flex flex-row items-center gap-1', props.class)">
    <slot />
  </ul>
</template>
