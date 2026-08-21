import EmptyState from '../EmptyState'

function ViewsChart({ data = [] }) {
  if (!data.length) return <EmptyState message="No page view data available yet." />

  const width = 700
  const height = 260
  const padding = 35
  const maxViews = Math.max(...data.map(item => item.views), 1)

  const points = data.map((item, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (width - padding * 2)
    const y = height - padding - (item.views / maxViews) * (height - padding * 2)
    return { x, y, ...item }
  })

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]">
        {[0, 1, 2, 3, 4].map(index => {
          const y = padding + (index / 4) * (height - padding * 2)
          return <line key={index} x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" className="text-gray-800" strokeWidth="1" />
        })}
        <polyline points={polyline} fill="none" stroke="currentColor" className="text-red-500" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="4" className="fill-red-500" />
            <text x={point.x} y={height - 8} textAnchor="middle" className="fill-gray-500 text-[10px]">{point.date}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default ViewsChart