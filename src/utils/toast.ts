import { h } from 'vue'
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-vue-next'
import { toast } from '@/components/ui/toast'

/**
 * 显示成功提示
 * @param message 提示消息
 * @param title 标题（可选）
 */
export function toastSuccess(message: string, title?: string) {
  toast({
    title: title || '成功',
    description: message,
    variant: 'success',
    icon: h(CheckCircle2, { class: 'text-green-600 dark:text-green-400' }),
  })
}

/**
 * 显示错误提示
 * @param message 错误消息
 * @param title 标题（可选）
 */
export function toastError(message: string, title?: string) {
  toast({
    title: title || '错误',
    description: message,
    variant: 'destructive',
    icon: h(XCircle, { class: 'text-red-600 dark:text-red-400' }),
  })
}

/**
 * 显示警告提示
 * @param message 警告消息
 * @param title 标题（可选）
 */
export function toastWarning(message: string, title?: string) {
  toast({
    title: title || '警告',
    description: message,
    variant: 'warning',
    icon: h(AlertTriangle, { class: 'text-yellow-600 dark:text-yellow-400' }),
  })
}

/**
 * 显示信息提示
 * @param message 信息消息
 * @param title 标题（可选）
 */
export function toastInfo(message: string, title?: string) {
  toast({
    title: title || '提示',
    description: message,
    variant: 'info',
    icon: h(Info, { class: 'text-blue-600 dark:text-blue-400' }),
  })
}
