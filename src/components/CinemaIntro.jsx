import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'

function CinemaIntro() {
  const [phase, setPhase] = useState('loading')

  const particles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 4,
      size: 1 + Math.random() * 2,
    })), [])

  useEffect(() => {
    const t = setTimeout(() => setPhase('reveal'), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      className="relative h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ scale: 1.08, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      {/* Flickering red spotlight */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-red-900/25 blur-[140px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Sweeping light rays */}
      <motion.div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background: 'conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(220,38,38,0.5) 10deg, transparent 40deg)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating dust particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute bottom-0 rounded-full bg-red-400/40"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          animate={{ y: ['0vh', '-100vh'], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.92) 100%)' }}
      />

      {/* Film grain flicker */}
      <motion.div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 2px)' }}
        animate={{ opacity: [0.02, 0.06, 0.02] }}
        transition={{ duration: 0.15, repeat: Infinity }}
      />

      {/* Scanline sweep */}
      <motion.div
        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-red-500/5 to-transparent pointer-events-none"
        animate={{ top: ['-20%', '120%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
      />

      {phase === 'loading' && (
        <motion.div
          className="relative z-10 flex flex-col items-center gap-5"
          exit={{ opacity: 0 }}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 border-2 border-red-900/30 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-2 border-transparent border-t-red-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="w-2 h-2 bg-red-600 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <motion.p
            className="text-gray-400 text-xs tracking-[0.4em] uppercase"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            Loading Feature Presentation
          </motion.p>
          <div className="w-48 h-[2px] bg-gray-900 overflow-hidden rounded">
            <motion.div
              className="h-full bg-gradient-to-r from-red-800 via-red-500 to-red-800"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}

      {phase === 'reveal' && (
        <div className="relative z-10 text-center px-6">
          <motion.p
            className="text-gray-400 text-sm md:text-base tracking-[0.35em] uppercase mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Now Presenting
          </motion.p>

          <motion.h1
            className="relative text-5xl md:text-7xl font-bold tracking-wide"
            initial={{ opacity: 0, letterSpacing: '0.6em', scale: 1.1 }}
            animate={{ opacity: 1, letterSpacing: '0.05em', scale: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          >
            <span className="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              FilmScore
            </span>
            <motion.span
              className="text-red-600"
              animate={{ textShadow: ['0 0 10px rgba(220,38,38,0.3)', '0 0 25px rgba(220,38,38,0.7)', '0 0 10px rgba(220,38,38,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              PH
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-gray-500 text-sm md:text-base mt-5 tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Discover. Rate. Discuss Filipino Cinema.
          </motion.p>

          <motion.div
            className="mt-6 mx-auto w-px h-12 bg-gradient-to-b from-red-600 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1, delay: 1.3, ease: 'easeOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </div>
      )}
    </motion.div>
  )
}

export default CinemaIntro