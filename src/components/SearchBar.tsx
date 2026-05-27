import { useState } from 'react'
import { Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const engines = [
  { label: 'Google', value: 'google', url: 'https://www.google.com/search?q=', color: '#4285f4' },
  { label: 'Bing', value: 'bing', url: 'https://www.bing.com/search?q=', color: '#00809d' },
  { label: 'Baidu', value: 'baidu', url: 'https://www.baidu.com/s?wd=', color: '#3388ff' },
  { label: 'GitHub', value: 'github', url: 'https://github.com/search?q=', color: '#8b5cf6' },
  { label: 'Stack Overflow', value: 'stackoverflow', url: 'https://stackoverflow.com/search?q=', color: '#f48024' },
  { label: 'npm', value: 'npm', url: 'https://www.npmjs.com/search?q=', color: '#cb3837' },
]

const SearchBar = () => {
  const [engine, setEngine] = useState('google')
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (!query.trim()) return
    const engineConfig = engines.find((e) => e.value === engine)
    if (engineConfig) {
      window.open(engineConfig.url + encodeURIComponent(query.trim()), '_blank')
    }
  }

  const currentEngine = engines.find((e) => e.value === engine)

  return (
    <div>
      {/* Engine tabs - centered */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 10, overflowX: 'auto' }}>
        {engines.map((e) => (
          <div
            key={e.value}
            onClick={() => setEngine(e.value)}
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              color: engine === e.value ? e.color : 'rgba(255,255,255,0.5)',
              fontWeight: engine === e.value ? 600 : 400,
              borderBottom: engine === e.value ? `2px solid ${e.color}` : '2px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {e.label}
          </div>
        ))}
      </div>

      {/* Search input + button */}
      <div style={{ display: 'flex', gap: 0 }}>
        <Input
          placeholder={`输入搜索内容...`}
          prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          size="large"
          style={{
            borderRadius: '8px 0 0 8px',
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(99, 102, 241, 0.25)',
            borderRight: 'none',
          }}
        />
        <Button
          type="primary"
          size="large"
          onClick={handleSearch}
          style={{
            borderRadius: '0 8px 8px 0',
            background: currentEngine?.color || '#6366f1',
            borderColor: currentEngine?.color || '#6366f1',
            fontWeight: 600,
            padding: '0 24px',
          }}
        >
          搜索
        </Button>
      </div>
    </div>
  )
}

export default SearchBar
