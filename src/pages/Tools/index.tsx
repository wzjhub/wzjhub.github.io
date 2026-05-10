import { useState } from 'react'
import { Typography, Tabs, Input, Button, Space, Card, Row, Col, message, Tag, Alert } from 'antd'
import { CopyOutlined, SwapOutlined, FieldTimeOutlined, FormatPainterOutlined, SafetyOutlined, DatabaseOutlined, ApiOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import GlowCard from '../../components/GlowCard'
import {
  formatDate,
  fromNow,
  toUnix,
  toTimestamp,
  fromUnix,
  now,
  formatDuration,
  formatNumber,
  formatCurrency,
  formatFileSize,
  formatPercent,
  maskPhone,
  maskEmail,
  maskIdCard,
  abbreviateNumber,
  formatSeconds,
  toChineseNumber,
  formatBankCard,
  storage,
  isPhone,
  isEmail,
  isIdCard,
  isStrongPassword,
  isUrl,
  startOf,
  endOf,
  add,
  toTimezone,
} from '../../libs'

const { Title, Text, Paragraph } = Typography

const TimestampTool = () => {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const handleConvert = () => {
    if (!input) {
      setResult(`当前时间戳(秒): ${toUnix()}\n当前时间戳(毫秒): ${toTimestamp()}\n当前时间: ${now()}`)
      return
    }
    const num = Number(input)
    if (!isNaN(num)) {
      // Timestamp to date
      const date = num > 1e12 ? new Date(num) : fromUnix(num)
      setResult(`转换结果: ${formatDate(date.toString())}\n相对时间: ${fromNow(date.toString())}`)
    } else {
      // Date to timestamp
      setResult(`秒级时间戳: ${toUnix(input)}\n毫秒时间戳: ${toTimestamp(input)}`)
    }
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Input
        placeholder="输入时间戳或日期字符串（留空获取当前时间）"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={handleConvert}
        size="large"
      />
      <Button type="primary" icon={<SwapOutlined />} onClick={handleConvert}>
        转换
      </Button>
      {result && (
        <Card size="small" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{result}</pre>
        </Card>
      )}
      <Paragraph type="secondary" style={{ fontSize: '0.85rem' }}>
        支持：Unix 时间戳（秒/毫秒）↔ 日期字符串互转
      </Paragraph>
    </Space>
  )
}

const FormatTool = () => {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<string[]>([])

  const handleFormat = () => {
    const num = Number(input)
    if (isNaN(num)) {
      message.error('请输入有效数字')
      return
    }
    setResults([
      `千分位: ${formatNumber(num, 2)}`,
      `人民币: ${formatCurrency(num)}`,
      `美元: ${formatCurrency(num, 'USD', 'en-US')}`,
      `百分比: ${formatPercent(num)}`,
      `文件大小: ${formatFileSize(num)}`,
      `简写: ${abbreviateNumber(num)}`,
      `时间(秒→时分秒): ${formatSeconds(Math.floor(num))}`,
      `持续时间(ms): ${formatDuration(num)}`,
      `中文大写: ${toChineseNumber(Math.floor(num))}`,
    ])
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Input
        placeholder="输入数字"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={handleFormat}
        size="large"
      />
      <Button type="primary" icon={<FormatPainterOutlined />} onClick={handleFormat}>
        格式化
      </Button>
      {results.length > 0 && (
        <Card size="small" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
          {results.map((r, i) => (
            <div key={i} style={{ padding: '4px 0' }}>
              <Text code>{r}</Text>
            </div>
          ))}
        </Card>
      )}
    </Space>
  )
}

const MaskTool = () => {
  const [phone, setPhone] = useState('13812345678')
  const [email, setEmail] = useState('example@gmail.com')

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <Row gutter={16}>
        <Col span={12}>
          <Input
            addonBefore="手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Tag color="purple" style={{ marginTop: 8 }}>
            {maskPhone(phone)}
          </Tag>
        </Col>
        <Col span={12}>
          <Input
            addonBefore="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Tag color="purple" style={{ marginTop: 8 }}>
            {maskEmail(email)}
          </Tag>
        </Col>
      </Row>
    </Space>
  )
}

// ===== Interactive Demo Components =====

