<script setup lang="ts">
import { ToastProvider as ToastProviderPrimitive, type ToastProviderProps } from 'radix-vue'

const props = defineProps<ToastProviderProps>()
</script>

<template>
  <ToastProviderPrimitive v-bind="props">
    <slot />
  </ToastProviderPrimitive>
</template>
