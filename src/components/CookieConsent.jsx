import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('hasAcceptedCookies')) {
      const t = setTimeout(() => setShow(true), 1500)

      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('hasAcceptedCookies', 'true')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('hasAcceptedCookies', 'declined')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-5 left-5 right-5 sm:left-auto sm:right-6 z-[65] w-auto sm:w-[480px]"
        >
          <div className="bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">

            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="text-red-500"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10c0-.7-.1-1.4-.2-2.1a5 5 0 0 1-5.7-5.7A10 10 0 0 0 12 2Z" />
                    <circle cx="8.5" cy="12" r="1" />
                    <circle cx="12" cy="16" r="1" />
                    <circle cx="16" cy="11" r="1" />
                  </svg>
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm">
                    We value your privacy
                  </h3>

                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Cookies & browser storage
                  </p>
                </div>

              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-5">

              <p className="text-gray-400 text-xs leading-relaxed">
                FilmScorePH uses necessary cookies and browser storage to
                keep you signed in, remember your preferences, and provide
                essential website functionality.
              </p>

              <p className="text-gray-500 text-[11px] leading-relaxed mt-3">
                For more information about how we collect and use your
                information, see our{' '}
                <Link
                  to="/privacy"
                  className="text-red-400 hover:text-red-300 hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
                .
              </p>

            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/40 flex items-center gap-2">

              <button
                onClick={decline}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900 text-xs font-medium transition-colors"
              >
                Decline
              </button>

              <button
                onClick={accept}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all hover:scale-[1.02] shadow-lg shadow-red-950/30"
              >
                Accept Cookies
              </button>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent