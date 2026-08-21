import { motion } from 'framer-motion'
import { useMemo } from 'react'

function CinematicBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 9 + Math.random() * 10,
      size: 1.5 + Math.random() * 4,
  })), [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base black */}
      <div className="absolute inset-0 bg-black" />

      {/* Soft red glow, top */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-red-900/10 blur-[160px]"
      />

      {/* Secondary glow, lower */}
      <div
        className="absolute top-[60vh] right-0 w-[600px] h-[600px] rounded-full bg-red-950/10 blur-[140px]"
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 0%, transparent 20%, rgba(0,0,0,0.6) 80%)' }}
      />

      {/* Film grain flicker */}
      <motion.div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px)' }}
        animate={{ opacity: [0.015, 0.035, 0.015] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating dust particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-red-400/50"
          style={{ left: `${p.left}%`, width: p.size, height: p.size, boxShadow: '0 0 6px rgba(248,113,113,0.5)' }}
          animate={{ y: ['0vh', '-100vh'], opacity: [0, 0.8, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  )
}

export default CinematicBackground