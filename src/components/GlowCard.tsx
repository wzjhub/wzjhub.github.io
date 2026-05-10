import { Card } from 'antd'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  title?: string
  hoverable?: boolean
  style?: React.CSSProperties
  onClick?: () => void
}

const GlowCard = ({ children, title, hoverable = true, style, onClick }: GlowCardProps) => {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={onClick}
    >
      <Card
        title={title}
        bordered={false}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          borderRadius: 16,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          ...style,
        }}
        styles={{
          header: {
            borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
          },
        }}
        hoverable={false}
        className="glow-card"
      >
        {children}
        <style>{`
          .glow-card:hover {
            border-color: rgba(99, 102, 241, 0.4) !important;
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.1), inset 0 0 30px rgba(99, 102, 241, 0.02) !important;
          }
        `}</style>
      </Card>
    </motion.div>
  )
}

export default GlowCard
