import { AlertTriangle } from 'lucide-react'
import EmptyState from '../EmptyState'

function ReportsSummary({ reports }) {
  if (!reports) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="No report statistics"
        message="No report statistics available."
      />
    )
  }

  const items = [
    { label: 'Open', value: reports.open || 0, className: 'text-red-500' },
    { label: 'In Review', value: reports.inReview || 0, className: 'text-yellow-400' },
    { label: 'Resolved', value: reports.resolved || 0, className: 'text-green-400' },
  ]

  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.label} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className="text-gray-400 text-sm">{item.label}</span>
          </div>
          <span className={`font-bold ${item.className}`}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export default ReportsSummary