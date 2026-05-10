import { Layout, Menu, Button, Space } from 'antd'
import {
  HomeOutlined,
  ToolOutlined,
  ProjectOutlined,
  UserOutlined,
  GithubOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const { Header, Content, Footer } = Layout

interface MainLayoutProps {
  isDark: boolean
  toggleTheme: () => void
}

const MainLayout = ({ isDark, toggleTheme }: MainLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: '首页' },
    { key: '/tools', icon: <ToolOutlined />, label: '工具库' },
    { key: '/projects', icon: <ProjectOutlined />, label: '项目' },
    { key: '/about', icon: <UserOutlined />, label: '关于' },
  ]

  return (
    <Layout style={{ minHeight: '100vh', background: isDark ? '#0f0f23' : '#f5f5f5' }}>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isDark ? 'rgba(15, 15, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          padding: '0 24px',
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{ cursor: 'pointer', fontSize: '1.25rem', fontWeight: 700 }}
          onClick={() => navigate('/')}
        >
          <span className="glow-text">Wzjhub</span>
        </motion.div>

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

        <Space>
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleTheme}
            style={{ color: isDark ? '#fff' : '#000' }}
          />
          <Button
            type="text"
            icon={<GithubOutlined />}
            href="https://github.com/wzjhub"
            target="_blank"
            style={{ color: isDark ? '#fff' : '#000' }}
          />
        </Space>
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

      <Footer
        style={{
          textAlign: 'center',
          background: 'transparent',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
          padding: '24px 50px',
        }}
      >
        © {new Date().getFullYear()} Wzjhub · Built with React + Ant Design
      </Footer>
    </Layout>
  )
}

export default MainLayout
