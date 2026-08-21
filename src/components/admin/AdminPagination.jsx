import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null
  }

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return
    }

    onPageChange(page)
  }

  const renderButtons = () => {
    const buttons = []

    for (
      let page = 1;
      page <= totalPages;
      page++
    ) {
      const isFirst = page === 1
      const isLast =
        page === totalPages

      const isNearCurrent =
        Math.abs(
          page - currentPage
        ) <= 1

      if (
        isFirst ||
        isLast ||
        isNearCurrent
      ) {
        buttons.push(
          <button
            key={page}
            type="button"
            onClick={() =>
              goToPage(page)
            }
            className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border text-xs font-medium transition-colors ${
              currentPage === page
                ? 'bg-red-600 border-red-600 text-white'
                : 'border-gray-800 bg-gray-950 text-gray-400 hover:text-white hover:bg-gray-900'
            }`}
            aria-current={
              currentPage === page
                ? 'page'
                : undefined
            }
          >
            {page}
          </button>
        )
      } else if (
        (page === 2 &&
          currentPage > 3) ||
        (page ===
          totalPages - 1 &&
          currentPage <
            totalPages - 2)
      ) {
        buttons.push(
          <span
            key={`ellipsis-${page}`}
            className="inline-flex items-center justify-center w-9 h-9 text-xs text-gray-600"
          >
            ...
          </span>
        )
      }
    }

    return buttons
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">
      <p className="text-xs text-gray-600">
        Page{' '}
        <span className="text-gray-400 font-medium">
          {currentPage}
        </span>{' '}
        of{' '}
        <span className="text-gray-400 font-medium">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() =>
            goToPage(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-800 bg-gray-950 text-gray-400 hover:text-white hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {renderButtons()}

        <button
          type="button"
          onClick={() =>
            goToPage(currentPage + 1)
          }
          disabled={
            currentPage === totalPages
          }
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-800 bg-gray-950 text-gray-400 hover:text-white hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default AdminPagination