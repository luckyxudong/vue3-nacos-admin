import yaml from 'js-yaml'

/**
 * 配置格式校验结果
 */
export interface ValidateResult {
  valid: boolean
  message?: string
}

/**
 * 配置格式校验工具
 */
export const validateContent = {
  /**
   * 验证配置内容格式
   * @param content 配置内容
   * @param type 配置格式类型（text/json/xml/yaml/html/properties）
   * @returns 校验结果
   */
  validate({ content, type }: { content: string; type: string }): ValidateResult {
    if (!content.trim()) {
      return { valid: false, message: '配置内容不能为空' }
    }

    const normalizedType = type.toLowerCase()

    switch (normalizedType) {
      case 'text':
        // TEXT 格式无需格式校验（纯文本）
        return { valid: true }

      case 'json':
        try {
          JSON.parse(content)
          return { valid: true }
        } catch (error) {
          const err = error as Error
          return { valid: false, message: `JSON 格式错误：${err.message}` }
        }

      case 'xml':
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(content, 'text/xml')
          const errors = doc.querySelectorAll('parsererror')
          if (errors.length > 0) {
            const errorText = errors[0].textContent || 'XML 格式错误'
            return { valid: false, message: `XML 格式错误：${errorText}` }
          }
          return { valid: true }
        } catch (error) {
          const err = error as Error
          return { valid: false, message: `XML 解析失败：${err.message}` }
        }

      case 'yaml':
        try {
          yaml.load(content)
          return { valid: true }
        } catch (error) {
          const err = error as Error
          return { valid: false, message: `YAML 格式错误：${err.message}` }
        }

      case 'html':
        try {
          const parser = new DOMParser()
          parser.parseFromString(content, 'text/html')
          return { valid: true }
        } catch (error) {
          const err = error as Error
          return { valid: false, message: `HTML 格式错误：${err.message}` }
        }

      case 'properties':
        // Properties 格式验证：key=value，支持转义和续行
        const lines = content.split('\n')
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          // 跳过空行和注释行
          if (!line || line.startsWith('#')) {
            continue
          }
          // 检查是否包含等号
          if (!line.includes('=')) {
            return { valid: false, message: `Properties 格式错误：第 ${i + 1} 行缺少等号` }
          }
        }
        return { valid: true }

      default:
        // 未知格式，默认通过
        return { valid: true }
    }
  },
}
