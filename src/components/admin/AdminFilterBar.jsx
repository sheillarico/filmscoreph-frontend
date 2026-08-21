import {
  Search,
  X,
  SlidersHorizontal,
} from 'lucide-react'

function AdminFilterBar({
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  onClear,
  children,
  resultText,
}) {
  const hasSearch = search.length > 0

  return (
    <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl overflow-hidden">

      {/* ==================================================
          HEADER / SEARCH
      ================================================== */}

      <div className="p-4">

        <div className="flex items-center gap-2.5 mb-3">

          <div className="w-7 h-7 rounded-md bg-red-600/10 border border-red-600/20 flex items-center justify-center">
            <SlidersHorizontal
              size={13}
              className="text-red-400"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-300">
              Filters
            </p>

            <p className="text-[10px] text-gray-600 mt-0.5">
              Search and narrow the results.
            </p>
          </div>

        </div>

        {/* ==================================================
            SEARCH BAR
        ================================================== */}

        <div className="relative w-full">

          <Search
            size={16}
            className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
              hasSearch
                ? 'text-red-400'
                : 'text-gray-600'
            }`}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              onSearchChange?.(
                e.target.value
              )
            }
            placeholder={searchPlaceholder}
            className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-9 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/10 transition-all duration-150"
          />

          {hasSearch && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

        </div>

        {/* ==================================================
            FILTER CONTROLS
        ================================================== */}

        {children && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {children}
          </div>
        )}

      </div>

      {/* ==================================================
          RESULTS
      ================================================== */}

      {resultText && (
        <div className="px-4 py-3 border-t border-gray-800/60 bg-gray-900/20">

          <div className="flex items-center gap-2">

            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />

            <p className="text-[11px] text-gray-600">
              {resultText}
            </p>

          </div>

        </div>
      )}

    </div>
  )
}

export default AdminFilterBar