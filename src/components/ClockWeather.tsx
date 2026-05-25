import { useState, useEffect } from 'react'

const ClockWeather = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const dateStr = `${time.getMonth() + 1}月${time.getDate()}日 周${weekdays[time.getDay()]}`

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.85)' }}>
        {hours}:{minutes}:{seconds}
      </span>
      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
        {dateStr}
      </span>
    </div>
  )
}

export default ClockWeather
