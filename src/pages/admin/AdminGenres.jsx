import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Film,
  RefreshCw,
} from 'lucide-react'

import { useAdminCrud } from '../../hooks/useAdminCrud'
import useAdminTable from '../../hooks/useAdminTable'
import useAdminSelection from '../../hooks/useAdminSelection'
import useAdminCrudFeedback from '../../hooks/useAdminCrudFeedback'

import { getMovies } from '../../services/api'

import AdminPageShell from '../../components/admin/AdminPageShell'
import AdminTable from '../../components/admin/AdminTable'
import AdminActionButtons from '../../components/admin/AdminActionButtons'
import SelectionToolbar from '../../components/admin/SelectionToolbar'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'
import LoadingState from '../../components/admin/LoadingState'
import SortableHeader from '../../components/admin/SortableHeader'
import AdminPagination from '../../components/admin/AdminPagination'
import AdminToast from '../../components/admin/AdminToast'
import AdminFilterBar from '../../components/admin/AdminFilterBar'

// =========================================================
// SCOPED STYLES
// =========================================================

const TABLE_STYLES = `
  @keyframes genreRowFadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  label,
  value,
  icon: IconComp,
  iconClassName = 'text-gray-600',
  valueClassName = 'text-white',
}) {
  return (
    <div className="bg-gray-950/60 border border-gray-800/70 rounded-xl px-4 py-3.5 flex items-start justify-between transition-all duration-200 hover:border-gray-700/80 hover:-translate-y-[1px] hover:shadow-md hover:shadow-black/20">
      <div>
        <p className="text-[11px] text-gray-600">
          {label}
        </p>

        <p
          className={`text-xl font-semibold mt-0.5 ${valueClassName}`}
        >
          {value}
        </p>
      </div>

      {IconComp && (
        <div className="w-7 h-7 rounded-md bg-gray-900/70 border border-gray-800/70 flex items-center justify-center mt-0.5">
          <IconComp
            size={13}
            className={iconClassName}
          />
        </div>
      )}
    </div>
  )
}

// =========================================================
// ADMIN GENRES
// =========================================================

function AdminGenres() {
  // =========================================================
  // GENRES
  // =========================================================

  const {
    items,
    loading,
    load: loadGenres,
    createItem,
    updateItem,
    deleteItem,
    deleteSelected,
  } = useAdminCrud('genres')

  // =========================================================
  // CRUD FEEDBACK
  // =========================================================

  const {
    toast,
    showToast,
    closeToast,
    operation,
    startOperation,
    finishOperation,
    handleError,
  } = useAdminCrudFeedback()

  // =========================================================
  // SELECTION
  // =========================================================

  const {
    selectedIds,
    toggleSelect,
    clearSelection,
  } = useAdminSelection(items)

  // =========================================================
  // MOVIES
  // =========================================================

  const [movies, setMovies] =
    useState([])

  const [moviesLoading, setMoviesLoading] =
    useState(true)

  // =========================================================
  // REFRESH
  // =========================================================

  const [refreshing, setRefreshing] =
    useState(false)

  // =========================================================
  // ADD
  // =========================================================

  const [newGenre, setNewGenre] =
    useState('')

  const [addError, setAddError] =
    useState('')

  // =========================================================
  // FILTER / PAGINATION
  // =========================================================

  const [search, setSearch] =
    useState('')

  const [currentPage, setCurrentPage] =
    useState(1)

  // =========================================================
  // DELETE
  // =========================================================

  const [confirmOpen, setConfirmOpen] =
    useState(false)

  const [rowToDelete, setRowToDelete] =
    useState(null)

  // =========================================================
  // EDIT
  // =========================================================

  const [editOpen, setEditOpen] =
    useState(false)

  const [editingGenre, setEditingGenre] =
    useState(null)

  const [editName, setEditName] =
    useState('')

  const [editError, setEditError] =
    useState('')

  const GENRES_PER_PAGE = 10

  // =========================================================
  // LOAD MOVIES
  // =========================================================

  const loadMovies = async () => {
    setMoviesLoading(true)

    try {
      const response =
        await getMovies()

      const movieData =
        Array.isArray(response)
          ? response
          : Array.isArray(
              response?.content
            )
            ? response.content
            : Array.isArray(
                  response?.data
                )
              ? response.data
              : []

      setMovies(movieData)

      return movieData
    } catch (error) {
      console.error(
        'Failed to load movies for genre counts:',
        error
      )

      setMovies([])

      throw error
    } finally {
      setMoviesLoading(false)
    }
  }

  // =========================================================
  // INITIAL MOVIE LOAD
  // =========================================================

  useEffect(() => {
    let mounted = true

    const loadInitialMovies =
      async () => {
        try {
          setMoviesLoading(true)

          const response =
            await getMovies()

          if (!mounted) {
            return
          }

          const movieData =
            Array.isArray(response)
              ? response
              : Array.isArray(
                  response?.content
                )
                ? response.content
                : Array.isArray(
                      response?.data
                    )
                  ? response.data
                  : []

          setMovies(movieData)
        } catch (error) {
          if (mounted) {
            setMovies([])
          }
        } finally {
          if (mounted) {
            setMoviesLoading(false)
          }
        }
      }

    loadInitialMovies()

    return () => {
      mounted = false
    }
  }, [items])

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    if (
      refreshing ||
      operation.loading
    ) {
      return
    }

    setRefreshing(true)

    try {
      await Promise.all([
        loadGenres(),
        loadMovies(),
      ])

      showToast(
        'success',
        'Genres refreshed successfully.'
      )
    } catch (error) {
      console.error(
        'Failed to refresh genres:',
        error
      )

      handleError(
        error,
        'Unable to refresh genres.'
      )
    } finally {
      setRefreshing(false)
    }
  }

  // =========================================================
  // MOVIE COUNTS
  // =========================================================

  const movieCounts = useMemo(() => {
    const counts = {}

    items.forEach((genre) => {
      counts[genre.id] = 0
    })

    movies.forEach((movie) => {
      let movieGenres = []

      if (
        Array.isArray(
          movie.genres
        )
      ) {
        movieGenres =
          movie.genres
      } else if (
        movie.genre
      ) {
        movieGenres = [
          movie.genre,
        ]
      } else if (
        Array.isArray(
          movie.genreIds
        )
      ) {
        movieGenres =
          movie.genreIds
      }

      movieGenres.forEach(
        (movieGenre) => {
          const genreId =
            typeof movieGenre ===
            'object'
              ? movieGenre?.id
              : movieGenre

          if (
            genreId !==
              undefined &&
            genreId !== null &&
            counts[
              genreId
            ] !== undefined
          ) {
            counts[
              genreId
            ] += 1
          }
        }
      )
    })

    return counts
  }, [
    items,
    movies,
  ])

  // =========================================================
  // ADD GENRE
  // =========================================================

  const handleAdd =
    async (e) => {
      e.preventDefault()

      const genreName =
        newGenre.trim()

      if (!genreName) {
        return
      }

      setAddError('')

      const duplicateName =
        items.some(
          (genre) =>
            genre.name
              ?.trim()
              .toLowerCase() ===
            genreName.toLowerCase()
        )

      if (duplicateName) {
        setAddError(
          'A genre with this name already exists.'
        )

        return
      }

      startOperation('create')

      try {
        await createItem({
          name: genreName,
        })

        setNewGenre('')
        setCurrentPage(1)

        showToast(
          'success',
          `"${genreName}" was added successfully.`
        )
      } catch (error) {
        handleError(
          error,
          'Unable to add this genre. Please try again.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEdit = (
    genre
  ) => {
    if (operation.loading) {
      return
    }

    setEditingGenre(
      genre
    )

    setEditName(
      genre.name || ''
    )

    setEditError('')
    setEditOpen(true)
  }

  // =========================================================
  // CLOSE EDIT
  // =========================================================

  const closeEdit = () => {
    if (
      operation.loading
    ) {
      return
    }

    setEditOpen(false)
    setEditingGenre(null)
    setEditName('')
    setEditError('')
  }

  // =========================================================
  // EDIT GENRE
  // =========================================================

  const handleEdit =
    async (e) => {
      e.preventDefault()

      if (
        !editingGenre
      ) {
        return
      }

      const trimmedName =
        editName.trim()

      if (!trimmedName) {
        setEditError(
          'Genre name is required.'
        )

        return
      }

      const duplicateName =
        items.some(
          (genre) =>
            Number(
              genre.id
            ) !==
              Number(
                editingGenre.id
              ) &&
            genre.name
              ?.trim()
              .toLowerCase() ===
              trimmedName.toLowerCase()
        )

      if (duplicateName) {
        setEditError(
          'Another genre already uses this name.'
        )

        return
      }

      setEditError('')

      startOperation(
        'update'
      )

      try {
        await updateItem(
          editingGenre.id,
          {
            name:
              trimmedName,
          }
        )

        setEditOpen(false)
        setEditingGenre(null)
        setEditName('')

        showToast(
          'success',
          'Genre updated successfully.'
        )
      } catch (error) {
        handleError(
          error,
          'Unable to update this genre. Please try again.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // MOVIE COUNT
  // =========================================================

  const getMovieCount =
    (genre) => {
      return (
        movieCounts[
          genre.id
        ] ?? 0
      )
    }

  // =========================================================
  // FILTER
  // =========================================================

  const filteredGenres =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase()

      if (!value) {
        return items
      }

      return items.filter(
        (genre) => {
          const name =
            genre.name
              ?.toLowerCase() ||
            ''

          const id =
            String(
              genre.id ?? ''
            )

          return (
            name.includes(
              value
            ) ||
            id.includes(
              value
            )
          )
        }
      )
    }, [
      items,
      search,
    ])

  // =========================================================
  // SORTING
  // =========================================================

  const sortAccessors =
    useMemo(
      () => ({
        id: (genre) =>
          Number(
            genre.id ?? 0
          ),

        name: (genre) =>
          genre.name || '',

        movies: (genre) =>
          getMovieCount(
            genre
          ),
      }),
      [movieCounts]
    )

  const {
    sortedItems,
    sortConfig,
    handleSort,
  } = useAdminTable(
    filteredGenres,
    sortAccessors
  )

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        sortedItems.length /
          GENRES_PER_PAGE
      )
    )

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      )
    }
  }, [
    currentPage,
    totalPages,
  ])

  const paginatedGenres =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        GENRES_PER_PAGE

      return sortedItems.slice(
        start,
        start +
          GENRES_PER_PAGE
      )
    }, [
      sortedItems,
      currentPage,
    ])

  const pageStart =
    sortedItems.length ===
    0
      ? 0
      : (currentPage - 1) *
          GENRES_PER_PAGE +
        1

  const pageEnd =
    Math.min(
      currentPage *
        GENRES_PER_PAGE,
      sortedItems.length
    )

  // =========================================================
  // DELETE SELECTED
  // =========================================================

  const handleDeleteSelected =
    async () => {
      if (
        operation.loading ||
        selectedIds.length === 0
      ) {
        return
      }

      startOperation(
        'delete-selected'
      )

      try {
        const count =
          selectedIds.length

        await deleteSelected()

        clearSelection()
        setConfirmOpen(false)

        showToast(
          'success',
          `${count} genre${
            count !== 1
              ? 's'
              : ''
          } deleted successfully.`
        )
      } catch (error) {
        handleError(
          error,
          'Unable to delete the selected genres.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // DELETE SINGLE
  // =========================================================

  const handleDeleteSingle =
    async () => {
      if (
        !rowToDelete ||
        operation.loading
      ) {
        return
      }

      startOperation('delete')

      try {
        const deletedName =
          rowToDelete.name

        await deleteItem(
          rowToDelete.id
        )

        setRowToDelete(null)

        showToast(
          'success',
          `"${deletedName}" was deleted successfully.`
        )
      } catch (error) {
        handleError(
          error,
          'Unable to delete this genre.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AdminPageShell
      title="Genre Management"
      subtitle="Manage genres used to organize movies throughout the FilmScore PH catalog."
      actions={
        <button
          type="button"
          onClick={
            handleRefresh
          }
          disabled={
            refreshing ||
            loading ||
            operation.loading
          }
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-800 bg-gray-950/70 text-xs text-gray-400 hover:text-white hover:bg-gray-900 hover:border-gray-700 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RefreshCw
            size={13}
            className={
              refreshing
                ? 'animate-spin'
                : ''
            }
          />

          {refreshing
            ? 'Refreshing...'
            : 'Refresh'}
        </button>
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html:
            TABLE_STYLES,
        }}
      />

      <AdminToast
        open={
          toast.open
        }
        type={
          toast.type
        }
        message={
          toast.message
        }
        onClose={
          closeToast
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-5">

        {/* ==================================================
            LEFT COLUMN
        ================================================== */}

        <div className="space-y-5">

          {/* ADD GENRE */}

          <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl overflow-hidden transition-colors duration-200 hover:border-gray-700/70">

            <div className="px-5 py-4 border-b border-gray-800/80">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                  <Tag
                    size={17}
                    className="text-red-400"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Add Genre
                  </h2>

                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Add a new genre to the catalog.
                  </p>
                </div>

              </div>

            </div>

            <form
              onSubmit={handleAdd}
              className="p-5"
            >

              <label className="block text-xs font-medium text-gray-400 mb-2">
                Genre Name
              </label>

              <input
                type="text"
                value={newGenre}
                disabled={
                  operation.loading
                }
                onChange={(e) => {
                  setNewGenre(
                    e.target.value
                  )

                  setAddError('')
                }}
                placeholder="e.g. Action"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 transition-colors duration-150 disabled:opacity-50"
              />

              {addError && (
                <p className="text-xs text-red-400 mt-2">
                  {addError}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  operation.loading ||
                  !newGenre.trim()
                }
                className="w-full mt-4 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed disabled:active:scale-100 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
              >
                <Plus size={15} />

                {operation.type ===
                'create'
                  ? 'Adding...'
                  : 'Add Genre'}
              </button>

            </form>

          </div>

          {/* STAT */}

          <StatCard
            label="Total Genres"
            value={
              items.length
            }
            icon={Tag}
            iconClassName="text-purple-400"
            valueClassName="text-purple-300"
          />

          {/* FILTER */}

          <AdminFilterBar
            search={
              search
            }
            onSearchChange={(
              value
            ) => {
              setSearch(
                value
              )
              setCurrentPage(
                1
              )
            }}
            onClear={() => {
              setSearch('')
              setCurrentPage(
                1
              )
            }}
            searchPlaceholder="Search genre name or ID..."
            resultText={`Showing ${pageStart}-${pageEnd} of ${sortedItems.length} genres`}
          />

        </div>

        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <div className="min-w-0 w-full">

          {selectedIds.length >
            0 && (
            <div className="mb-4">

              <SelectionToolbar
                selectedCount={
                  selectedIds.length
                }
                onClear={
                  clearSelection
                }
                onDeleteSelected={() =>
                  setConfirmOpen(
                    true
                  )
                }
              />

            </div>
          )}

          {loading ? (
            <LoadingState
              label="Loading genres..."
            />
          ) : items.length ===
            0 ? (
            <EmptyState
              icon={Tag}
              title="No genres yet"
              message="Add your first genre using the form."
            />
          ) : sortedItems.length ===
            0 ? (
            <EmptyState
              icon={Tag}
              title="No genres found"
              message="No genre matches your current search."
            />
          ) : (
            <>

              <AdminTable
                widths={[
                  '7%',
                  '10%',
                  '43%',
                  '17%',
                  '23%',
                ]}
                columns={[
                  '',

                  <SortableHeader
                    key="id"
                    label="Genre #"
                    sortKey="id"
                    sortConfig={
                      sortConfig
                    }
                    onSort={
                      handleSort
                    }
                    className="justify-center"
                  />,

                  <SortableHeader
                    key="name"
                    label="Genre"
                    sortKey="name"
                    sortConfig={
                      sortConfig
                    }
                    onSort={
                      handleSort
                    }
                    className="justify-start"
                  />,

                  <SortableHeader
                    key="movies"
                    label="Movies"
                    sortKey="movies"
                    sortConfig={
                      sortConfig
                    }
                    onSort={
                      handleSort
                    }
                    className="justify-center"
                  />,

                  <span
                    key="actions"
                    className="block text-center"
                  >
                    Actions
                  </span>,
                ]}
              >

                {paginatedGenres.map(
                  (
                    genre,
                    index
                  ) => (
                    <tr
                      key={
                        genre.id
                      }
                      className="hover:bg-gray-900/40 transition-colors duration-150"
                      style={{
                        animation:
                          'genreRowFadeIn 300ms ease both',
                        animationDelay: `${Math.min(
                          index *
                            18,
                          160
                        )}ms`,
                      }}
                    >

                      {/* CHECKBOX */}

                      <td className="px-3 py-3.5 text-center">

                        <input
                          type="checkbox"
                          disabled={
                            operation.loading
                          }
                          checked={selectedIds.includes(
                            genre.id
                          )}
                          onChange={() =>
                            toggleSelect(
                              genre.id
                            )
                          }
                          aria-label={`Select ${genre.name}`}
                          className="appearance-none w-4 h-4 rounded-[4px] border border-gray-700 bg-gray-900 cursor-pointer transition-all checked:bg-red-600 checked:border-red-500 hover:border-gray-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                        />

                      </td>

                      {/* GENRE # */}

                      <td className="px-2 py-3.5 text-center whitespace-nowrap">

                        <span className="text-[13px] text-gray-500 font-mono">
                          #{genre.id}
                        </span>

                      </td>

                      {/* GENRE */}

                      <td className="px-4 py-3.5 text-left">

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-9 h-9 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center flex-shrink-0">
                            <Tag
                              size={15}
                              className="text-gray-500"
                            />
                          </div>

                          <div className="min-w-0 text-left">

                            <p className="text-[15px] text-white font-semibold truncate">
                              {
                                genre.name
                              }
                            </p>

                            <p className="text-xs text-gray-600 mt-0.5">
                              Movie category
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* MOVIES */}

                      <td className="px-2 py-3.5 text-center whitespace-nowrap">

                        <span className="inline-flex items-center justify-center gap-1.5 text-[15px] text-gray-400 tabular-nums">

                          <Film
                            size={13}
                            className="text-gray-600"
                          />

                          {moviesLoading
                            ? '—'
                            : getMovieCount(
                                genre
                              ).toLocaleString()}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-2 py-3.5 text-center">

                        <AdminActionButtons>

                          {/* EDIT */}

                          <button
                            type="button"
                            disabled={
                              operation.loading
                            }
                            onClick={() =>
                              openEdit(
                                genre
                              )
                            }
                            title="Edit genre"
                            aria-label={`Edit ${genre.name}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/40"
                          >
                            <Pencil
                              size={15}
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={
                              operation.loading
                            }
                            onClick={() =>
                              setRowToDelete(
                                genre
                              )
                            }
                            title="Delete genre"
                            aria-label={`Delete ${genre.name}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/40"
                          >
                            <Trash2
                              size={15}
                            />
                          </button>

                        </AdminActionButtons>

                      </td>

                    </tr>
                  )
                )}

              </AdminTable>

              <AdminPagination
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                onPageChange={
                  setCurrentPage
                }
              />

            </>
          )}

        </div>
      </div>

      {/* ==================================================
          EDIT GENRE
      ================================================== */}

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <button
            type="button"
            aria-label="Close edit dialog"
            onClick={
              closeEdit
            }
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-gray-950 border border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-gray-800/80">

              <h2 className="text-lg font-semibold text-white">
                Edit Genre
              </h2>

              <p className="text-xs text-gray-600 mt-1">
                Update the genre name.
              </p>

            </div>

            <form
              onSubmit={
                handleEdit
              }
            >

              <div className="p-6 space-y-5">

                {/* GENRE ID */}

                <div>

                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Genre ID
                  </label>

                  <div className="w-full bg-gray-900/70 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-500 font-mono">
                    #{editingGenre?.id}
                  </div>

                  <p className="text-[11px] text-gray-600 mt-2">
                    Genre IDs are permanent identifiers and cannot be changed.
                  </p>

                </div>

                {/* GENRE NAME */}

                <div>

                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Genre Name
                  </label>

                  <input
                    type="text"
                    value={
                      editName
                    }
                    disabled={
                      operation.loading
                    }
                    onChange={(e) => {
                      setEditName(
                        e.target.value
                      )

                      setEditError(
                        ''
                      )
                    }}
                    placeholder="Enter genre name..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 transition-colors duration-150 disabled:opacity-50"
                  />

                </div>

                {editError && (
                  <p className="text-xs text-red-400">
                    {editError}
                  </p>
                )}

              </div>

              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-800/80">

                <button
                  type="button"
                  onClick={
                    closeEdit
                  }
                  disabled={
                    operation.loading
                  }
                  className="px-4 py-2.5 rounded-lg border border-gray-800 text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    operation.loading ||
                    !editName.trim()
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-600 disabled:active:scale-100 text-sm font-semibold text-white transition-all duration-150"
                >
                  <Pencil
                    size={14}
                  />

                  {operation.type ===
                  'update'
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================
          DELETE SELECTED
      ================================================== */}

      <ConfirmDialog
        open={
          confirmOpen
        }
        title="Delete selected genres?"
        message={`This will permanently delete ${selectedIds.length} genre(s) and remove them from any movies. This cannot be undone.`}
        confirmLabel={
          operation.type ===
          'delete-selected'
            ? 'Deleting...'
            : 'Delete'
        }
        onCancel={() => {
          if (
            !operation.loading
          ) {
            setConfirmOpen(
              false
            )
          }
        }}
        onConfirm={
          handleDeleteSelected
        }
      />

      {/* ==================================================
          DELETE SINGLE
      ================================================== */}

      <ConfirmDialog
        open={
          !!rowToDelete
        }
        title="Delete this genre?"
        message={
          rowToDelete
            ? `"${rowToDelete.name}" will be permanently deleted and removed from any movies using this genre. This cannot be undone.`
            : ''
        }
        confirmLabel={
          operation.type ===
          'delete'
            ? 'Deleting...'
            : 'Delete'
        }
        onCancel={() => {
          if (
            !operation.loading
          ) {
            setRowToDelete(
              null
            )
          }
        }}
        onConfirm={
          handleDeleteSingle
        }
      />

    </AdminPageShell>
  )
}

export default AdminGenres