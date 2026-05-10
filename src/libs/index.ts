// ============================================================
// 通用工具库统一导出
// 使用方式：import { http, formatDate, storage } from '@libs'
// ============================================================

export { http, createHttp } from './request'
export type { RequestConfig, ResponseData } from './request'

export {
  formatDate,
  formatDay,
  formatTime,
  fromNow,
  diff,
  isToday,
  isBefore,
  isAfter,
  toUnix,
  toTimestamp,
  fromUnix,
  add,
  subtract,
  startOf,
  endOf,
  formatDuration,
  toTimezone,
  now,
  dayjs,
} from './datetime'

export { storage, sessionStore, createStorage } from './storage'

export {
  formatNumber,
  formatCurrency,
  formatFileSize,
  formatPercent,
  maskPhone,
  maskIdCard,
  maskEmail,
  formatBankCard,
  toChineseNumber,
  formatSeconds,
  abbreviateNumber,
} from './format'

export {
  isPhone,
  isEmail,
  isIdCard,
  isUrl,
  isIP,
  isStrongPassword,
  isChineseName,
  isBankCard,
  createRule,
  rules,
} from './validators'
