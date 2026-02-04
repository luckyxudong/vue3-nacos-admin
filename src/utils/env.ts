/**
 * 环境变量工具类
 * 提供统一的环境变量访问接口，支持类型转换和环境判断
 */
export class Env {
  /**
   * 获取环境变量
   * @param key 环境变量名（必须是 ImportMetaEnv 中定义的键）
   * @param defaultValue 默认值（当环境变量不存在时返回）
   * @returns 环境变量值或默认值
   */
  static get<T>(key: keyof ImportMetaEnv, defaultValue?: T): T | string {
    const value = import.meta.env[key]
    return value ?? (defaultValue as T)
  }

  /**
   * 获取数字类型的环境变量
   * @param key 环境变量名
   * @param defaultValue 默认值（当环境变量不存在时返回）
   * @returns 转换后的数字值或默认值
   */
  static getNumber(key: keyof ImportMetaEnv, defaultValue?: number): number {
    const value = import.meta.env[key]
    if (value === undefined) {
      return defaultValue as number
    }
    return Number(value)
  }

  /**
   * 获取布尔类型的环境变量
   * @param key 环境变量名
   * @param defaultValue 默认值（当环境变量不存在时返回）
   * @returns 转换后的布尔值或默认值
   * @remarks 字符串 'true' 或 '1' 会被转换为 true，其他值转换为 false
   */
  static getBoolean(key: keyof ImportMetaEnv, defaultValue?: boolean): boolean {
    const value = import.meta.env[key]
    if (value === undefined) {
      return defaultValue as boolean
    }
    return value === 'true' || value === '1'
  }

  /** 获取当前环境 */
  static get env(): 'dev' | 'mock' | 'uat' | 'prod' {
    return this.get('VITE_ENV', 'dev') as 'dev' | 'mock' | 'uat' | 'prod'
  }

  /** 是否为开发环境 */
  static get isDev(): boolean {
    return this.env === 'dev'
  }

  /** 是否为UAT环境 */
  static get isUat(): boolean {
    return this.env === 'uat'
  }

  /** 是否为生产环境 */
  static get isProd(): boolean {
    return this.env === 'prod'
  }
}
