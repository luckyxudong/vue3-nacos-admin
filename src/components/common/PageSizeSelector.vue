<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  modelValue: number | string | undefined
  options?: number[]
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [10, 20, 50, 100],
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const handleSelect = (val: number, close: () => void) => {
  emit('update:modelValue', val)
  close()
}
</script>

<template>
  <DropdownMenu v-slot="{ isOpen, toggle, close }">
    <Button
      variant="outline"
      size="sm"
      :class="cn('h-8 min-w-[70px] px-2 flex items-center justify-between border-muted-foreground/20 hover:bg-muted/50 rounded-lg transition-all', props.class)"
      @click="toggle"
    >
      <span class="text-xs font-bold text-primary">{{ modelValue }}</span>
      <Icon
        type="uno"
        icon="i-mdi-chevron-down"
        class="text-xs opacity-40 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </Button>

    <DropdownMenuContent
      :is-open="isOpen"
      align="end"
      side="top"
      class="min-w-[80px] p-1 shadow-xl border-muted-foreground/10 bg-background/95 backdrop-blur-sm"
    >
      <DropdownMenuItem
        v-for="opt in options"
        :key="opt"
        :class="cn(
          'rounded-md px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors',
          Number(modelValue) === opt ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-muted-foreground'
        )"
        @click="handleSelect(opt, close)"
      >
        {{ opt }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
