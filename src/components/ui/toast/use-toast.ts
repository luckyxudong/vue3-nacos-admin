import type { Component, VNode } from 'vue'
import { ref, computed, h } from 'vue'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 3000

type ToasterToast = {
  id: string
  title?: string
  description?: string | VNode
  action?: Component
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  icon?: Component | VNode
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function addToRemoveQueue(toastId: string) {
  // 清除之前的定时器
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId))
    toastTimeouts.delete(toastId)
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const state = ref<State>({
  toasts: [],
})

function dispatch(action: Action) {
  switch (action.type) {
    case 'ADD_TOAST':
      state.value.toasts = [action.toast, ...state.value.toasts].slice(0, TOAST_LIMIT)
      break

    case 'UPDATE_TOAST':
      state.value.toasts = state.value.toasts.map(t =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t,
      )
      break

    case 'DISMISS_TOAST': {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      }
      else {
        state.value.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      state.value.toasts = state.value.toasts.map(t =>
        t.id === toastId || toastId === undefined
          ? {
              ...t,
              open: false,
            }
          : t,
      )
      break
    }

    case 'REMOVE_TOAST':
      if (action.toastId === undefined)
        state.value.toasts = []
      else
        state.value.toasts = state.value.toasts.filter(t => t.id !== action.toastId)

      break
  }
}

function toast(props: Omit<ToasterToast, 'id'>) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })

  const dismiss = () => {
    // 清除自动关闭定时器
    if (toastTimeouts.has(id)) {
      clearTimeout(toastTimeouts.get(id))
      toastTimeouts.delete(id)
    }
    dispatch({ type: 'DISMISS_TOAST', toastId: id })
  }

  const toastData: ToasterToast = {
    ...props,
    id,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open)
        dismiss()
    },
  }

  dispatch({
    type: 'ADD_TOAST',
    toast: toastData,
  })

  // 自动关闭：2秒后自动关闭
  const autoCloseTimeout = setTimeout(() => {
    dismiss()
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(id, autoCloseTimeout)

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
    toasts: computed(() => state.value.toasts),
  }
}

export { toast, useToast }
