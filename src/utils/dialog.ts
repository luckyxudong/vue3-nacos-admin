import { ref, h, createApp, type VNode } from 'vue'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

/**
 * 显示确认对话框
 * @param message 消息内容 (支持字符串、字符串数组或 VNode)
 * @param title 标题（可选，默认为"确认"）
 * @returns Promise<boolean> 用户点击确认返回 true，取消返回 false
 */
export function confirm(message: string | string[] | VNode, title = '确认', options?: { type?: 'primary' | 'danger' }): Promise<boolean> {
  return new Promise((resolve) => {
    const dialogOpen = ref(true)
    let app: any = null
    const type = options?.type || 'primary'

    const closeDialog = (result: boolean) => {
      dialogOpen.value = false
      setTimeout(() => {
        if (app) {
          app.unmount()
        }
        container.remove()
        resolve(result)
      }, 200)
    }

    const container = document.createElement('div')
    document.body.appendChild(container)

    // 使用 createApp 创建组件实例，确保事件能正确绑定
    const DialogWrapper = {
      setup() {
        return () => h(AlertDialog, {
          modelValue: dialogOpen.value,
          'onUpdate:modelValue': (value: boolean) => {
            dialogOpen.value = value
            if (!value) {
              closeDialog(false)
            }
          }
        }, {
          default: () => h(AlertDialogContent, { class: 'bg-background text-foreground' }, {
            default: () => [
              h(AlertDialogHeader, {}, {
                default: () => [
                  h(AlertDialogTitle, {}, { default: () => title }),
                  h(AlertDialogDescription, {}, {
                    default: () => h('div', { class: 'text-left leading-relaxed' },
                      typeof message === 'string'
                        ? h('div', { class: 'whitespace-pre-wrap' }, message)
                        : Array.isArray(message)
                          ? message.map(line => h('div', { class: 'min-h-[1.5em]' }, line))
                          : message // VNode
                    )
                  }),
                ],
              }),
              h(AlertDialogFooter, {}, {
                default: () => [
                  h(AlertDialogCancel, {
                    onClick: () => {
                      closeDialog(false)
                    }
                  }, { default: () => '取消' }),
                  h(AlertDialogAction, {
                    variant: type === 'danger' ? 'destructive' : 'default',
                    style: type !== 'danger' ? { backgroundColor: 'var(--wm-color-primary)', color: 'white' } : undefined,
                    onClick: () => {
                      closeDialog(true)
                    }
                  }, { default: () => '确认' }),
                ],
              }),
            ],
          }),
        })
      }
    }

    app = createApp(DialogWrapper)
    app.mount(container)
  })
}

/**
 * 显示警告对话框（类似 alert）
 * @param message 消息内容
 * @param title 标题（可选，默认为"提示"）
 * @returns Promise<void>
 */
export function alert(message: string | string[], title = '提示', options: { confirmButtonText?: string } = {}): Promise<void> {
  return new Promise((resolve) => {
    const dialogOpen = ref(true)
    let app: any = null

    const closeDialog = () => {
      dialogOpen.value = false
      setTimeout(() => {
        if (app) {
          app.unmount()
        }
        container.remove()
        resolve()
      }, 200)
    }

    const container = document.createElement('div')
    document.body.appendChild(container)

    const DialogWrapper = {
      setup() {
        return () => h(AlertDialog, {
          modelValue: dialogOpen.value,
          'onUpdate:modelValue': (value: boolean) => {
            dialogOpen.value = value
            if (!value) {
              closeDialog()
            }
          }
        }, {
          default: () => h(AlertDialogContent, { class: 'bg-background text-foreground' }, {
            default: () => [
              h(AlertDialogHeader, {}, {
                default: () => [
                  h(AlertDialogTitle, {}, { default: () => title }),
                  h(AlertDialogDescription, {}, {
                    default: () => h('div', { class: 'text-left leading-relaxed' },
                      Array.isArray(message)
                        ? message.map(line => h('div', { class: 'min-h-[1.5em]' }, line))
                        : h('div', { class: 'whitespace-pre-wrap' }, message)
                    )
                  }),
                ],
              }),
              h(AlertDialogFooter, {}, {
                default: () => [
                  h(AlertDialogAction, {
                    style: { backgroundColor: 'var(--wm-color-primary)', color: 'white' },
                    onClick: () => {
                      closeDialog()
                    }
                  }, { default: () => options.confirmButtonText || '确定' }),
                ],
              }),
            ],
          }),
        })
      }
    }

    app = createApp(DialogWrapper)
    app.mount(container)
  })
}

/**
 * 显示错误对话框
 * @param message 错误消息
 * @param title 标题（可选，默认为"错误"）
 * @returns Promise<void>
 */
export function alertError(message: string, title = '错误'): Promise<void> {
  return new Promise((resolve) => {
    const dialogOpen = ref(true)
    let app: any = null

    const closeDialog = () => {
      dialogOpen.value = false
      setTimeout(() => {
        if (app) {
          app.unmount()
        }
        container.remove()
        resolve()
      }, 200)
    }

    const container = document.createElement('div')
    document.body.appendChild(container)

    const DialogWrapper = {
      setup() {
        return () => h(AlertDialog, {
          modelValue: dialogOpen.value,
          'onUpdate:modelValue': (value: boolean) => {
            dialogOpen.value = value
            if (!value) {
              closeDialog()
            }
          }
        }, {
          default: () => h(AlertDialogContent, { class: 'bg-background text-foreground' }, {
            default: () => [
              h(AlertDialogHeader, {}, {
                default: () => [
                  h(AlertDialogTitle, {}, { default: () => title }),
                  h(AlertDialogDescription, {}, { default: () => message }),
                ],
              }),
              h(AlertDialogFooter, {}, {
                default: () => [
                  h(AlertDialogAction, {
                    variant: 'destructive',
                    onClick: () => {
                      closeDialog()
                    }
                  }, { default: () => '确定' }),
                ],
              }),
            ],
          }),
        })
      }
    }

    app = createApp(DialogWrapper)
    app.mount(container)
  })
}

/**
 * 显示成功对话框
 * @param message 成功消息
 * @param title 标题（可选，默认为"成功"）
 * @returns Promise<void>
 */
export function alertSuccess(message: string | string[], title = '成功'): Promise<void> {
  return alert(message, title)
}
