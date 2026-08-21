function SelectionToolbar({
  selectedCount,
  onClear,
  onDeleteSelected,
}) {
  if (!selectedCount) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-3 bg-gray-950/70 border border-gray-800/80 rounded-xl px-4 py-3">
      <p className="text-xs text-gray-400">
        <span className="text-white font-medium">
          {selectedCount}
        </span>{' '}
        item
        {selectedCount !== 1
          ? 's'
          : ''}{' '}
        selected
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-gray-900 transition-colors"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={
            onDeleteSelected
          }
          className="px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-colors"
        >
          Delete selected
        </button>
      </div>
    </div>
  )
}

export default SelectionToolbar