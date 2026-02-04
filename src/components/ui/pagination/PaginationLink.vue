<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  active?: boolean
  disabled?: boolean
  class?: string
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  disabled: false,
})

const linkClass = computed(() =>
  cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-[var(--background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    props.active
      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
      : 'hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)]',
    props.class,
  ),
)
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :class="linkClass"
    :aria-disabled="disabled"
  >
    <slot />
  </a>
  <button
    v-else
    type="button"
    :class="linkClass"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
