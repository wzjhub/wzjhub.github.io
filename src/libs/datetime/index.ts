import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/zh-cn'

// ============================================================
// 时间处理工具库 - 可独立复用到任何项目
// 基于 dayjs，提供常用时间操作的便捷封装
// ============================================================

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('zh-cn')

export type DateInput = string | number | Date | dayjs.Dayjs

/** 格式化时间 */
export const formatDate = (date: DateInput, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format)
}

/** 格式化为日期 */
export const formatDay = (date: DateInput): string => {
  return dayjs(date).format('YYYY-MM-DD')
}

/** 格式化为时间 */
export const formatTime = (date: DateInput): string => {
  return dayjs(date).format('HH:mm:ss')
}

/** 相对时间（如：3分钟前） */
export const fromNow = (date: DateInput): string => {
  return dayjs(date).fromNow()
}

/** 两个时间之间的差值 */
export const diff = (
  start: DateInput,
  end: DateInput,
  unit: dayjs.ManipulateType = 'day',
): number => {
  return dayjs(end).diff(dayjs(start), unit)
}

/** 是否是今天 */
export const isToday = (date: DateInput): boolean => {
  return dayjs(date).isSame(dayjs(), 'day')
}

/** 是否在某个时间之前 */
export const isBefore = (date: DateInput, compareDate?: DateInput): boolean => {
  return dayjs(date).isBefore(compareDate ? dayjs(compareDate) : dayjs())
}

/** 是否在某个时间之后 */
export const isAfter = (date: DateInput, compareDate?: DateInput): boolean => {
  return dayjs(date).isAfter(compareDate ? dayjs(compareDate) : dayjs())
}

/** 获取时间戳（秒） */
export const toUnix = (date?: DateInput): number => {
  return date ? dayjs(date).unix() : dayjs().unix()
}

/** 获取时间戳（毫秒） */
export const toTimestamp = (date?: DateInput): number => {
  return date ? dayjs(date).valueOf() : dayjs().valueOf()
}

/** 从时间戳创建 */
export const fromUnix = (timestamp: number): dayjs.Dayjs => {
  return dayjs.unix(timestamp)
}

/** 时间加减 */
export const add = (date: DateInput, value: number, unit: dayjs.ManipulateType): string => {
  return dayjs(date).add(value, unit).format('YYYY-MM-DD HH:mm:ss')
}

export const subtract = (date: DateInput, value: number, unit: dayjs.ManipulateType): string => {
  return dayjs(date).subtract(value, unit).format('YYYY-MM-DD HH:mm:ss')
}

/** 获取某天的开始/结束 */
export const startOf = (date: DateInput, unit: dayjs.ManipulateType = 'day'): string => {
  return dayjs(date).startOf(unit).format('YYYY-MM-DD HH:mm:ss')
}

export const endOf = (date: DateInput, unit: dayjs.ManipulateType = 'day'): string => {
  return dayjs(date).endOf(unit).format('YYYY-MM-DD HH:mm:ss')
}

/** 格式化持续时间（毫秒 → 可读字符串） */
export const formatDuration = (ms: number): string => {
  const d = dayjs.duration(ms)
  if (d.asDays() >= 1) return `${Math.floor(d.asDays())}天${d.hours()}小时`
  if (d.asHours() >= 1) return `${d.hours()}小时${d.minutes()}分钟`
  if (d.asMinutes() >= 1) return `${d.minutes()}分${d.seconds()}秒`
  return `${d.seconds()}秒`
}

/** 时区转换 */
export const toTimezone = (date: DateInput, tz: string, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).tz(tz).format(format)
}

/** 获取当前时间 */
export const now = (format?: string): string => {
  return format ? dayjs().format(format) : dayjs().format('YYYY-MM-DD HH:mm:ss')
}

export { dayjs }
