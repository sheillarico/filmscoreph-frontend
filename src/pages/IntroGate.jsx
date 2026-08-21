import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import CinemaIntro from '../components/CinemaIntro'

function IntroGate() {
  const navigate = useNavigate()
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem('hasSeenIntro', 'true')
      setShow(false)
      navigate('/home', { replace: true })
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-[60]">
      <AnimatePresence>
        {show && <CinemaIntro />}
      </AnimatePresence>
    </div>
  )
}

export default IntroGate