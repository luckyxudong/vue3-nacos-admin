<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

interface Props {
  variant?: BadgeVariant
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80',
  secondary: 'border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80',
  destructive: 'border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/80',
  outline: 'text-[var(--foreground)]',
}

const badgeClass = computed(() =>
  cn(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2',
    variantClasses[props.variant],
    props.class,
  ),
)
</script>

<template>
  <div :class="badgeClass">
    <slot />
  </div>
</template>
