<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ToastTitle as ToastTitlePrimitive, type ToastTitleProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ToastTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ToastTitlePrimitive
    v-bind="delegatedProps"
    :class="cn('text-sm font-semibold', props.class)"
  >
    <slot />
  </ToastTitlePrimitive>
</template>
