import { Typography, Row, Col, Timeline, Space, Divider } from 'antd'
import {
  GithubOutlined,
  MailOutlined,
  ReadOutlined,
  CodeOutlined,
  RocketOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import GlowCard from '../../components/GlowCard'

const { Title, Paragraph, Link } = Typography

const AboutPage = () => {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                margin: '0 auto 24px',
                background: 'var(--gradient-primary)',
                padding: 3,
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#1a1a2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                }}
              >
                👨‍💻
              </div>
            </div>
          </motion.div>

          <Title level={2}>
            <span className="glow-text">Wzjhub</span>
          </Title>
          <Paragraph type="secondary" style={{ fontSize: '1.1rem' }}>
            学习者 · 做难事必有所得
          </Paragraph>

          <Space size="large" style={{ marginTop: 16 }}>
            <Link href="https://github.com/wzjhub" target="_blank">
              <GithubOutlined style={{ fontSize: 24 }} />
            </Link>
            <Link href="https://gitee.com/wang-zhj" target="_blank">
              <CodeOutlined style={{ fontSize: 24 }} />
            </Link>
            <Link href="https://www.yuque.com/dashboard" target="_blank">
              <ReadOutlined style={{ fontSize: 24 }} />
            </Link>
          </Space>
        </div>

        <Divider />

        {/* About Me */}
        <Row gutter={[32, 32]}>
          <Col xs={24} md={14}>
            <GlowCard title="关于我">
              <Paragraph>
                一名热爱技术的学习者，保持好奇心，持续探索。
              </Paragraph>
              <Paragraph>
                相信"做难事必有所得"，追求成长而非完美。
              </Paragraph>
              <Paragraph type="secondary">
                📍 China
              </Paragraph>
            </GlowCard>
          </Col>

          <Col xs={24} md={10}>
            <GlowCard title="常用平台">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Link href="https://github.com/wzjhub" target="_blank">
                  <GithubOutlined /> GitHub
                </Link>
                <Link href="https://gitee.com/wang-zhj" target="_blank">
                  <CodeOutlined /> Gitee
                </Link>
                <Link href="https://www.yuque.com/dashboard" target="_blank">
                  <ReadOutlined /> 语雀
                </Link>
                <Link href="https://weread.qq.com/" target="_blank">
                  <ReadOutlined /> 微信读书
                </Link>
                <Link href="https://www.dedao.cn/" target="_blank">
                  <RocketOutlined /> 得到
                </Link>
              </Space>
            </GlowCard>
          </Col>
        </Row>

        {/* Timeline */}
        <div style={{ marginTop: 48 }}>
          <Title level={3}>
            <span className="glow-text">🎯 成长轨迹</span>
          </Title>
          <GlowCard>
            <Timeline
              items={[
                {
                  dot: <TrophyOutlined style={{ color: '#6366f1' }} />,
                  children: '持续学习，持续进步...',
                },
                {
                  dot: <RocketOutlined style={{ color: '#8b5cf6' }} />,
                  children: '构建个人工具库，提升效率',
                },
                {
                  dot: <CodeOutlined style={{ color: '#ec4899' }} />,
                  children: '探索不同领域，拓宽视野',
                },
                {
                  dot: <ReadOutlined style={{ color: '#6366f1' }} />,
                  children: '开始学习之旅',
                },
              ]}
            />
          </GlowCard>
        </div>
      </motion.div>
    </div>
  )
}

export default AboutPage
