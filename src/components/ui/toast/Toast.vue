<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import {
  ToastRoot as ToastRootPrimitive,
  type ToastRootEmits,
  type ToastRootProps,
  useForwardPropsEmits,
} from 'radix-vue'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-top-full data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-top-full data-[state=closed]:zoom-out-95 data-[swipe=end]:animate-out',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-50',
        warning: 'border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-50',
        info: 'border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type ToastVariants = VariantProps<typeof toastVariants>

interface Props extends ToastRootProps {
  class?: HTMLAttributes['class']
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  icon?: any
}

const props = defineProps<Props>()
const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, variant: __, icon: ___, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToastRootPrimitive
    v-bind="forwarded"
    :class="cn(toastVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </ToastRootPrimitive>
</template>
