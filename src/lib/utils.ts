import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并类名工具函数
 * 使用 clsx 合并类名，使用 tailwind-merge 处理 Tailwind/UnoCSS 类名冲突
 *
 * @param inputs - 类名数组或对象
 * @returns 合并后的类名字符串
 *
 * @example
 * cn('px-2 py-1', 'bg-red-500', { 'text-white': true })
 * cn('px-2', 'px-4') // 结果: 'px-4' (tailwind-merge 会智能合并冲突的类名)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
