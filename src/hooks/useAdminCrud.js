import {
  useState,
  useEffect,
  useCallback,
} from 'react'

import { useAuth } from '../context/AuthContext'

const API_BASE =
  'http://localhost:8081/api'

export function useAdminCrud(
  resourcePath
) {
  const { token } = useAuth()

  const [items, setItems] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [selectedIds, setSelectedIds] =
    useState([])

  const authHeaders = {
    'Content-Type':
      'application/json',
    Authorization: `Bearer ${token}`,
  }

  const load = useCallback(
    async () => {
      if (!token) {
        return
      }

      setLoading(true)

      try {
        const res =
          await fetch(
            `${API_BASE}/${resourcePath}`,
            {
              headers:
                authHeaders,
            }
          )

        if (!res.ok) {
          throw new Error(
            `Failed to load ${resourcePath}.`
          )
        }

        const data =
          await res.json()

        setItems(
          data.content ?? data
        )
      } catch (err) {
        console.error(
          `Failed to load ${resourcePath}:`,
          err
        )

        setItems([])
      } finally {
        setLoading(false)
      }
    },
    [resourcePath, token]
  )

  useEffect(() => {
    load()
  }, [load])

  const createItem =
    async (payload) => {
      const res =
        await fetch(
          `${API_BASE}/${resourcePath}`,
          {
            method: 'POST',
            headers:
              authHeaders,
            body: JSON.stringify(
              payload
            ),
          }
        )

      if (!res.ok) {
        let message =
          'Failed to create.'

        try {
          const data =
            await res.json()

          message =
            data?.message ||
            data?.error ||
            message
        } catch {
          // Ignore invalid response body.
        }

        throw new Error(message)
      }

      await load()
    }

  const updateItem =
    async (id, payload) => {
      const res =
        await fetch(
          `${API_BASE}/${resourcePath}/${id}`,
          {
            method: 'PUT',
            headers:
              authHeaders,
            body: JSON.stringify(
              payload
            ),
          }
        )

      if (!res.ok) {
        let message =
          'Failed to update.'

        try {
          const data =
            await res.json()

          message =
            data?.message ||
            data?.error ||
            message
        } catch {
          // Ignore invalid response body.
        }

        throw new Error(message)
      }

      await load()
    }

  const deleteItem =
    async (id) => {
      const res =
        await fetch(
          `${API_BASE}/${resourcePath}/${id}`,
          {
            method: 'DELETE',
            headers:
              authHeaders,
          }
        )

      if (!res.ok) {
        let message =
          'Failed to delete.'

        try {
          const data =
            await res.json()

          message =
            data?.message ||
            data?.error ||
            message
        } catch {
          // Ignore invalid response body.
        }

        throw new Error(message)
      }

      await load()
    }

  const deleteSelected =
    async () => {
      const ids = [
        ...selectedIds,
      ]

      if (ids.length === 0) {
        return
      }

      await Promise.all(
        ids.map(async (id) => {
          const res =
            await fetch(
              `${API_BASE}/${resourcePath}/${id}`,
              {
                method: 'DELETE',
                headers:
                  authHeaders,
              }
            )

          if (!res.ok) {
            throw new Error(
              `Failed to delete ${resourcePath} item ${id}.`
            )
          }
        })
      )

      setSelectedIds([])

      await load()
    }

  const toggleSelect = (id) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter(
              (i) => i !== id
            )
          : [...prev, id]
    )
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  return {
    items,
    loading,
    load,
    createItem,
    updateItem,
    deleteItem,
    deleteSelected,
    selectedIds,
    toggleSelect,
    clearSelection,
  }
}