<script setup lang="ts">
import { isVNode, h } from 'vue'
import { useToast } from './use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '.'

const { toasts } = useToast()
</script>

<template>
  <ToastProvider>
    <Toast
      v-for="toastItem in toasts"
      :key="toastItem.id"
      :open="toastItem.open ?? true"
      :variant="toastItem.variant"
      @update:open="(open: boolean) => toastItem.onOpenChange?.(open)"
    >
      <div class="flex items-start gap-3">
        <div v-if="toastItem.icon" class="flex-shrink-0 mt-0.5">
          <component :is="toastItem.icon" class="w-5 h-5" />
        </div>
        <div class="grid gap-1 flex-1">
          <ToastTitle v-if="toastItem.title">
            {{ toastItem.title }}
          </ToastTitle>
          <template v-if="toastItem.description">
            <ToastDescription v-if="isVNode(toastItem.description)">
              <component :is="toastItem.description" />
            </ToastDescription>
            <ToastDescription v-else>
              {{ toastItem.description }}
            </ToastDescription>
          </template>
        </div>
        <ToastClose />
      </div>
      <component v-if="toastItem.action" :is="toastItem.action" />
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
