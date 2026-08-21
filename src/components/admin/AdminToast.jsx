import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'

const config = {
  success: {
    icon: CheckCircle2,
    border: 'border-emerald-500/20',
    background: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
  },

  error: {
    icon: AlertCircle,
    border: 'border-red-500/20',
    background: 'bg-red-500/10',
    iconColor: 'text-red-400',
  },

  warning: {
    icon: AlertTriangle,
    border: 'border-yellow-500/20',
    background: 'bg-yellow-500/10',
    iconColor: 'text-yellow-400',
  },

  info: {
    icon: Info,
    border: 'border-blue-500/20',
    background: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
}

function AdminToast({
  open = true,
  type = 'success',
  message,
  onClose,
}) {
  const settings =
    config[type] || config.info

  const Icon = settings.icon

  const visible = open && Boolean(message)

  return (
    <div
      className={`
        fixed
        top-5
        right-5
        z-[100]
        w-[min(380px,calc(100vw-2rem))]
        pointer-events-none
        ${
          visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 transition-all duration-[900ms] ease-out'
        }
      `}
      aria-live="polite"
      aria-atomic="true"
    >
      {message && (
        <div
          className={`
            pointer-events-auto
            flex
            items-start
            gap-3
            rounded-xl
            border
            ${settings.border}
            ${settings.background}
            bg-gray-950/95
            backdrop-blur-md
            px-4
            py-3.5
            shadow-2xl
          `}
        >
          <Icon
            size={18}
            className={`${settings.iconColor} flex-shrink-0 mt-0.5`}
          />

          <p className="flex-1 text-sm text-gray-300 leading-5">
            {message}
          </p>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 text-gray-600 hover:text-gray-300 transition-colors"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminToast