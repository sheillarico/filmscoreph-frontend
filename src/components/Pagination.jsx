function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i)

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6 m-10">
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="px-3 py-1.5 text-sm rounded bg-gray-900 text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ‹ Prev
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 text-sm rounded transition-colors ${
            p === currentPage
              ? 'bg-red-600 text-white font-semibold'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1.5 text-sm rounded bg-gray-900 text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next ›
      </button>
    </div>
  )
}

export default Pagination