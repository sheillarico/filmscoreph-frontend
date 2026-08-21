import { Activity } from 'lucide-react'

function RecentActivity({ activities = [] }) {
  if (!activities.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Activity size={24} className="text-gray-700 mb-2" />
        <p className="text-gray-500 text-sm">No recent activity.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.slice(0, 6).map((activity, index) => (
        <div key={activity.id || index} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <Activity size={14} className="text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-gray-300 text-sm">{activity.description}</p>
            {activity.timestamp && <p className="text-gray-600 text-xs mt-1">{activity.timestamp}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RecentActivity