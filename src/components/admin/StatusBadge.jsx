const styles = {
  OPEN: 'bg-red-600/15 text-red-500',
  RESOLVED: 'bg-gray-800 text-gray-500',
  ADMIN: 'bg-red-600/15 text-red-500',
  USER: 'bg-gray-800 text-gray-400',
}

function StatusBadge({ label }) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${styles[label] || 'bg-gray-800 text-gray-400'}`}>
      {label}
    </span>
  )
}

export default StatusBadge