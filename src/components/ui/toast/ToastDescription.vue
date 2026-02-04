<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ToastDescription as ToastDescriptionPrimitive, type ToastDescriptionProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ToastDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ToastDescriptionPrimitive
    v-bind="delegatedProps"
    :class="cn('text-sm opacity-90', props.class)"
  >
    <slot />
  </ToastDescriptionPrimitive>
</template>
