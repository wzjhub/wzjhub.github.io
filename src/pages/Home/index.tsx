import { Typography, Row, Col, Tag, Space } from 'antd'
import { GithubOutlined, LinkOutlined, RocketOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ParticleBackground from '../../components/ParticleBackground'
import TypeWriter from '../../components/TypeWriter'
import GlowCard from '../../components/GlowCard'

const { Title, Paragraph } = Typography

const skills = [
  { name: 'React', color: '#61dafb' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Java', color: '#ed8b00' },
  { name: 'Spring Boot', color: '#6db33f' },
  { name: 'Python', color: '#3776ab' },
  { name: 'Docker', color: '#2496ed' },
  { name: 'MySQL', color: '#4479a1' },
  { name: 'Redis', color: '#dc382d' },
  { name: 'Git', color: '#f05032' },
  { name: 'Vue', color: '#4fc08d' },
  { name: 'Kubernetes', color: '#326ce5' },
]

const quickLinks = [
  { title: 'GitHub', url: 'https://github.com/wzjhub', icon: <GithubOutlined /> },
  { title: 'Gitee', url: 'https://gitee.com/wang-zhj', icon: <LinkOutlined /> },
  { title: '语雀', url: 'https://www.yuque.com/dashboard', icon: <LinkOutlined /> },
  { title: 'Apifox', url: 'https://app.apifox.com/main', icon: <RocketOutlined /> },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 64px)' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%)',
        }}
      >
        <ParticleBackground />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                margin: '0 auto 32px',
                background: 'var(--gradient-primary)',
                padding: 3,
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#0f0f23',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                }}
              >
                👨‍💻
              </div>
            </div>
          </motion.div>

          <Title
            level={1}
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              marginBottom: 16,
              color: '#fff',
            }}
          >
            Hi, I'm <span className="glow-text">Wzjhub</span>
          </Title>

          <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.7)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
            <TypeWriter
              texts={[
                '生活不会像你想象的那么好',
                '也不会像你想象的那么糟',
                '有时你可能脆弱到一句话就泪流满面',
                '有时也发现自己可以咬着牙走很长很长的路',
                '有人30几岁离开',
                '有人50岁便落幕',
                '我们不是等到老了才会离开',
                '而是随时随地都有可能会离开这个世界',
                '人生的意义在于活着的时候好好体验',
                '百年之后时间会抹去我们在这个世上所有的痕迹',
                '不要为了一点鸡毛蒜皮的小事就烦恼',
                '也不要拿别人的错误来惩罚自己',
                '让不开心充斥了我们短暂的一生',
                '我们拼命追求的体面',
                '计较的得失',
                '耿耿于怀的伤害',
                '在死亡面前都轻若尘埃',
                '爱情不是人生的全部',
                '但爱自己是终身的课题',
                '婚姻不是幸福的终点',
                '而是成长的起点',
                '生活虽有遗憾',
                '但依然值得热爱',
                '生活给我以痛苦',
                '我却报之以歌声',
              ]}
              duration={3000}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Space size="middle" wrap>
              {quickLinks.map((link) => (
                <motion.a
                  key={link.title}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 20px',
                    borderRadius: 24,
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#a5b4fc',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s',
                  }}
                >
                  {link.icon} {link.title}
                </motion.a>
              ))}
            </Space>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '1.5rem',
            zIndex: 1,
          }}
        >
          ↓
        </motion.div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <motion.div variants={itemVariants}>
                <GlowCard onClick={() => navigate('/tools')}>
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🛠️</div>
                    <Title level={4}>工具库</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.6)' }}>
                      HTTP 请求封装、时间处理、数据格式化等通用工具，可复用到任何项目
                    </Paragraph>
                  </div>
                </GlowCard>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div variants={itemVariants}>
                <GlowCard onClick={() => navigate('/projects')}>
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🚀</div>
                    <Title level={4}>项目展示</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.6)' }}>
                      个人开源项目集合，包含前端、后端、全栈应用
                    </Paragraph>
                  </div>
                </GlowCard>
              </motion.div>
            </Col>
            <Col xs={24} md={8}>
              <motion.div variants={itemVariants}>
                <GlowCard onClick={() => navigate('/about')}>
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>📚</div>
                    <Title level={4}>持续学习</Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.6)' }}>
                      做难事必有所得，保持学习，保持进步
                    </Paragraph>
                  </div>
                </GlowCard>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </section>
    </div>
  )
}

export default HomePage
