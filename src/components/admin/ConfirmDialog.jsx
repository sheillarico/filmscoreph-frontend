import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-950 border border-gray-800 rounded-2xl p-6 max-w-sm w-full"
          >
            <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center mb-3">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
            <p className="text-gray-400 text-sm mb-5">{message}</p>
            <div className="flex gap-2">
              <button onClick={onCancel} className="flex-1 py-2 text-sm rounded-full border border-gray-800 text-gray-300 hover:bg-gray-900 transition-colors">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 py-2 text-sm rounded-full bg-red-600 hover:bg-red-500 text-white font-medium transition-colors">
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog