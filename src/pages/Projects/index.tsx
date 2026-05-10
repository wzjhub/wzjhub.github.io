import { Typography, Row, Col, Tag, Space, Button } from 'antd'
import { GithubOutlined, LinkOutlined, StarOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import GlowCard from '../../components/GlowCard'

const { Title, Paragraph } = Typography

const projects = [
  {
    title: 'Wzjhub Portal',
    description: '个人门户网站，React + Ant Design 5 + Three.js 打造的酷炫首页，内置通用工具库',
    tags: ['React', 'TypeScript', 'Ant Design', 'Three.js'],
    github: 'https://github.com/wzjhub/wzjhub.github.io',
    demo: 'https://wzjhub.github.io',
    color: '#6366f1',
  },
  {
    title: '通用工具库',
    description: 'HTTP 请求封装、时间处理、数据格式化、表单验证等，可复用到任何前端项目',
    tags: ['TypeScript', 'Axios', 'Dayjs', 'Utils'],
    github: 'https://github.com/wzjhub',
    color: '#8b5cf6',
  },
  {
    title: '更多项目',
    description: '持续更新中... 欢迎关注 GitHub',
    tags: ['Coming Soon'],
    github: 'https://github.com/wzjhub',
    color: '#ec4899',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const ProjectsPage = () => {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} style={{ marginBottom: 8 }}>
          <span className="glow-text">🚀 项目展示</span>
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 48 }}>
          个人开源项目集合
        </Paragraph>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Row gutter={[24, 24]}>
          {projects.map((project) => (
            <Col xs={24} md={12} lg={8} key={project.title}>
              <motion.div variants={itemVariants}>
                <GlowCard
                  style={{ height: '100%' }}
                >
                  <div style={{ padding: '8px 0' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: `${project.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        border: `1px solid ${project.color}40`,
                      }}
                    >
                      <StarOutlined style={{ fontSize: 20, color: project.color }} />
                    </div>

                    <Title level={4} style={{ marginBottom: 8 }}>
                      {project.title}
                    </Title>

                    <Paragraph
                      type="secondary"
                      style={{ minHeight: 44, marginBottom: 16 }}
                    >
                      {project.description}
                    </Paragraph>

                    <Space wrap size={[4, 8]} style={{ marginBottom: 16 }}>
                      {project.tags.map((tag) => (
                        <Tag
                          key={tag}
                          style={{
                            borderRadius: 12,
                            border: `1px solid ${project.color}30`,
                            background: `${project.color}10`,
                            color: project.color,
                          }}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </Space>

                    <Space>
                      <Button
                        type="link"
                        icon={<GithubOutlined />}
                        href={project.github}
                        target="_blank"
                        size="small"
                      >
                        Source
                      </Button>
                      {project.demo && (
                        <Button
                          type="link"
                          icon={<LinkOutlined />}
                          href={project.demo}
                          target="_blank"
                          size="small"
                        >
                          Demo
                        </Button>
                      )}
                    </Space>
                  </div>
                </GlowCard>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </div>
  )
}

export default ProjectsPage
