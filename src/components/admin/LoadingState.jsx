import { RefreshCw } from 'lucide-react'

function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl p-12 text-center">
      <RefreshCw size={24} className="text-red-500 animate-spin mx-auto mb-3" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}

export default LoadingState
