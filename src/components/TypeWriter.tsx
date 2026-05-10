import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TypeWriterProps {
  texts: string[]
  duration?: number
  className?: string
}

const TypeWriter = ({
  texts,
  duration = 4000,
  className,
}: TypeWriterProps) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length)
    }, duration)
    return () => clearInterval(timer)
  }, [texts.length, duration])

  return (
    <div className={className} style={{ position: 'relative', minHeight: '2em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ display: 'inline-block' }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default TypeWriter
