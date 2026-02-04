<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  asChild?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asChild: false,
})
</script>

<template>
  <slot v-if="asChild" v-bind="$attrs" />
  <button
    v-else
    v-bind="$attrs"
    :class="cn(
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      props.class,
    )"
  >
    <slot />
  </button>
</template>
