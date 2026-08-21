import { useMemo, useState } from 'react'

function useAdminSelection(items = []) {
  const [selectedIds, setSelectedIds] =
    useState([])

  const itemIds = useMemo(
    () =>
      items
        .map((item) => item.id)
        .filter(
          (id) =>
            id !== null &&
            id !== undefined
        ),
    [items]
  )

  const toggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter(
            (selectedId) =>
              selectedId !== id
          )
        : [...current, id]
    )
  }

  const selectAll = () => {
    setSelectedIds(itemIds)
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  const isSelected = (id) =>
    selectedIds.includes(id)

  const allSelected =
    itemIds.length > 0 &&
    itemIds.every((id) =>
      selectedIds.includes(id)
    )

  const toggleSelectAll = () => {
    if (allSelected) {
      clearSelection()
    } else {
      selectAll()
    }
  }

  return {
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    isSelected,
    allSelected,
    toggleSelectAll,
  }
}

export default useAdminSelection