const RequestDemo = () => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1')
  const [result, setResult] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const isImageUrl = (u: string) => /\.(jpg|jpeg|png|gif|webp|svg|ico|bmp)(\?.*)?$/i.test(u)

  const handleFetch = async () => {
    setLoading(true)
    setImageUrl('')
    setResult('')

    if (isImageUrl(url)) {
      setImageUrl(url)
      setResult('')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(url)
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('image')) {
        setImageUrl(url)
      } else {
        const data = await response.json()
        setResult(JSON.stringify(data, null, 2))
      }
    } catch (err: any) {
      setResult(`请求失败: ${err.message}`)
    }
    setLoading(false)
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="small">
      <Input
        placeholder="输入 URL，如: https://jsonplaceholder.typicode.com/todos/1"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onPressEnter={handleFetch}
      />
      <Paragraph type="secondary" style={{ fontSize: '0.75rem', margin: 0 }}>
        示例：https://jsonplaceholder.typicode.com/posts/1 | 图片路径会直接展示图片
      </Paragraph>
      <Button type="primary" icon={<ApiOutlined />} onClick={handleFetch} loading={loading} size="small">
        发送 GET 请求
      </Button>
      {imageUrl && (
        <div style={{ textAlign: 'center', padding: 8 }}>
          <img src={imageUrl} alt="preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
        </div>
      )}
      {result && (
        <Card size="small" style={{ background: 'rgba(99, 102, 241, 0.05)', maxHeight: 150, overflow: 'auto' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{result}</pre>
        </Card>
      )}
    </Space>
  )
}

const DatetimeDemo = () => {
  const [input, setInput] = useState('2024-06-15 14:30:00')
  const [results, setResults] = useState<string[]>([])

  const handleDemo = () => {
    const date = input || new Date().toISOString()
    setResults([
      `格式化: ${formatDate(date)}`,
      `相对时间: ${fromNow(date)}`,
      `当天开始: ${startOf(date)}`,
      `当天结束: ${endOf(date)}`,
      `+7天: ${add(date, 7, 'day')}`,
      `纽约时间: ${toTimezone(date, 'America/New_York')}`,
      `东京时间: ${toTimezone(date, 'Asia/Tokyo')}`,
    ])
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="small">
      <Input
        placeholder="如: 2024-06-15 14:30:00 或 1718441400"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPressEnter={handleDemo}
      />
      <Paragraph type="secondary" style={{ fontSize: '0.75rem', margin: 0 }}>
        支持格式：2024-01-01 | 2024-01-01 12:00:00 | 时间戳 | 留空用当前时间
      </Paragraph>
      <Button type="primary" icon={<FieldTimeOutlined />} onClick={handleDemo} size="small">
        转换
      </Button>
      {results.length > 0 && (
        <Card size="small" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
          {results.map((r, i) => (
            <div key={i} style={{ padding: '2px 0', fontSize: '0.8rem' }}>
              <Text code>{r}</Text>
            </div>
          ))}
        </Card>
      )}
    </Space>
  )
}

const StorageDemo = () => {
  const [key, setKey] = useState('test_key')
  const [value, setValue] = useState('hello world')
  const [readResult, setReadResult] = useState('')

  const handleSet = () => {
    storage.set(key, value, 60)
    message.success(`已存储 "${key}" (60秒后过期)`)
  }

  const handleGet = () => {
    const result = storage.get(key)
    setReadResult(result !== null ? `值: ${JSON.stringify(result)}` : '未找到或已过期')
  }

  const handleRemove = () => {
    storage.remove(key)
    message.success(`已删除 "${key}"`)
    setReadResult('')
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="small">
      <Paragraph type="secondary" style={{ fontSize: '0.75rem', margin: 0 }}>
        示例：输入 key 和 value，点"存"写入 localStorage（60秒过期），点"读"取出，点"删"移除
      </Paragraph>
      <Row gutter={8}>
        <Col span={8}>
          <Input placeholder="如: token" value={key} onChange={(e) => setKey(e.target.value)} />
        </Col>
        <Col span={8}>
          <Input placeholder="如: abc123" value={value} onChange={(e) => setValue(e.target.value)} />
        </Col>
        <Col span={8}>
          <Space>
            <Button size="small" type="primary" onClick={handleSet}>存</Button>
            <Button size="small" onClick={handleGet}>读</Button>
            <Button size="small" danger onClick={handleRemove}>删</Button>
          </Space>
        </Col>
      </Row>
      {readResult && <Tag color="purple">{readResult}</Tag>}
    </Space>
  )
}

