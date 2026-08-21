import {
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = 'text-gray-500',
  iconBackgroundClassName = 'bg-gray-900',
  valueClassName = 'text-white',
  trend,
  trendLabel,
}) {
  const hasTrend =
    trend !== undefined &&
    trend !== null

  const isPositive =
    typeof trend === 'number'
      ? trend >= 0
      : false

  return (
    <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl px-5 py-4 transition-all duration-200 hover:border-gray-700/80 hover:-translate-y-[1px] hover:shadow-md hover:shadow-black/20">
      <div className="flex items-start justify-between gap-4">

        {/* CONTENT */}

        <div className="min-w-0">

          <p className="text-[11px] text-gray-600">
            {label}
          </p>

          <p
            className={`text-2xl font-semibold mt-1 truncate ${valueClassName}`}
          >
            {value}
          </p>

          {hasTrend && (
            <div className="flex items-center gap-1.5 mt-2">

              {isPositive ? (
                <TrendingUp
                  size={12}
                  className="text-emerald-400 flex-shrink-0"
                />
              ) : (
                <TrendingDown
                  size={12}
                  className="text-red-400 flex-shrink-0"
                />
              )}

              <span
                className={`text-[11px] font-medium ${
                  isPositive
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }`}
              >
                {typeof trend === 'number'
                  ? `${Math.abs(trend)}%`
                  : trend}
              </span>

              {trendLabel && (
                <span className="text-[11px] text-gray-600">
                  {trendLabel}
                </span>
              )}

            </div>
          )}

        </div>

        {/* ICON */}

        {Icon && (
          <div
            className={`w-9 h-9 rounded-lg border border-gray-800/80 flex items-center justify-center flex-shrink-0 ${iconBackgroundClassName}`}
          >
            <Icon
              size={17}
              className={iconClassName}
            />
          </div>
        )}

      </div>
    </div>
  )
}

export default StatCard