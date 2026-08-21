import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

function SortableHeader({
  label,
  sortKey,
  sortConfig,
  onSort,
  className = '',
}) {
  const isActive =
    sortConfig?.key === sortKey

  const direction =
    sortConfig?.direction

  return (
    <button
      type="button"
      onClick={() =>
        onSort(sortKey)
      }
      className={`
        group
        inline-flex
        items-center
        gap-1.5
        cursor-pointer
        select-none
        transition-colors
        ${className}
        ${
          isActive
            ? 'text-gray-200'
            : 'text-gray-500 hover:text-gray-200'
        }
      `}
      title={`Sort by ${label}`}
    >
      <span>
        {label}
      </span>

      <span
        className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0"
        aria-hidden="true"
      >
        {isActive ? (
          direction ===
          'asc' ? (
            <ArrowUp
              size={13}
              strokeWidth={2}
              className="text-red-400"
            />
          ) : (
            <ArrowDown
              size={13}
              strokeWidth={2}
              className="text-red-400"
            />
          )
        ) : (
          <ArrowUpDown
            size={13}
            strokeWidth={1.8}
            className="text-gray-700 group-hover:text-gray-400 transition-colors"
          />
        )}
      </span>
    </button>
  )
}

export default SortableHeader