const FormatDemo = () => {
  const [input, setInput] = useState('1234567.89')

  const num = Number(input)
  const isValid = !isNaN(num) && input !== ''

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="small">
      <Input
        placeholder="如: 1234567.89 | 1024 | 9999999"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Paragraph type="secondary" style={{ fontSize: '0.75rem', margin: 0 }}>
        输入任意数字，实时查看各种格式化结果
      </Paragraph>
      {isValid && (
        <Card size="small" style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
          <Space direction="vertical" size={2} style={{ fontSize: '0.8rem' }}>
            <Text code>千分位: {formatNumber(num, 2)}</Text>
            <Text code>人民币: {formatCurrency(num)}</Text>
            <Text code>文件大小: {formatFileSize(num)}</Text>
            <Text code>百分比: {formatPercent(num)}</Text>
            <Text code>简写: {abbreviateNumber(num)}</Text>
            <Text code>秒→时分秒: {formatSeconds(Math.floor(Math.abs(num)))}</Text>
            <Text code>中文大写: {toChineseNumber(Math.floor(num))}</Text>
          </Space>
        </Card>
      )}
    </Space>
  )
}

const ValidatorsDemo = () => {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div>
      <Paragraph type="secondary" style={{ fontSize: '0.8rem', marginBottom: 12 }}>
        模拟注册表单 — 输入时实时验证格式是否正确
      </Paragraph>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input
            placeholder="手机号"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            status={phone ? (isPhone(phone).valid ? '' : 'error') : ''}
          />
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 4 }}>
            {!phone ? '请输入11位手机号，如 13812345678' : isPhone(phone).valid ? '✓ 格式正确' : isPhone(phone).message}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Input
            placeholder="邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            status={email ? (isEmail(email).valid ? '' : 'error') : ''}
          />
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 4 }}>
            {!email ? '请输入邮箱，如 test@gmail.com' : isEmail(email).valid ? '✓ 格式正确' : isEmail(email).message}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Input.Password
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            status={password ? (isStrongPassword(password).valid ? '' : 'warning') : ''}
          />
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 4 }}>
            {!password ? '至少8位，包含大小写字母和数字' : isStrongPassword(password).valid ? '✓ 密码强度合格' : isStrongPassword(password).message}
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Button
            type="primary"
            block
            disabled={!phone || !email || !password || !isPhone(phone).valid || !isEmail(email).valid || !isStrongPassword(password).valid}
            style={{ height: 32 }}
          >
            注册
          </Button>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: 4 }}>
            所有字段验证通过后按钮可点击
          </div>
        </Col>
      </Row>
    </div>
  )
}

const ToolsPage = () => {
  const tools = [
    {
      key: 'timestamp',
      label: '时间戳转换',
      icon: <FieldTimeOutlined />,
      children: <TimestampTool />,
    },
    {
      key: 'format',
      label: '数据格式化',
      icon: <FormatPainterOutlined />,
      children: <FormatTool />,
    },
    {
      key: 'mask',
      label: '数据脱敏',
      icon: <CopyOutlined />,
      children: <MaskTool />,
    },
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} style={{ marginBottom: 8 }}>
          <span className="glow-text">🛠️ 工具库</span>
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 32 }}>
          通用工具集合，可独立复用到任何 React / Node.js 项目。在线体验效果：
        </Paragraph>

        <GlowCard>
          <Tabs
            items={tools}
            size="large"
          />
        </GlowCard>

        {/* API Reference - Interactive */}
        <Title level={3} style={{ marginTop: 48, marginBottom: 24 }}>
          <span className="glow-text">📦 工具库在线演示</span>
        </Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <GlowCard title="request - HTTP 请求">
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                拦截器、重试、取消、上传下载
              </Paragraph>
              <RequestDemo />
            </GlowCard>
          </Col>
          <Col xs={24} md={12}>
            <GlowCard title="datetime - 时间处理">
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                格式化、相对时间、时区转换
              </Paragraph>
              <DatetimeDemo />
            </GlowCard>
          </Col>
          <Col xs={24} md={12}>
            <GlowCard title="storage - 存储封装">
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                过期时间、命名空间、类型安全
              </Paragraph>
              <StorageDemo />
            </GlowCard>
          </Col>
          <Col xs={24} md={12}>
            <GlowCard title="format - 数据格式化">
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                数字、货币、文件大小、脱敏
              </Paragraph>
              <FormatDemo />
            </GlowCard>
          </Col>
          <Col xs={24}>
            <GlowCard title="validators - 表单验证">
              <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                手机、邮箱、身份证、密码强度
              </Paragraph>
              <ValidatorsDemo />
            </GlowCard>
          </Col>
        </Row>
      </motion.div>
    </div>
  )
}

export default ToolsPage
