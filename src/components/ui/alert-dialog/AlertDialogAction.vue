<script setup lang="ts">
import { cn } from '@/lib/utils'
import Button from '../button/Button.vue'

interface Props {
  class?: string
  variant?: 'default' | 'destructive'
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (props.onClick) {
    props.onClick()
  }
  emit('click')
}
</script>

<template>
  <Button
    :variant="variant === 'destructive' ? 'destructive' : 'default'"
    :class="cn('mt-2 sm:mt-0', props.class)"
    @click="handleClick"
  >
    <slot />
  </Button>
</template>
