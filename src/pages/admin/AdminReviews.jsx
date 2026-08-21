import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Star,
  Search,
  MessageSquare,
  Trash2,
  Film,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Eye,
} from 'lucide-react'

import { useAdminCrud } from '../../hooks/useAdminCrud'
import useAdminSelection from '../../hooks/useAdminSelection'
import useAdminCrudFeedback from '../../hooks/useAdminCrudFeedback'

import AdminPageShell from '../../components/admin/AdminPageShell'
import AdminTable from '../../components/admin/AdminTable'
import AdminActionButtons from '../../components/admin/AdminActionButtons'
import SelectionToolbar from '../../components/admin/SelectionToolbar'
import EmptyState from '../../components/admin/EmptyState'
import LoadingState from '../../components/admin/LoadingState'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import AdminPagination from '../../components/admin/AdminPagination'
import AdminToast from '../../components/admin/AdminToast'
import AdminFilterBar from '../../components/admin/AdminFilterBar'

// ==========================================================
// STAT CARD
// ==========================================================

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

// ==========================================================
// ADMIN REVIEWS
// ==========================================================

function AdminReviews() {
  const {
    items,
    loading,
    load: loadReviews,
    deleteItem,
    deleteSelected,
  } = useAdminCrud('reviews')

  // ==========================================================
  // CRUD FEEDBACK
  // ==========================================================

  const {
    toast,
    showToast,
    closeToast,
    operation,
    startOperation,
    finishOperation,
    handleError,
  } = useAdminCrudFeedback()

  // ==========================================================
  // SELECTION
  // ==========================================================

  const {
    selectedIds,
    toggleSelect,
    clearSelection,
  } = useAdminSelection(items)

  // ==========================================================
  // FILTERS
  // ==========================================================

  const [search, setSearch] = useState('')

  const [ratingFilter, setRatingFilter] =
    useState('all')

  const [reviewLengthFilter, setReviewLengthFilter] =
    useState('all')

  const [currentPage, setCurrentPage] =
    useState(1)

  // ==========================================================
  // SORTING
  // ==========================================================

  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: 'asc',
    })

  // ==========================================================
  // VIEW / DELETE
  // ==========================================================

  const [reviewToView, setReviewToView] =
    useState(null)

  const [reviewToDelete, setReviewToDelete] =
    useState(null)

  const [selectedDeleteOpen, setSelectedDeleteOpen] =
    useState(false)

  // ==========================================================
  // REFRESH
  // ==========================================================

  const [refreshing, setRefreshing] =
    useState(false)

  const REVIEWS_PER_PAGE = 10

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalReviews = items.length

  const averageRating =
    items.length > 0
      ? (
          items.reduce(
            (sum, review) =>
              sum +
              Number(review.rating || 0),
            0
          ) / items.length
        ).toFixed(1)
      : '0.0'

  const reviewedMovies =
    new Set(
      items
        .map(
          (review) =>
            review.movie?.id
        )
        .filter(Boolean)
    ).size

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    if (
      refreshing ||
      operation.loading
    ) {
      return
    }

    setRefreshing(true)

    try {
      await loadReviews()

      showToast(
        'success',
        'Reviews refreshed successfully.'
      )
    } catch (error) {
      console.error(
        'Failed to refresh reviews:',
        error
      )

      handleError(
        error,
        'Unable to refresh reviews.'
      )
    } finally {
      setRefreshing(false)
    }
  }

  // ==========================================================
  // SORTING
  // ==========================================================

  const handleSort = (key) => {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction:
            current.direction ===
            'asc'
              ? 'desc'
              : 'asc',
        }
      }

      return {
        key,
        direction: 'asc',
      }
    })

    setCurrentPage(1)
  }

  // ==========================================================
  // SORT ICON
  // ==========================================================

  const renderSortIcon = (key) => {
    const isActive =
      sortConfig.key === key

    return (
      <span
        className="inline-flex items-center justify-center w-4 h-4 flex-shrink-0"
        aria-hidden="true"
      >
        {isActive ? (
          sortConfig.direction ===
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
    )
  }

  // ==========================================================
  // SORTABLE HEADER
  // ==========================================================

  const renderSortableHeader = (
    label,
    key,
    title
  ) => {
    const isActive =
      sortConfig.key === key

    return (
      <button
        type="button"
        onClick={() =>
          handleSort(key)
        }
        title={title}
        className={`group inline-flex items-center gap-1.5 cursor-pointer select-none transition-colors ${
          isActive
            ? 'text-gray-200'
            : 'text-gray-500 hover:text-gray-200'
        }`}
      >
        <span>
          {label}
        </span>

        {renderSortIcon(key)}
      </button>
    )
  }

  // ==========================================================
  // FILTERING
  // ==========================================================

  const filteredReviews =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase()

      return items.filter(
        (review) => {
          const userName =
            review.user?.name
              ?.toLowerCase() ||
            ''

          const movieTitle =
            review.movie?.title
              ?.toLowerCase() ||
            ''

          const reviewText =
            review.reviewText
              ?.toLowerCase() ||
            ''

          const reviewTextLength =
            review.reviewText?.trim()
              ?.length || 0

          const matchesSearch =
            !value ||
            userName.includes(
              value
            ) ||
            movieTitle.includes(
              value
            ) ||
            reviewText.includes(
              value
            )

          const matchesRating =
            ratingFilter ===
              'all' ||
            Number(
              review.rating
            ) ===
              Number(
                ratingFilter
              )

          const matchesReviewLength =
            reviewLengthFilter ===
              'all' ||
            (
              reviewLengthFilter ===
                'short' &&
              reviewTextLength <
                50
            ) ||
            (
              reviewLengthFilter ===
                'medium' &&
              reviewTextLength >=
                50 &&
              reviewTextLength <=
                200
            ) ||
            (
              reviewLengthFilter ===
                'long' &&
              reviewTextLength >
                200
            )

          return (
            matchesSearch &&
            matchesRating &&
            matchesReviewLength
          )
        }
      )
    }, [
      items,
      search,
      ratingFilter,
      reviewLengthFilter,
    ])

  // ==========================================================
  // SORT REVIEWS
  // ==========================================================

  const sortedReviews =
    useMemo(() => {
      if (!sortConfig.key) {
        return filteredReviews
      }

      return [
        ...filteredReviews,
      ].sort((a, b) => {
        let valueA = ''
        let valueB = ''

        if (
          sortConfig.key ===
          'user'
        ) {
          valueA =
            a.user?.name
              ?.trim()
              .toLowerCase() ||
            ''

          valueB =
            b.user?.name
              ?.trim()
              .toLowerCase() ||
            ''
        }

        if (
          sortConfig.key ===
          'movie'
        ) {
          valueA =
            a.movie?.title
              ?.trim()
              .toLowerCase() ||
            ''

          valueB =
            b.movie?.title
              ?.trim()
              .toLowerCase() ||
            ''
        }

        if (
          sortConfig.key ===
          'rating'
        ) {
          valueA =
            Number(
              a.rating || 0
            )

          valueB =
            Number(
              b.rating || 0
            )
        }

        if (
          sortConfig.key ===
          'review'
        ) {
          valueA =
            a.reviewText
              ?.trim()
              .toLowerCase() ||
            ''

          valueB =
            b.reviewText
              ?.trim()
              .toLowerCase() ||
            ''
        }

        if (
          valueA <
          valueB
        ) {
          return sortConfig.direction ===
            'asc'
            ? -1
            : 1
        }

        if (
          valueA >
          valueB
        ) {
          return sortConfig.direction ===
            'asc'
            ? 1
            : -1
        }

        return 0
      })
    }, [
      filteredReviews,
      sortConfig,
    ])

  // ==========================================================
  // RESET PAGE
  // ==========================================================

  useEffect(() => {
    setCurrentPage(1)
  }, [
    search,
    ratingFilter,
    reviewLengthFilter,
  ])

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        sortedReviews.length /
          REVIEWS_PER_PAGE
      )
    )

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

  const paginatedReviews =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        REVIEWS_PER_PAGE

      return sortedReviews.slice(
        start,
        start +
          REVIEWS_PER_PAGE
      )
    }, [
      sortedReviews,
      currentPage,
    ])

  const pageStart =
    sortedReviews.length ===
    0
      ? 0
      : (currentPage - 1) *
          REVIEWS_PER_PAGE +
        1

  const pageEnd =
    Math.min(
      currentPage *
        REVIEWS_PER_PAGE,
      sortedReviews.length
    )

  // ==========================================================
  // FILTER RESET
  // ==========================================================

  const clearFilters = () => {
    setSearch('')
    setRatingFilter('all')
    setReviewLengthFilter('all')
    setCurrentPage(1)
  }

  // ==========================================================
  // DELETE SINGLE REVIEW
  // ==========================================================

  const confirmDeleteReview =
    async () => {
      if (
        !reviewToDelete ||
        operation.loading
      ) {
        return
      }

      startOperation('delete')

      try {
        await deleteItem(
          reviewToDelete.id
        )

        setReviewToDelete(null)

        showToast(
          'success',
          'Review deleted successfully.'
        )
      } catch (error) {
        console.error(
          'Failed to delete review:',
          error
        )

        handleError(
          error,
          'Unable to delete this review.'
        )
      } finally {
        finishOperation()
      }
    }

  // ==========================================================
  // DELETE SELECTED REVIEWS
  // ==========================================================

  const confirmDeleteSelected =
    async () => {
      if (
        selectedIds.length ===
          0 ||
        operation.loading
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
        setSelectedDeleteOpen(false)

        showToast(
          'success',
          `${count} review${
            count !== 1
              ? 's'
              : ''
          } deleted successfully.`
        )
      } catch (error) {
        console.error(
          'Failed to delete selected reviews:',
          error
        )

        handleError(
          error,
          'Unable to delete the selected reviews.'
        )
      } finally {
        finishOperation()
      }
    }

  // ==========================================================
  // SELECT CURRENT PAGE
  // ==========================================================

  const allPageSelected =
    paginatedReviews.length >
      0 &&
    paginatedReviews.every(
      (review) =>
        selectedIds.includes(
          review.id
        )
    )

  const togglePageSelection =
    () => {
      if (
        allPageSelected
      ) {
        paginatedReviews.forEach(
          (review) => {
            if (
              selectedIds.includes(
                review.id
              )
            ) {
              toggleSelect(
                review.id
              )
            }
          }
        )
      } else {
        paginatedReviews.forEach(
          (review) => {
            if (
              !selectedIds.includes(
                review.id
              )
            ) {
              toggleSelect(
                review.id
              )
            }
          }
        )
      }
    }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <AdminPageShell
      title="Review Management"
      subtitle="Manage community reviews, ratings, and feedback submitted for movies throughout the FilmScore PH catalog."
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

          {/* STATS */}

          <div className="grid grid-cols-1 gap-3">

            <StatCard
              label="Total Reviews"
              value={
                totalReviews
              }
              icon={
                MessageSquare
              }
              iconClassName="text-violet-400"
              valueClassName="text-violet-300"
            />

            <StatCard
              label="Average Rating"
              value={
                averageRating
              }
              icon={Star}
              iconClassName="text-amber-400"
              valueClassName="text-amber-300"
            />

            <StatCard
              label="Movies Reviewed"
              value={
                reviewedMovies
              }
              icon={Film}
              iconClassName="text-blue-400"
              valueClassName="text-blue-300"
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
            searchPlaceholder="User, movie, or review..."
            resultText={`Showing ${pageStart}-${pageEnd} of ${sortedReviews.length} reviews`}
          >

            {/* RATING */}

            <select
              value={
                ratingFilter
              }
              onChange={(e) => {
                setRatingFilter(
                  e.target.value
                )

                setCurrentPage(
                  1
                )
              }}
              className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
            >
              <option value="all">
                All ratings
              </option>

              <option value="4">
                4 stars
              </option>

              <option value="3">
                3 stars
              </option>

              <option value="2">
                2 stars
              </option>

              <option value="1">
                1 star
              </option>
            </select>

            {/* REVIEW LENGTH */}

            <select
              value={
                reviewLengthFilter
              }
              onChange={(e) => {
                setReviewLengthFilter(
                  e.target.value
                )

                setCurrentPage(
                  1
                )
              }}
              className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
            >
              <option value="all">
                Any length
              </option>

              <option value="short">
                Short (&lt; 50)
              </option>

              <option value="medium">
                Medium (50–200)
              </option>

              <option value="long">
                Long (&gt; 200)
              </option>
            </select>

          </AdminFilterBar>

        </div>

        {/* ==================================================
            RIGHT COLUMN
        ================================================== */}

        <div className="min-w-0 w-full">

          {/* BULK ACTIONS */}

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
                  setSelectedDeleteOpen(
                    true
                  )
                }
              />

            </div>
          )}

          {/* CONTENT */}

          {loading ? (
            <LoadingState
              label="Loading reviews..."
            />
          ) : items.length ===
            0 ? (
            <EmptyState
              icon={
                MessageSquare
              }
              title="No reviews yet"
              message="User reviews will appear here."
            />
          ) : sortedReviews.length ===
            0 ? (
            <EmptyState
              icon={Search}
              title="No reviews found"
              message="No reviews match your current search or filters."
            />
          ) : (
            <>

              {/* TABLE */}

              <AdminTable
                widths={[
                  '5%',
                  '27%',
                  '20%',
                  '12%',
                  '24%',
                  '12%',
                ]}
                columns={[
                  <span
                    key="select"
                    className="block text-center"
                  >
                    <input
                      type="checkbox"
                      disabled={
                        operation.loading
                      }
                      checked={
                        allPageSelected
                      }
                      onChange={
                        togglePageSelection
                      }
                      className="appearance-none w-4 h-4 rounded-[4px] border border-gray-700 bg-gray-900 cursor-pointer transition-all checked:bg-red-600 checked:border-red-500 hover:border-gray-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                  </span>,

                  <div
                    key="user"
                    className="flex justify-start"
                  >
                    {renderSortableHeader(
                      'User',
                      'user',
                      'Sort by User'
                    )}
                  </div>,

                  <div
                    key="movie"
                    className="flex justify-start"
                  >
                    {renderSortableHeader(
                      'Movie',
                      'movie',
                      'Sort by Movie'
                    )}
                  </div>,

                  <div
                    key="rating"
                    className="flex justify-center w-full"
                  >
                    {renderSortableHeader(
                      'Rating',
                      'rating',
                      'Sort by Rating'
                    )}
                  </div>,

                  <div
                    key="review"
                    className="flex justify-start"
                  >
                    {renderSortableHeader(
                      'Review',
                      'review',
                      'Sort by Review'
                    )}
                  </div>,

                  <span
                    key="actions"
                    className="block text-center"
                  >
                    Actions
                  </span>,
                ]}
              >

                {paginatedReviews.map(
                  (review) => (
                    <tr
                      key={
                        review.id
                      }
                      className="hover:bg-gray-900/40 transition-colors duration-150"
                    >

                      {/* SELECT */}

                      <td className="px-3 py-3.5 text-center align-middle">

                        <input
                          type="checkbox"
                          disabled={
                            operation.loading
                          }
                          checked={selectedIds.includes(
                            review.id
                          )}
                          onChange={() =>
                            toggleSelect(
                              review.id
                            )
                          }
                          className="appearance-none w-4 h-4 rounded-[4px] border border-gray-700 bg-gray-900 cursor-pointer transition-all checked:bg-red-600 checked:border-red-500 hover:border-gray-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                        />

                      </td>

                      {/* USER */}

                      <td className="px-4 py-3.5 align-middle text-left">

                        <div className="flex items-center gap-3 min-w-0">

                          {review.user?.avatarUrl ? (
                            <img
                              src={
                                review.user.avatarUrl
                              }
                              alt=""
                              className="w-9 h-9 rounded-full object-cover border border-gray-800 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-400 font-medium flex-shrink-0">
                              {review.user?.name
                                ?.charAt(0)
                                .toUpperCase() ||
                                '?'}
                            </div>
                          )}

                          <div className="min-w-0">

                            <p className="text-sm text-white font-medium truncate">
                              {
                                review.user
                                  ?.name
                              }
                            </p>

                            <p className="text-[11px] text-gray-600 truncate mt-0.5">
                              {
                                review.user
                                  ?.email
                              }
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* MOVIE */}

                      <td className="px-4 py-3.5 align-middle text-left">

                        <div className="flex items-center gap-2 min-w-0">

                          <Film
                            size={14}
                            className="text-gray-600 flex-shrink-0"
                          />

                          <span
                            className="text-sm text-gray-400 truncate"
                            title={
                              review.movie?.title ||
                              ''
                            }
                          >
                            {
                              review.movie?.title
                            }
                          </span>

                        </div>

                      </td>

                      {/* RATING */}

                      <td className="px-3 py-3.5 align-middle text-center">

                        <span className="inline-flex items-center justify-center gap-1.5 text-sm text-gray-400 font-medium tabular-nums">

                          <Star
                            size={13}
                            className="text-yellow-400 fill-yellow-400 flex-shrink-0"
                          />

                          {
                            review.rating
                          }

                        </span>

                      </td>

                      {/* REVIEW */}

                      <td className="px-4 py-3.5 align-middle text-left">

                        <p
                          className="text-sm text-gray-400 truncate max-w-[420px]"
                          title={
                            review.reviewText ||
                            ''
                          }
                        >
                          {
                            review.reviewText ||
                            '—'
                          }
                        </p>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-3 py-3.5 align-middle">

                        <AdminActionButtons>

                          {/* VIEW */}

                          <button
                            type="button"
                            disabled={
                              operation.loading
                            }
                            onClick={() =>
                              setReviewToView(
                                review
                              )
                            }
                            title="View review"
                            aria-label="View review"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-500/40"
                          >
                            <Eye
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
                              setReviewToDelete(
                                review
                              )
                            }
                            title="Delete review"
                            aria-label="Delete review"
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
          VIEW REVIEW MODAL
      ================================================== */}

      {reviewToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <button
            type="button"
            aria-label="Close review"
            onClick={() =>
              setReviewToView(
                null
              )
            }
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-gray-950 border border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}

            <div className="px-5 py-4 border-b border-gray-800/80 flex items-center justify-between">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Review Details
                </h2>

                <p className="text-[11px] text-gray-600 mt-0.5">
                  Full review submitted by the user
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setReviewToView(
                    null
                  )
                }
                className="text-gray-600 hover:text-white transition-colors"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* CONTENT */}

            <div className="p-5 space-y-5">

              {/* USER */}

              <div className="flex items-center gap-3">

                {reviewToView.user?.avatarUrl ? (
                  <img
                    src={
                      reviewToView.user.avatarUrl
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-gray-800"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-sm text-gray-400 font-medium">
                    {reviewToView.user?.name
                      ?.charAt(0)
                      .toUpperCase() ||
                      '?'}
                  </div>
                )}

                <div className="min-w-0">

                  <p className="text-sm text-white font-medium truncate">
                    {
                      reviewToView.user
                        ?.name
                    }
                  </p>

                  <p className="text-[11px] text-gray-600 truncate">
                    {
                      reviewToView.user
                        ?.email
                    }
                  </p>

                </div>

              </div>

              {/* MOVIE / RATING */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div className="flex items-center gap-2 min-w-0">

                  <Film
                    size={15}
                    className="text-gray-600 flex-shrink-0"
                  />

                  <span className="text-sm text-gray-300 truncate">
                    {
                      reviewToView.movie?.title ||
                      '—'
                    }
                  </span>

                </div>

                <span className="inline-flex items-center gap-1.5 text-sm text-gray-300 font-medium tabular-nums">

                  <Star
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />

                  {
                    reviewToView.rating
                  }

                </span>

              </div>

              {/* REVIEW */}

              <div>

                <p className="text-[11px] text-gray-600 mb-2 uppercase tracking-wider">
                  Review
                </p>

                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-4 max-h-[320px] overflow-y-auto">

                  <p className="text-sm text-gray-300 leading-6 whitespace-pre-wrap break-words">
                    {
                      reviewToView.reviewText ||
                      'No review text.'
                    }
                  </p>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end px-5 py-4 border-t border-gray-800/80">

              <button
                type="button"
                onClick={() =>
                  setReviewToView(
                    null
                  )
                }
                className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xs font-semibold transition-colors"
              >
                Close
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ==================================================
          DELETE SINGLE REVIEW
      ================================================== */}

      <ConfirmDialog
        open={
          !!reviewToDelete
        }
        title="Delete review?"
        message={
          reviewToDelete
            ? `This will permanently delete the review submitted by ${reviewToDelete.user?.name}. This cannot be undone.`
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
            setReviewToDelete(
              null
            )
          }
        }}
        onConfirm={
          confirmDeleteReview
        }
      />

      {/* ==================================================
          DELETE SELECTED REVIEWS
      ================================================== */}

      <ConfirmDialog
        open={
          selectedDeleteOpen
        }
        title="Delete selected reviews?"
        message={`This will permanently delete ${selectedIds.length} selected review${
          selectedIds.length !==
          1
            ? 's'
            : ''
        }. This cannot be undone.`}
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
            setSelectedDeleteOpen(
              false
            )
          }
        }}
        onConfirm={
          confirmDeleteSelected
        }
      />

    </AdminPageShell>
  )
}

export default AdminReviews