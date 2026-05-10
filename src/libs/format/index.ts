// ============================================================
// 数据格式化工具库 - 可独立复用到任何项目
// 数字、货币、文件大小、手机号、身份证等格式化
// ============================================================

/** 数字千分位格式化 */
export const formatNumber = (num: number, decimals = 0): string => {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** 货币格式化 */
export const formatCurrency = (
  amount: number,
  currency = 'CNY',
  locale = 'zh-CN',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/** 文件大小格式化 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/** 百分比格式化 */
export const formatPercent = (value: number, decimals = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`
}

/** 手机号脱敏 */
export const maskPhone = (phone: string): string => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/** 身份证脱敏 */
export const maskIdCard = (idCard: string): string => {
  return idCard.replace(/(\d{4})\d{10}(\d{4})/, '$1**********$2')
}

/** 邮箱脱敏 */
export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@')
  const masked = name.length > 2
    ? `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`
    : `${name[0]}*`
  return `${masked}@${domain}`
}

/** 银行卡号格式化（每4位空格） */
export const formatBankCard = (cardNo: string): string => {
  return cardNo.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
}

/** 数字转中文大写 */
export const toChineseNumber = (num: number): string => {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const units = ['', '拾', '佰', '仟']
  const bigUnits = ['', '万', '亿']

  if (num === 0) return '零'

  const str = Math.abs(num).toString()
  let result = ''
  const groups: string[] = []

  // Split into groups of 4
  for (let i = str.length; i > 0; i -= 4) {
    groups.unshift(str.slice(Math.max(0, i - 4), i))
  }

  groups.forEach((group, gIdx) => {
    let groupStr = ''
    let hasZero = false

    for (let i = 0; i < group.length; i++) {
      const digit = parseInt(group[i])
      const unitIdx = group.length - 1 - i

      if (digit === 0) {
        hasZero = true
      } else {
        if (hasZero) {
          groupStr += '零'
          hasZero = false
        }
        groupStr += digits[digit] + units[unitIdx]
      }
    }

    if (groupStr) {
      result += groupStr + bigUnits[groups.length - 1 - gIdx]
    }
  })

  return (num < 0 ? '负' : '') + result
}

/** 将秒数转为 HH:MM:SS */
export const formatSeconds = (seconds: number): string => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':')
}

/** 数字简写（1000 → 1K, 1000000 → 1M） */
export const abbreviateNumber = (num: number): string => {
  const abbrevs = [
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e4, suffix: 'W' },
    { value: 1e3, suffix: 'K' },
  ]
  for (const { value, suffix } of abbrevs) {
    if (num >= value) {
      return `${(num / value).toFixed(1).replace(/\.0$/, '')}${suffix}`
    }
  }
  return num.toString()
}
