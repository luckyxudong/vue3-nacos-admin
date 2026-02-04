export /**
 * 将 UnoCSS 图标格式转换为 Iconify 格式
 * 例如：i-mdi-view-dashboard -> mdi:view-dashboard
 */
const convertIconToIconify = (icon?: string): string | undefined => {
  if (!icon) return undefined
  // 如果已经是 Iconify 格式（包含冒号），直接返回
  if (icon.includes(':')) return icon
  // 移除 i- 前缀
  const withoutPrefix = icon.replace(/^i-/, '')
  // 将第一个连字符替换为冒号
  const firstDashIndex = withoutPrefix.indexOf('-')
  if (firstDashIndex === -1) return withoutPrefix
  return `${withoutPrefix.substring(0, firstDashIndex)}:${withoutPrefix.substring(firstDashIndex + 1)}`
}
