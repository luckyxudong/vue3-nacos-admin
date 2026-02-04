<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = defineProps<Props>()
const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

defineExpose({
  open,
  toggle,
  close,
})
</script>

<template>
  <div :class="cn('relative inline-block text-left', props.class)">
    <slot :is-open="isOpen" :open="open" :toggle="toggle" :close="close" />
  </div>
</template>
