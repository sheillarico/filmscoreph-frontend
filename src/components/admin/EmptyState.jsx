function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl p-12 text-center">
      {Icon && <Icon size={30} className="text-gray-700 mx-auto mb-3" />}
      <p className="text-gray-300 text-sm font-medium">{title}</p>
      {message && <p className="text-gray-600 text-xs mt-1">{message}</p>}
    </div>
  )
}

export default EmptyState
