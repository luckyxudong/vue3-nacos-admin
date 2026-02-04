import { Env } from '@/utils/env'
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import type { HttpClientConfig } from './types'
import { Interceptors } from './interceptors'
import { RequestCanceler } from './request-canceler'
import { PluginManager } from './plugin-manager'

// HTTP请求客户端的默认配置
const defaultConfig: HttpClientConfig = {
  baseURL: Env.get('VITE_API_BASE_URL', '/'),
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  enableCancel: true,
}

/**
 * HttpClient 基础 HTTP 客户端类
 * 负责创建 Axios 实例和封装基础请求方法
 */
export class HttpClient {
  protected instance: AxiosInstance
  protected config: HttpClientConfig
  private interceptors: Interceptors
  private pluginManager: PluginManager
  private requestCanceler: RequestCanceler

  /**
   * 构造函数
   * @param config 配置选项
   */
  constructor(config: HttpClientConfig = {}) {
    this.config = { ...defaultConfig, ...config }
    this.interceptors = new Interceptors(this.config.interceptor ?? {})
    this.pluginManager = new PluginManager()
    this.requestCanceler = new RequestCanceler()

    this.instance = this.createInstance()
    this.registerPlugins()
    this.setInterceptors()
  }

  /**
   * 创建 Axios 实例
   * @returns AxiosInstance
   */
  private createInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.config.headers,
    })
  }

  /**
   * 注册插件
   */
  private registerPlugins(): void {
    // 根据配置注册插件
    if (this.config.enableCancel) {
      this.pluginManager.register(this.requestCanceler)
    }

    // 应用所有插件
    this.pluginManager.applyAll(this.instance)
  }

  /**
   * 设置拦截器
   */
  private setInterceptors(): void {
    this.interceptors.applyInterceptors(this.instance)
  }

  /**
   * 封装 GET 请求
   * @param url 请求地址
   * @param config 请求配置
   */
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  /**
   * 封装 POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  /**
   * 封装 PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  /**
   * 封装 DELETE 请求
   * @param url 请求地址
   * @param config 请求配置
   * @returns Promise<T>
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  /**
   * 封装 PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   */
  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }

  /**
   * 获取 Axios 实例
   * @returns AxiosInstance
   */
  public getInstance(): AxiosInstance {
    return this.instance
  }

  /**
   * 取消所有请求
   */
  public cancelAll(): void {
    this.requestCanceler.clear()
  }

  /**
   * 获取插件管理器
   * 便于后续动态添加或移除插件
   */
  public getPluginManager(): PluginManager {
    return this.pluginManager
  }
}
