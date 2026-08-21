import EmptyState from '../EmptyState'

function ReviewsChart({ data = [] }) {
  if (!data.length) return <EmptyChart message="No review rating data available yet." />

  const maxCount = Math.max(...data.map(item => item.count), 1)

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">{item.rating}</span>
            <span className="text-gray-500">{item.count}</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${(item.count / maxCount) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReviewsChart