// ============================================================
// 表单验证工具库 - 可独立复用到任何项目
// 常用验证规则，兼容 Ant Design Form rules
// ============================================================

/** 验证结果 */
interface ValidationResult {
  valid: boolean
  message?: string
}

type Validator = (value: string) => ValidationResult

/** 手机号验证 */
export const isPhone = (value: string): ValidationResult => {
  const valid = /^1[3-9]\d{9}$/.test(value)
  return { valid, message: valid ? undefined : '请输入正确的手机号' }
}

/** 邮箱验证 */
export const isEmail = (value: string): ValidationResult => {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  return { valid, message: valid ? undefined : '请输入正确的邮箱地址' }
}

/** 身份证验证 */
export const isIdCard = (value: string): ValidationResult => {
  const valid = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
  return { valid, message: valid ? undefined : '请输入正确的身份证号' }
}

/** URL 验证 */
export const isUrl = (value: string): ValidationResult => {
  try {
    new URL(value)
    return { valid: true }
  } catch {
    return { valid: false, message: '请输入正确的 URL' }
  }
}

/** IP 地址验证 */
export const isIP = (value: string): ValidationResult => {
  const valid = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/.test(value)
  return { valid, message: valid ? undefined : '请输入正确的 IP 地址' }
}

/** 密码强度验证（至少8位，包含大小写字母和数字） */
export const isStrongPassword = (value: string): ValidationResult => {
  const checks = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
  }
  const valid = Object.values(checks).every(Boolean)
  const messages: string[] = []
  if (!checks.length) messages.push('至少8位')
  if (!checks.upper) messages.push('包含大写字母')
  if (!checks.lower) messages.push('包含小写字母')
  if (!checks.number) messages.push('包含数字')
  return { valid, message: valid ? undefined : `密码需要：${messages.join('、')}` }
}

/** 中文姓名验证 */
export const isChineseName = (value: string): ValidationResult => {
  const valid = /^[\u4e00-\u9fa5]{2,10}$/.test(value)
  return { valid, message: valid ? undefined : '请输入2-10位中文姓名' }
}

/** 银行卡号验证（Luhn 算法） */
export const isBankCard = (value: string): ValidationResult => {
  const num = value.replace(/\s/g, '')
  if (!/^\d{16,19}$/.test(num)) {
    return { valid: false, message: '银行卡号格式不正确' }
  }
  // Luhn check
  let sum = 0
  let alternate = false
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10)
    if (alternate) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alternate = !alternate
  }
  const valid = sum % 10 === 0
  return { valid, message: valid ? undefined : '银行卡号不正确' }
}

/** 生成 Ant Design Form 兼容的 rule */
export const createRule = (validator: Validator, required = true) => {
  return [
    ...(required ? [{ required: true, message: '此项为必填' }] : []),
    {
      validator: (_: unknown, value: string) => {
        if (!value && !required) return Promise.resolve()
        const result = validator(value)
        return result.valid ? Promise.resolve() : Promise.reject(result.message)
      },
    },
  ]
}

/** 常用 Antd Form Rules */
export const rules = {
  required: [{ required: true, message: '此项为必填' }],
  phone: createRule(isPhone),
  email: createRule(isEmail),
  idCard: createRule(isIdCard),
  url: createRule(isUrl, false),
  password: createRule(isStrongPassword),
  chineseName: createRule(isChineseName),
}

export type { ValidationResult, Validator }
