// ============================================================
// Storage 工具库 - 可独立复用到任何项目
// 支持过期时间、命名空间、类型安全
// ============================================================

interface StorageItem<T> {
  value: T
  expire?: number // 过期时间戳
  createAt: number
}

type StorageType = 'local' | 'session'

class TypedStorage {
  private prefix: string
  private storage: Storage

  constructor(type: StorageType = 'local', prefix = 'app_') {
    this.prefix = prefix
    this.storage = type === 'local' ? localStorage : sessionStorage
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /** 设置值，支持过期时间（秒） */
  set<T>(key: string, value: T, expireSeconds?: number): void {
    const item: StorageItem<T> = {
      value,
      createAt: Date.now(),
      expire: expireSeconds ? Date.now() + expireSeconds * 1000 : undefined,
    }
    this.storage.setItem(this.getKey(key), JSON.stringify(item))
  }

  /** 获取值，过期返回 null */
  get<T>(key: string, defaultValue?: T): T | null {
    const raw = this.storage.getItem(this.getKey(key))
    if (!raw) return defaultValue ?? null

    try {
      const item: StorageItem<T> = JSON.parse(raw)
      if (item.expire && Date.now() > item.expire) {
        this.remove(key)
        return defaultValue ?? null
      }
      return item.value
    } catch {
      return defaultValue ?? null
    }
  }

  /** 删除 */
  remove(key: string): void {
    this.storage.removeItem(this.getKey(key))
  }

  /** 清除当前命名空间下所有数据 */
  clear(): void {
    const keys: string[] = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key?.startsWith(this.prefix)) {
        keys.push(key)
      }
    }
    keys.forEach((key) => this.storage.removeItem(key))
  }

  /** 检查 key 是否存在且未过期 */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /** 获取所有 key */
  keys(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)
      if (key?.startsWith(this.prefix)) {
        result.push(key.slice(this.prefix.length))
      }
    }
    return result
  }
}

// Default instances
export const storage = new TypedStorage('local')
export const sessionStore = new TypedStorage('session')

// Factory
export const createStorage = (type: StorageType = 'local', prefix?: string) =>
  new TypedStorage(type, prefix)

export default TypedStorage
