import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Film,
  Plus,
  Pencil,
  Trash2,
  Search,
  Star,
  RefreshCw,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { useAdminCrud } from '../../hooks/useAdminCrud'
import useAdminTable from '../../hooks/useAdminTable'
import useAdminSelection from '../../hooks/useAdminSelection'
import useAdminCrudFeedback from '../../hooks/useAdminCrudFeedback'

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
import MovieFormModal from '../../components/admin/MovieFormModal'

// =========================================================
// API BASE
// =========================================================

const API_BASE =
  import.meta.env.VITE_API_BASE

// =========================================================
// SCOPED STYLES
// =========================================================

const TABLE_STYLES = `
  @keyframes movieRowFadeIn {
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
// TYPE BADGE
// =========================================================

function TypeBadge({ type }) {
  const normalized =
    String(type ?? '').toUpperCase()

  if (normalized === 'SERIES') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
        Series
      </span>
    )
  }

  if (normalized === 'MOVIE') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20">
        Movie
      </span>
    )
  }

  if (normalized === 'DOCUMENTARY') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
        Documentary
      </span>
    )
  }

  return (
    <span className="text-[11px] text-gray-600">
      —
    </span>
  )
}

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
// ADMIN MOVIES
// =========================================================

function AdminMovies() {
  const { token } = useAuth()

  // =========================================================
  // MOVIES
  // =========================================================

  const {
    items,
    loading,
    load: loadMovies,
    createItem,
    updateItem,
    deleteItem,
    deleteSelected,
  } = useAdminCrud('movies')

  // =========================================================
  // GENRES
  // =========================================================

  const { items: genres } =
    useAdminCrud('genres')

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
  // FILTERS
  // =========================================================

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] =
    useState('')
  const [genreFilter, setGenreFilter] =
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
  // MOVIE MODAL
  // =========================================================

  const [modalOpen, setModalOpen] =
    useState(false)

  const [editingMovie, setEditingMovie] =
    useState(null)

  // =========================================================
  // REFRESH
  // =========================================================

  const [refreshing, setRefreshing] =
    useState(false)

  // =========================================================
  // REVIEW / RATING STATISTICS
  // =========================================================

  const [reviewCounts, setReviewCounts] =
    useState({})

  const [averageRatings, setAverageRatings] =
    useState({})

  const [reviewStatsLoading, setReviewStatsLoading] =
    useState(true)

  const MOVIES_PER_PAGE = 10

  // =========================================================
  // LOAD REVIEW STATISTICS
  // =========================================================

  const loadReviewStats = async () => {
    if (!token) {
      return
    }

    setReviewStatsLoading(true)

    try {
      const [
        countsResponse,
        averagesResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE}/reviews/counts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        fetch(
          `${API_BASE}/reviews/averages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ])

      if (!countsResponse.ok) {
        throw new Error(
          `Failed to load review counts: ${countsResponse.status}`
        )
      }

      if (!averagesResponse.ok) {
        throw new Error(
          `Failed to load average ratings: ${averagesResponse.status}`
        )
      }

      const counts =
        await countsResponse.json()

      const averages =
        await averagesResponse.json()

      setReviewCounts(
        counts || {}
      )

      setAverageRatings(
        averages || {}
      )
    } catch (error) {
      console.error(
        'Failed to load review statistics:',
        error
      )

      setReviewCounts({})
      setAverageRatings({})
    } finally {
      setReviewStatsLoading(false)
    }
  }

  useEffect(() => {
    loadReviewStats()
  }, [token])

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
        loadMovies(),
        loadReviewStats(),
      ])

      showToast(
        'success',
        'Movies refreshed successfully.'
      )
    } catch (error) {
      console.error(
        'Failed to refresh movies:',
        error
      )

      handleError(
        error,
        'Unable to refresh movies.'
      )
    } finally {
      setRefreshing(false)
    }
  }

  // =========================================================
  // GENRE HELPERS
  // =========================================================

  const getGenreNames = (movie) => {
    if (Array.isArray(movie.genres)) {
      return movie.genres
        .map((genre) =>
          typeof genre === 'string'
            ? genre
            : genre?.name || ''
        )
        .filter(Boolean)
        .join(', ')
    }

    return ''
  }

  // =========================================================
  // RATING
  // =========================================================

  const getRating = (movie) => {
    const databaseRating =
      averageRatings[movie.id]

    const rating =
      databaseRating ??
      movie.averageRating ??
      movie.rating ??
      0

    const numericRating =
      Number(rating)

    return Number.isFinite(
      numericRating
    )
      ? numericRating
      : 0
  }

  // =========================================================
  // REVIEW COUNT
  // =========================================================

  const getReviewCount = (movie) => {
    const databaseCount =
      reviewCounts[movie.id]

    const count =
      databaseCount ??
      movie.reviewCount ??
      movie.reviews?.length ??
      0

    const numericCount =
      Number(count)

    return Number.isFinite(
      numericCount
    )
      ? numericCount
      : 0
  }

  // =========================================================
  // FILTER MOVIES
  // =========================================================

  const filteredMovies =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase()

      return items.filter(
        (movie) => {
          const title =
            movie.title?.toLowerCase() ||
            ''

          const director =
            movie.director?.toLowerCase() ||
            ''

          const genreNames =
            getGenreNames(
              movie
            ).toLowerCase()

          const type =
            String(
              movie.type ?? ''
            ).toLowerCase()

          const matchesSearch =
            !value ||
            title.includes(
              value
            ) ||
            director.includes(
              value
            ) ||
            genreNames.includes(
              value
            )

          const matchesType =
            !typeFilter ||
            type ===
              typeFilter.toLowerCase()

          const matchesGenre =
            !genreFilter ||
            genreNames
              .split(',')
              .map(
                (genre) =>
                  genre.trim()
              )
              .includes(
                genreFilter
              )

          return (
            matchesSearch &&
            matchesType &&
            matchesGenre
          )
        }
      )
    }, [
      items,
      search,
      typeFilter,
      genreFilter,
    ])

  // =========================================================
  // GENRE FILTER OPTIONS
  // =========================================================

  const genreOptions =
    useMemo(() => {
      const genreSet =
        new Set()

      items.forEach(
        (movie) => {
          if (
            Array.isArray(
              movie.genres
            )
          ) {
            movie.genres.forEach(
              (genre) => {
                const name =
                  typeof genre ===
                  'string'
                    ? genre
                    : genre?.name

                if (name) {
                  genreSet.add(
                    name
                  )
                }
              }
            )
          }
        }
      )

      return Array.from(
        genreSet
      ).sort((a, b) =>
        a.localeCompare(b)
      )
    }, [items])

  // =========================================================
  // SORTING
  // =========================================================

  const sortAccessors =
    useMemo(
      () => ({
        id: (movie) =>
          Number(
            movie.id ?? 0
          ),

        title: (movie) =>
          movie.title || '',

        releaseYear: (
          movie
        ) =>
          Number(
            movie.releaseYear ??
              0
          ),

        rating: (movie) =>
          getRating(movie),

        reviews: (movie) =>
          getReviewCount(
            movie
          ),
      }),
      [
        averageRatings,
        reviewCounts,
      ]
    )

  const {
    sortedItems,
    sortConfig,
    handleSort,
  } = useAdminTable(
    filteredMovies,
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
          MOVIES_PER_PAGE
      )
    )

  useEffect(() => {
    setCurrentPage(1)
  }, [
    search,
    typeFilter,
    genreFilter,
  ])

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

  const paginatedMovies =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        MOVIES_PER_PAGE

      return sortedItems.slice(
        start,
        start +
          MOVIES_PER_PAGE
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
          MOVIES_PER_PAGE +
        1

  const pageEnd =
    Math.min(
      currentPage *
        MOVIES_PER_PAGE,
      sortedItems.length
    )

  // =========================================================
  // STATISTICS
  // =========================================================

  const trailerCount =
    items.filter(
      (movie) =>
        Boolean(
          movie.trailerUrl
        )
    ).length

  const totalReviews =
    Object.values(
      reviewCounts
    ).reduce(
      (total, count) =>
        total +
        Number(
          count || 0
        ),
      0
    )

  const ratedMovies =
    items.filter(
      (movie) =>
        getReviewCount(
          movie
        ) > 0
    )

  const averageRating =
    ratedMovies.length >
    0
      ? (
          ratedMovies.reduce(
            (
              total,
              movie
            ) =>
              total +
              getRating(
                movie
              ),
            0
          ) /
          ratedMovies.length
        ).toFixed(1)
      : '0.0'

  // =========================================================
  // ADD MOVIE
  // =========================================================

  const handleOpenAdd =
    () => {
      if (operation.loading) {
        return
      }

      setEditingMovie(null)
      setModalOpen(true)
    }

  // =========================================================
  // EDIT MOVIE
  // =========================================================

  const handleOpenEdit =
    (movie) => {
      if (operation.loading) {
        return
      }

      setEditingMovie(movie)
      setModalOpen(true)
    }

  // =========================================================
  // SAVE MOVIE
  // =========================================================

  const handleSaveMovie =
    async (form) => {
      const isEditing =
        Boolean(
          editingMovie
        )

      startOperation(
        isEditing
          ? 'update'
          : 'create'
      )

      try {
        /*
         * IMPORTANT:
         *
         * The modal provides genreIds.
         * Send genreIds directly instead of
         * converting them into:
         *
         * genres: [{ id: 1 }]
         *
         * This keeps the PUT payload consistent
         * and allows multiple fields to be updated
         * together.
         */
        const payload = {
          title:
            form.title?.trim() ||
            '',

          description:
            form.description?.trim() ||
            null,

          releaseYear:
            form.releaseYear === '' ||
            form.releaseYear == null
              ? null
              : Number(
                  form.releaseYear
                ),

          type:
            form.type ||
            'MOVIE',

          posterUrl:
            form.posterUrl?.trim() ||
            null,

          trailerUrl:
            form.trailerUrl?.trim() ||
            null,

          watchLink:
            form.watchLink?.trim() ||
            null,

          director:
            form.director?.trim() ||
            null,

          durationMinutes:
            form.durationMinutes === '' ||
            form.durationMinutes == null
              ? null
              : Number(
                  form.durationMinutes
                ),

          language:
            form.language?.trim() ||
            null,

          genreIds:
            Array.isArray(
              form.genreIds
            )
              ? form.genreIds
                  .map(
                    (id) =>
                      Number(id)
                  )
                  .filter(
                    (id) =>
                      Number.isFinite(
                        id
                      )
                  )
              : [],
        }

        console.log(
          isEditing
            ? 'Updating movie payload:'
            : 'Creating movie payload:',
          payload
        )

        // =====================================================
        // UPDATE
        // =====================================================

        if (isEditing) {
          await updateItem(
            editingMovie.id,
            payload
          )

          showToast(
            'success',
            `"${payload.title}" was updated successfully.`
          )
        }

        // =====================================================
        // CREATE
        // =====================================================

        else {
          await createItem(
            payload
          )

          showToast(
            'success',
            `"${payload.title}" was added successfully.`
          )
        }

        /*
         * Refresh both movie records and
         * review statistics after the operation.
         */
        await Promise.all([
          loadMovies(),
          loadReviewStats(),
        ])

        setModalOpen(false)
        setEditingMovie(null)
      } catch (error) {
        console.error(
          isEditing
            ? 'Failed to update movie:'
            : 'Failed to create movie:',
          error
        )

        handleError(
          error,
          isEditing
            ? 'Unable to update the movie.'
            : 'Unable to add the movie.'
        )

        /*
         * Re-throw so MovieFormModal can also
         * display the error.
         */
        throw error
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // DELETE SELECTED
  // =========================================================

  const handleDeleteSelected =
    async () => {
      if (
        operation.loading ||
        selectedIds.length ===
          0
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

        await Promise.all([
          loadMovies(),
          loadReviewStats(),
        ])

        showToast(
          'success',
          `${count} movie${
            count !== 1
              ? 's'
              : ''
          } deleted successfully.`
        )
      } catch (error) {
        console.error(
          'Failed to delete selected movies:',
          error
        )

        handleError(
          error,
          'Unable to delete the selected movies.'
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
        const deletedTitle =
          rowToDelete.title

        await deleteItem(
          rowToDelete.id
        )

        setRowToDelete(null)

        await Promise.all([
          loadMovies(),
          loadReviewStats(),
        ])

        showToast(
          'success',
          `"${deletedTitle}" was deleted successfully.`
        )
      } catch (error) {
        console.error(
          'Failed to delete movie:',
          error
        )

        handleError(
          error,
          'Unable to delete this movie.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // FILTER CLEAR
  // =========================================================

  const clearFilters =
    () => {
      setSearch('')
      setTypeFilter('')
      setGenreFilter('')
      setCurrentPage(1)
    }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AdminPageShell
      title="Movie Management"
      subtitle="Manage movies, metadata, genres, trailers, and viewing links throughout the FilmScore PH catalog."
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
            LEFT SIDEBAR
        ================================================== */}

        <div className="space-y-5">

          {/* ADD MOVIE */}

          <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl overflow-hidden transition-colors duration-200 hover:border-gray-700/70">

            <div className="px-5 py-4 border-b border-gray-800/80">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                  <Film
                    size={17}
                    className="text-red-400"
                  />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Add Movie
                  </h2>

                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Add a new movie to the catalog.
                  </p>
                </div>

              </div>

            </div>

            <div className="p-5">

              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                Add movies with their title, poster, director, genres, trailer, and viewing links.
              </p>

              <button
                type="button"
                onClick={
                  handleOpenAdd
                }
                disabled={
                  operation.loading
                }
                className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 active:scale-[0.98] disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              >
                <Plus size={15} />
                Add Movie
              </button>

            </div>

          </div>

          {/* STAT CARDS */}

          <div className="grid grid-cols-2 gap-3">

            <StatCard
              label="Total Movies"
              value={
                items.length
              }
              icon={Film}
              iconClassName="text-blue-400"
              valueClassName="text-blue-300"
            />

            <StatCard
              label="Total Reviews"
              value={
                reviewStatsLoading
                  ? '—'
                  : totalReviews.toLocaleString()
              }
              icon={Star}
              iconClassName="text-violet-400"
              valueClassName="text-violet-300"
            />

            <StatCard
              label="With Trailer"
              value={
                trailerCount
              }
              icon={Film}
              iconClassName="text-emerald-400"
              valueClassName="text-emerald-300"
            />

            <StatCard
              label="Avg. Rating"
              value={
                reviewStatsLoading
                  ? '—'
                  : averageRating
              }
              icon={Star}
              iconClassName="text-amber-400"
              valueClassName="text-amber-300"
            />

          </div>

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
            onClear={
              clearFilters
            }
            searchPlaceholder="Search movie, director, or genre..."
            resultText={`Showing ${pageStart}-${pageEnd} of ${sortedItems.length} movies`}
          >

            <select
              value={
                typeFilter
              }
              onChange={(e) => {
                setTypeFilter(
                  e.target.value
                )
                setCurrentPage(
                  1
                )
              }}
              className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
            >
              <option value="">
                All Types
              </option>

              <option value="MOVIE">
                Movie
              </option>

              <option value="SERIES">
                Series
              </option>

              <option value="DOCUMENTARY">
                Documentary
              </option>
            </select>

            <select
              value={
                genreFilter
              }
              onChange={(e) => {
                setGenreFilter(
                  e.target.value
                )
                setCurrentPage(
                  1
                )
              }}
              className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
            >
              <option value="">
                All Genres
              </option>

              {genreOptions.map(
                (genre) => (
                  <option
                    key={
                      genre
                    }
                    value={
                      genre
                    }
                  >
                    {genre}
                  </option>
                )
              )}
            </select>

          </AdminFilterBar>

        </div>

        {/* ==================================================
            RIGHT TABLE
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
              label="Loading movies..."
            />
          ) : items.length ===
            0 ? (
            <EmptyState
              icon={Film}
              title="No movies yet"
              message="Add your first movie to the catalog."
            />
          ) : sortedItems.length ===
            0 ? (
            <EmptyState
              icon={Search}
              title="No movies found"
              message="No movies match your current filters."
            />
          ) : (
            <>

              <AdminTable
                widths={[
                  '6%',
                  '8%',
                  '36%',
                  '10%',
                  '13%',
                  '13%',
                  '14%',
                ]}
                columns={[
                  '',

                  <SortableHeader
                    key="id"
                    label="Movie #"
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
                    key="title"
                    label="Movie"
                    sortKey="title"
                    sortConfig={
                      sortConfig
                    }
                    onSort={
                      handleSort
                    }
                    className="justify-center"
                  />,

                  <SortableHeader
                    key="releaseYear"
                    label="Year"
                    sortKey="releaseYear"
                    sortConfig={
                      sortConfig
                    }
                    onSort={
                      handleSort
                    }
                    className="justify-center"
                  />,

                  <SortableHeader
                    key="rating"
                    label="Rating"
                    sortKey="rating"
                    sortConfig={
                      sortConfig
                    }
                    onSort={
                      handleSort
                    }
                    className="justify-center"
                  />,

                  <SortableHeader
                    key="reviews"
                    label="Reviews"
                    sortKey="reviews"
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

                {paginatedMovies.map(
                  (
                    movie,
                    index
                  ) => (
                    <tr
                      key={
                        movie.id
                      }
                      className="hover:bg-gray-900/40 transition-colors duration-150"
                      style={{
                        animation:
                          'movieRowFadeIn 300ms ease both',
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
                          checked={selectedIds.includes(
                            movie.id
                          )}
                          disabled={
                            operation.loading
                          }
                          onChange={() =>
                            toggleSelect(
                              movie.id
                            )
                          }
                          aria-label={`Select ${movie.title}`}
                          className="appearance-none w-4 h-4 rounded-[4px] border border-gray-700 bg-gray-900 cursor-pointer transition-colors duration-150 checked:bg-red-600 checked:border-red-500 hover:border-gray-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
                        />

                      </td>

                      {/* MOVIE # */}

                      <td className="px-2 py-3.5 text-center whitespace-nowrap">

                        <span className="text-[13px] text-gray-500 font-mono">
                          #{movie.id}
                        </span>

                      </td>

                      {/* MOVIE */}

                      <td className="px-4 py-3.5 min-w-0">

                        <div className="flex items-center gap-3 min-w-0">

                          {movie.posterUrl ? (
                            <img
                              src={
                                movie.posterUrl
                              }
                              alt=""
                              className="w-9 h-12 object-cover rounded-md border border-gray-800 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-12 rounded-md bg-gray-900 border border-gray-800 flex items-center justify-center flex-shrink-0">
                              <Film
                                size={14}
                                className="text-gray-700"
                              />
                            </div>
                          )}

                          <div className="min-w-0">

                            <p className="text-[15px] text-white font-semibold truncate">
                              {
                                movie.title
                              }
                            </p>

                            <p className="text-xs text-gray-600 truncate mt-0.5">
                              {
                                movie.director ||
                                'Unknown director'
                              }
                            </p>

                            <div className="flex items-center gap-1.5 mt-1.5 min-w-0">

                              <TypeBadge
                                type={
                                  movie.type
                                }
                              />

                              {getGenreNames(
                                movie
                              ) && (
                                <span className="text-[11px] text-gray-700 truncate">
                                  {getGenreNames(
                                    movie
                                  )}
                                </span>
                              )}

                            </div>

                          </div>

                        </div>

                      </td>

                      {/* YEAR */}

                      <td className="px-2 py-3.5 text-center whitespace-nowrap text-[15px] text-gray-400">
                        {movie.releaseYear ||
                          '—'}
                      </td>

                      {/* RATING */}

                      <td className="px-2 py-3.5 text-center whitespace-nowrap">

                        <span className="inline-flex items-center justify-center gap-1.5 text-[15px] text-gray-300 tabular-nums">

                          <Star
                            size={13}
                            className="text-yellow-500 fill-yellow-500"
                          />

                          {reviewStatsLoading
                            ? '—'
                            : getRating(
                                movie
                              ).toFixed(
                                1
                              )}

                        </span>

                      </td>

                      {/* REVIEWS */}

                      <td className="px-2 py-3.5 text-center whitespace-nowrap">

                        <span className="text-[15px] text-gray-400 tabular-nums">
                          {reviewStatsLoading
                            ? '—'
                            : getReviewCount(
                                movie
                              ).toLocaleString()}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-2 py-3.5 text-center">

                        <AdminActionButtons>

                          <button
                            type="button"
                            disabled={
                              operation.loading
                            }
                            onClick={() =>
                              handleOpenEdit(
                                movie
                              )
                            }
                            title="Edit movie"
                            aria-label={`Edit ${movie.title}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/40"
                          >
                            <Pencil
                              size={15}
                            />
                          </button>

                          <button
                            type="button"
                            disabled={
                              operation.loading
                            }
                            onClick={() =>
                              setRowToDelete(
                                movie
                              )
                            }
                            title="Delete movie"
                            aria-label={`Delete ${movie.title}`}
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
          DELETE SELECTED
      ================================================== */}

      <ConfirmDialog
        open={
          confirmOpen
        }
        title="Delete selected movies?"
        message={`This will permanently delete ${selectedIds.length} movie(s). This cannot be undone.`}
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
        title="Delete this movie?"
        message={
          rowToDelete
            ? `"${rowToDelete.title}" will be permanently deleted. This cannot be undone.`
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

      {/* ==================================================
          ADD / EDIT MOVIE MODAL
      ================================================== */}

      <MovieFormModal
        open={
          modalOpen
        }
        movie={
          editingMovie
        }
        genres={
          genres
        }
        saving={
          operation.loading &&
          (
            operation.type ===
              'create' ||
            operation.type ===
              'update'
          )
        }
        onClose={() => {
          if (
            !operation.loading
          ) {
            setModalOpen(
              false
            )

            setEditingMovie(
              null
            )
          }
        }}
        onSave={
          handleSaveMovie
        }
      />

    </AdminPageShell>
  )
}

export default AdminMovies