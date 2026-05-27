import { Layout, Menu, Button } from 'antd'
import {
  HomeOutlined,
  GithubOutlined,
  CompassOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ClockWeather from '../components/ClockWeather'
import { useState, useEffect } from 'react'

const { Header, Content } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const handler = () => setSidebarOpen((prev) => !prev)
    window.addEventListener('toggle-sidebar', handler)
    return () => window.removeEventListener('toggle-sidebar', handler)
  }, [])

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/nav', icon: <CompassOutlined />, label: '导航' },
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: '#0f0f23' }}>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 15, 35, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            id="sidebar-toggle"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
            style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}
          >
            {sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </span>
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{ cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}
            onClick={() => navigate('/')}
          >
            <span className="glow-text">Wzjhub</span>
          </motion.div>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            flex: 1,
            justifyContent: 'center',
            background: 'transparent',
            borderBottom: 'none',
          }}
        />

        <div className="nav-clock" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ClockWeather />
          <Button
            type="text"
            icon={<GithubOutlined />}
            href="https://github.com/wzjhub"
            target="_blank"
            style={{ color: '#fff' }}
          />
        </div>
      </Header>

      <Content style={{ marginTop: 64 }}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </Content>
    </Layout>
  )
}

export default MainLayout
