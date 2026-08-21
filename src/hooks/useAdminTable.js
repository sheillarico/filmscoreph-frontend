import { useMemo, useState } from 'react'

function useAdminTable(items = [], sortAccessors = {}) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  })

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction:
            current.direction === 'asc'
              ? 'desc'
              : 'asc',
        }
      }

      return {
        key,
        direction: 'asc',
      }
    })
  }

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) {
      return items
    }

    const accessor = sortAccessors[sortConfig.key]

    if (!accessor) {
      return items
    }

    return [...items].sort((a, b) => {
      const valueA = accessor(a)
      const valueB = accessor(b)

      if (
        valueA === null ||
        valueA === undefined
      ) {
        return 1
      }

      if (
        valueB === null ||
        valueB === undefined
      ) {
        return -1
      }

      if (
        typeof valueA === 'string' &&
        typeof valueB === 'string'
      ) {
        const result =
          valueA.localeCompare(
            valueB,
            undefined,
            {
              numeric: true,
              sensitivity: 'base',
            }
          )

        return sortConfig.direction === 'asc'
          ? result
          : -result
      }

      if (valueA < valueB) {
        return sortConfig.direction === 'asc'
          ? -1
          : 1
      }

      if (valueA > valueB) {
        return sortConfig.direction === 'asc'
          ? 1
          : -1
      }

      return 0
    })
  }, [
    items,
    sortAccessors,
    sortConfig,
  ])

  const resetSort = () => {
    setSortConfig({
      key: null,
      direction: 'asc',
    })
  }

  return {
    sortedItems,
    sortConfig,
    handleSort,
    resetSort,
  }
}

export default useAdminTable