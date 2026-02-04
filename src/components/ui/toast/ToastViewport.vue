<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ToastViewport as ToastViewportPrimitive, type ToastViewportProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ToastViewportProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ToastViewportPrimitive
    v-bind="delegatedProps"
    :class="cn('fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col p-4 md:max-w-[420px]', props.class)"
  />
</template>
