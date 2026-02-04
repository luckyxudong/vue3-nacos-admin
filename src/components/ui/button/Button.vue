<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  asChild: false,
})

const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90',
  destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90',
  outline: 'border border-[var(--input)] bg-[var(--background)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
  secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80',
  ghost: 'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
  link: 'text-[var(--primary)] underline-offset-4 hover:underline',
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
  'icon-sm': 'h-9 w-9',
  'icon-lg': 'h-11 w-11',
}

const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'

const buttonClass = computed(() => cn(baseClasses, variantClasses[props.variant], sizeClasses[props.size], props.class))
</script>

<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>
