import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

// ============================================================
// HTTP 请求封装 - 可独立复用到任何项目
// 特性：拦截器、重试、取消请求、超时、错误统一处理
// ============================================================

interface RequestConfig extends AxiosRequestConfig {
  /** 重试次数 */
  retry?: number
  /** 重试延迟(ms) */
  retryDelay?: number
  /** 是否跳过错误提示 */
  silent?: boolean
}

interface ResponseData<T = unknown> {
  code: number
  data: T
  message: string
}

type RequestInterceptor = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
type ResponseInterceptor = (response: AxiosResponse) => AxiosResponse
type ErrorHandler = (error: unknown) => void

class HttpClient {
  private instance: AxiosInstance
  private abortControllers: Map<string, AbortController> = new Map()
  private errorHandler?: ErrorHandler

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Auto-attach token if exists
        const token = localStorage.getItem('token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config as RequestConfig

        // Retry logic
        if (config?.retry && config.retry > 0) {
          config.retry -= 1
          await new Promise((resolve) => setTimeout(resolve, config.retryDelay || 1000))
          return this.instance(config)
        }

        // Error handling
        if (!config?.silent && this.errorHandler) {
          this.errorHandler(error)
        }

        return Promise.reject(error)
      },
    )
  }

  /** 注册自定义请求拦截器 */
  useRequestInterceptor(interceptor: RequestInterceptor) {
    this.instance.interceptors.request.use(interceptor)
    return this
  }

  /** 注册自定义响应拦截器 */
  useResponseInterceptor(interceptor: ResponseInterceptor) {
    this.instance.interceptors.response.use(interceptor)
    return this
  }

  /** 设置全局错误处理器 */
  setErrorHandler(handler: ErrorHandler) {
    this.errorHandler = handler
    return this
  }

  /** 生成取消请求的 key */
  private getAbortKey(config: AxiosRequestConfig): string {
    return `${config.method}-${config.url}-${JSON.stringify(config.params)}`
  }

  /** 取消重复请求 */
  private cancelDuplicate(config: AxiosRequestConfig) {
    const key = this.getAbortKey(config)
    if (this.abortControllers.has(key)) {
      this.abortControllers.get(key)!.abort()
    }
    const controller = new AbortController()
    this.abortControllers.set(key, controller)
    config.signal = controller.signal
  }

  /** 取消所有进行中的请求 */
  cancelAll() {
    this.abortControllers.forEach((controller) => controller.abort())
    this.abortControllers.clear()
  }

  async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    this.cancelDuplicate({ ...config, url, method: 'get' })
    const response = await this.instance.get<ResponseData<T>>(url, config)
    return response.data.data
  }

  async post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.instance.post<ResponseData<T>>(url, data, config)
    return response.data.data
  }

  async put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.instance.put<ResponseData<T>>(url, data, config)
    return response.data.data
  }

  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    const response = await this.instance.delete<ResponseData<T>>(url, config)
    return response.data.data
  }

  /** 文件上传 */
  async upload<T = unknown>(url: string, file: File, fieldName = 'file', config?: RequestConfig): Promise<T> {
    const formData = new FormData()
    formData.append(fieldName, file)
    const response = await this.instance.post<ResponseData<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    })
    return response.data.data
  }

  /** 文件下载 */
  async download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob',
      ...config,
    })
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename || 'download'
    link.click()
    URL.revokeObjectURL(link.href)
  }
}

// Default instance
export const http = new HttpClient()

// Factory for custom instances
export const createHttp = (config?: AxiosRequestConfig) => new HttpClient(config)

export type { RequestConfig, ResponseData }
export default HttpClient
