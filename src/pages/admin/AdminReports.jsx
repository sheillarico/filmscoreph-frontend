import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  CalendarDays,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import {
  getReports,
  resolveReport,
} from '../../services/api'

import useAdminCrudFeedback from '../../hooks/useAdminCrudFeedback'

import AdminPageShell from '../../components/admin/AdminPageShell'
import AdminActionButtons from '../../components/admin/AdminActionButtons'
import EmptyState from '../../components/admin/EmptyState'
import LoadingState from '../../components/admin/LoadingState'
import StatusBadge from '../../components/admin/StatusBadge'
import AdminToast from '../../components/admin/AdminToast'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

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
    <div className="bg-gray-950/60 border border-gray-800/70 rounded-xl px-4 py-3.5 flex items-start justify-between transition-all duration-200 hover:border-gray-700/80 hover:shadow-md hover:shadow-black/20">
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
// DATE HELPERS
// =========================================================

function getDateValue(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function formatDate(value) {
  const date = getDateValue(value)

  if (!date) {
    return 'Unknown date'
  }

  return date.toLocaleString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }
  )
}

function getInitial(name) {
  return (
    name
      ?.trim()
      ?.charAt(0)
      ?.toUpperCase() || '?'
  )
}

// =========================================================
// TIME FILTER
// =========================================================

function matchesTimeRange(
  value,
  filter
) {
  if (
    !filter ||
    filter === 'all'
  ) {
    return true
  }

  const date = getDateValue(value)

  if (!date) {
    return false
  }

  const now = new Date()
  const days = Number(filter)

  const cutoff = new Date(
    now.getTime() -
      days *
        24 *
        60 *
        60 *
        1000
  )

  return date >= cutoff
}

// =========================================================
// REPORT CARD
// =========================================================

function ReportCard({
  report,
  operation,
  onOpen,
  onResolve,
}) {
  const userName =
    report.user?.name ||
    'Unknown user'

  const userEmail =
    report.user?.email ||
    'No email available'

  const isOpen =
    report.status === 'OPEN'

  const isResolving =
    operation.loading &&
    operation.type === 'resolve'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() =>
        onOpen(report)
      }
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault()
          onOpen(report)
        }
      }}
      className="
        group
        h-full
        min-h-[300px]
        bg-gray-950/70
        backdrop-blur-sm
        border
        border-gray-800/80
        rounded-xl
        overflow-hidden
        cursor-pointer
        transition-all
        duration-200
        ease-out
        hover:bg-gray-950/90
        hover:border-red-500/30
        hover:shadow-[0_0_0_1px_rgba(239,68,68,0.05),0_12px_30px_rgba(0,0,0,0.22)]
        focus:outline-none
        focus-visible:ring-1
        focus-visible:ring-red-500/40
      "
    >
      <div className="h-full flex flex-col">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="px-4 py-4">

          <div className="flex items-start justify-between gap-3">

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {report.user?.avatarUrl ? (
                  <img
                    src={
                      report.user.avatarUrl
                    }
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500 font-medium">
                    {getInitial(
                      userName
                    )}
                  </span>
                )}
              </div>

              <div className="min-w-0">

                <p className="text-sm text-white font-semibold truncate">
                  {userName}
                </p>

                <p className="text-[11px] text-gray-600 truncate mt-0.5">
                  {userEmail}
                </p>

              </div>

            </div>

            {/* STATUS */}

            <div className="flex-shrink-0">
              <StatusBadge
                label={
                  report.status
                }
              />
            </div>

          </div>

        </div>

        {/* ==================================================
            REPORT PREVIEW
        ================================================== */}

        <div className="px-4 pb-4 flex-1">

          <div className="h-full min-h-[195px] bg-gray-900/50 border border-gray-800/70 rounded-lg p-3.5 flex flex-col transition-colors duration-200 group-hover:border-gray-800">

            <div className="flex items-center justify-between gap-3 mb-3">

              <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                Report #{report.id}
              </span>

              <span className="text-[10px] text-gray-700 whitespace-nowrap">
                {formatDate(
                  report.createdAt
                )}
              </span>

            </div>

            <p className="text-sm text-gray-300 leading-6 break-words whitespace-pre-wrap line-clamp-6 flex-1">
              {report.message ||
                'No message provided.'}
            </p>

            <p className="text-[10px] text-gray-700 mt-3 transition-colors duration-200 group-hover:text-gray-500">
              Click to view full report
            </p>

          </div>

        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="px-4 py-3 border-t border-gray-800/70 flex items-center justify-end"
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          {isOpen && (
            <AdminActionButtons>
              <button
                type="button"
                disabled={
                  isResolving ||
                  operation.loading
                }
                onClick={() =>
                  onResolve(report)
                }
                title="Mark as resolved"
                aria-label={`Resolve report ${report.id}`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/40"
              >
                {isResolving ? (
                  <RefreshCw
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCircle2
                    size={15}
                  />
                )}
              </button>
            </AdminActionButtons>
          )}

        </div>

      </div>
    </div>
  )
}

// =========================================================
// PLACEHOLDER CARD
// =========================================================

function ReportPlaceholder() {
  return (
    <div className="h-full min-h-[300px] border border-dashed border-gray-800/70 rounded-xl bg-gray-950/30 flex flex-col items-center justify-center text-center px-5">
      <div className="w-10 h-10 rounded-full bg-gray-900/70 border border-gray-800 flex items-center justify-center mb-3">
        <Clock3
          size={16}
          className="text-gray-700"
        />
      </div>

      <p className="text-xs text-gray-600 font-medium">
        Report incoming
      </p>

      <p className="text-[10px] text-gray-700 mt-1">
        Waiting for the next submission
      </p>
    </div>
  )
}

// =========================================================
// REPORT DETAILS DRAWER
// =========================================================

function ReportDetailsDrawer({
  report,
  operation,
  onClose,
  onResolve,
}) {
  const isOpen =
    Boolean(report)

  const userName =
    report?.user?.name ||
    'Unknown user'

  const userEmail =
    report?.user?.email ||
    'No email available'

  const isReportOpen =
    report?.status === 'OPEN'

  const isResolving =
    operation.loading &&
    operation.type === 'resolve'

  return (
    <>
      {/* BACKDROP */}

      <div
        className={`fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* DRAWER */}

      <aside
        className={`fixed top-0 right-0 z-[60] h-screen w-full sm:w-[480px] bg-gray-950 border-l border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >

        {report && (
          <>
            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between gap-4 flex-shrink-0">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Report Details
                </h2>

                <p className="text-[11px] text-gray-600 mt-0.5">
                  Report #{report.id}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close report details"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-white hover:bg-gray-900 transition-colors"
              >
                <X size={16} />
              </button>

            </div>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <div className="flex-1 overflow-y-auto">

              <div className="p-5 space-y-5">

                {/* USER */}

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">

                    {report.user?.avatarUrl ? (
                      <img
                        src={
                          report.user.avatarUrl
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-500 font-medium">
                        {getInitial(
                          userName
                        )}
                      </span>
                    )}

                  </div>

                  <div className="min-w-0">

                    <p className="text-sm text-white font-semibold truncate">
                      {userName}
                    </p>

                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {userEmail}
                    </p>

                  </div>

                </div>

                {/* STATUS */}

                <div className="rounded-xl border border-gray-800/80 bg-gray-950/70 overflow-hidden">

                  <div className="px-4 py-3.5 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <CheckCircle2
                        size={14}
                        className="text-gray-700"
                      />

                      <span className="text-xs text-gray-500">
                        Status
                      </span>

                    </div>

                    <StatusBadge
                      label={
                        report.status
                      }
                    />

                  </div>

                  <div className="border-t border-gray-800/70 px-4 py-3.5 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={14}
                        className="text-gray-700"
                      />

                      <span className="text-xs text-gray-500">
                        Submitted
                      </span>

                    </div>

                    <span className="text-xs text-gray-400 text-right">
                      {formatDate(
                        report.createdAt
                      )}
                    </span>

                  </div>

                  <div className="border-t border-gray-800/70 px-4 py-3.5 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <User
                        size={14}
                        className="text-gray-700"
                      />

                      <span className="text-xs text-gray-500">
                        Report ID
                      </span>

                    </div>

                    <span className="text-xs text-gray-500 font-mono">
                      #{report.id}
                    </span>

                  </div>

                </div>

                {/* FULL REPORT */}

                <div>

                  <div className="flex items-center justify-between gap-3 mb-2">

                    <p className="text-[11px] text-gray-600 uppercase tracking-wider">
                      Full Report
                    </p>

                    <span className="text-[10px] text-gray-700">
                      {(report.message || '').length}{' '}
                      characters
                    </span>

                  </div>

                  <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">

                    <p className="text-sm text-gray-300 leading-6 whitespace-pre-wrap break-words">
                      {report.message ||
                        'No message provided.'}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-end flex-shrink-0">

              {isReportOpen && (
                <AdminActionButtons>
                  <button
                    type="button"
                    disabled={
                      isResolving ||
                      operation.loading
                    }
                    onClick={() =>
                      onResolve(report)
                    }
                    title="Mark as resolved"
                    aria-label="Mark report as resolved"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isResolving ? (
                      <RefreshCw
                        size={15}
                        className="animate-spin"
                      />
                    ) : (
                      <CheckCircle2
                        size={15}
                      />
                    )}
                  </button>
                </AdminActionButtons>
              )}

            </div>
          </>
        )}

      </aside>
    </>
  )
}

// =========================================================
// ADMIN REPORTS
// =========================================================

function AdminReports() {
  const { token } =
    useAuth()

  // =========================================================
  // FEEDBACK
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
  // REPORTS
  // =========================================================

  const [reports, setReports] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  // =========================================================
  // FILTERS
  // =========================================================

  const [filter, setFilter] =
    useState('ALL')

  const [search, setSearch] =
    useState('')

  const [timeFilter, setTimeFilter] =
    useState('all')

  // =========================================================
  // CAROUSEL
  // =========================================================

  const [reportPage, setReportPage] =
    useState(0)

  const REPORTS_PER_VIEW = 5

  // =========================================================
  // DETAILS
  // =========================================================

  const [selectedReport, setSelectedReport] =
    useState(null)

  // =========================================================
  // RESOLVE
  // =========================================================

  const [reportToResolve, setReportToResolve] =
    useState(null)

  // =========================================================
  // LOAD REPORTS
  // =========================================================

  const loadReports = async (
    showRefresh = false
  ) => {
    if (!token) {
      return
    }

    if (showRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const data =
        await getReports(
          token
        )

      setReports(
        Array.isArray(data)
          ? data
          : data?.content ?? []
      )
    } catch (error) {
      console.error(
        'Failed to load reports:',
        error
      )

      handleError(
        error,
        'Unable to load problem reports.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadReports()
    }
  }, [token])

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalReports =
    reports.length

  const openReports =
    reports.filter(
      (report) =>
        report.status ===
        'OPEN'
    ).length

  const resolvedReports =
    reports.filter(
      (report) =>
        report.status ===
        'RESOLVED'
    ).length

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredReports =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase()

      return reports.filter(
        (report) => {
          const matchesStatus =
            filter === 'ALL' ||
            report.status ===
              filter

          if (!matchesStatus) {
            return false
          }

          const matchesTime =
            matchesTimeRange(
              report.createdAt,
              timeFilter
            )

          if (!matchesTime) {
            return false
          }

          if (!searchValue) {
            return true
          }

          const name =
            report.user?.name
              ?.toLowerCase() ||
            ''

          const email =
            report.user?.email
              ?.toLowerCase() ||
            ''

          const message =
            report.message
              ?.toLowerCase() ||
            ''

          const id =
            String(
              report.id ?? ''
            )

          return (
            name.includes(
              searchValue
            ) ||
            email.includes(
              searchValue
            ) ||
            message.includes(
              searchValue
            ) ||
            id.includes(
              searchValue
            )
          )
        }
      )
    }, [
      reports,
      filter,
      timeFilter,
      search,
    ])

  // =========================================================
  // CAROUSEL
  // =========================================================

  const reportPages =
    Math.max(
      1,
      Math.ceil(
        filteredReports.length /
          REPORTS_PER_VIEW
      )
    )

  useEffect(() => {
    if (
      reportPage >=
      reportPages
    ) {
      setReportPage(
        Math.max(
          0,
          reportPages - 1
        )
      )
    }
  }, [
    reportPage,
    reportPages,
  ])

  const visibleReports =
    useMemo(() => {
      const start =
        reportPage *
        REPORTS_PER_VIEW

      return filteredReports.slice(
        start,
        start +
          REPORTS_PER_VIEW
      )
    }, [
      filteredReports,
      reportPage,
    ])

  const placeholderCount =
    Math.max(
      0,
      REPORTS_PER_VIEW -
        visibleReports.length
    )

  // =========================================================
  // RESET CAROUSEL
  // =========================================================

  useEffect(() => {
    setReportPage(0)
    setSelectedReport(null)
  }, [
    search,
    filter,
    timeFilter,
  ])

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
      const data =
        await getReports(
          token
        )

      const nextReports =
        Array.isArray(data)
          ? data
          : data?.content ?? []

      setReports(
        nextReports
      )

      setReportPage(0)
      setSelectedReport(null)

      showToast(
        'success',
        'Reports refreshed successfully.'
      )
    } catch (error) {
      console.error(
        'Failed to refresh reports:',
        error
      )

      handleError(
        error,
        'Unable to refresh reports.'
      )
    } finally {
      setRefreshing(false)
    }
  }

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch('')
    setFilter('ALL')
    setTimeFilter('all')
    setReportPage(0)
    setSelectedReport(null)
  }

  const hasFilters =
    search.trim() !== '' ||
    filter !== 'ALL' ||
    timeFilter !== 'all'

  // =========================================================
  // RESOLVE
  // =========================================================

  const confirmResolve =
    async () => {
      if (
        !reportToResolve ||
        operation.loading
      ) {
        return
      }

      startOperation(
        'resolve'
      )

      try {
        const reportId =
          reportToResolve.id

        await resolveReport(
          token,
          reportId
        )

        const data =
          await getReports(
            token
          )

        const nextReports =
          Array.isArray(data)
            ? data
            : data?.content ?? []

        setReports(
          nextReports
        )

        setReportToResolve(
          null
        )

        setSelectedReport(
          null
        )

        showToast(
          'success',
          `Report #${reportId} was marked as resolved.`
        )
      } catch (error) {
        console.error(
          'Failed to resolve report:',
          error
        )

        handleError(
          error,
          'Unable to resolve this report.'
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
      title="Problem Reports"
      subtitle="Review and manage issues submitted by the FilmScore PH community."
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
      {/* ==================================================
          CHROME AUTOFILL FIX
      ================================================== */}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .admin-reports-search:-webkit-autofill,
            .admin-reports-search:-webkit-autofill:hover,
            .admin-reports-search:-webkit-autofill:focus,
            .admin-reports-search:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 1000px rgb(17 24 39 / 1) inset !important;
              -webkit-text-fill-color: rgb(209 213 219) !important;
              caret-color: rgb(209 213 219) !important;
              transition: background-color 9999s ease-in-out 0s;
            }
          `,
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

      <div className="space-y-5">

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <StatCard
            label="Total Reports"
            value={
              totalReports
            }
            icon={
              AlertTriangle
            }
            iconClassName="text-blue-400"
            valueClassName="text-blue-300"
          />

          <StatCard
            label="Open Reports"
            value={
              openReports
            }
            icon={
              Clock3
            }
            iconClassName="text-amber-400"
            valueClassName="text-amber-300"
          />

          <StatCard
            label="Resolved Reports"
            value={
              resolvedReports
            }
            icon={
              CheckCircle2
            }
            iconClassName="text-emerald-400"
            valueClassName="text-emerald-300"
          />

        </div>

        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl p-3">

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_185px_205px] gap-3">

            {/* SEARCH */}

            <div className="relative min-w-0">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
              />

              <input
                type="search"
                value={
                  search
                }
                autoComplete="off"
                onChange={(e) => {
                  setSearch(
                    e.target.value
                  )

                  setReportPage(
                    0
                  )
                }}
                placeholder="Search user, email, report ID, or message..."
                className="admin-reports-search w-full h-[42px] appearance-none bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
              />

            </div>

            {/* STATUS */}

            <select
              value={
                filter
              }
              onChange={(e) => {
                setFilter(
                  e.target.value
                )

                setReportPage(
                  0
                )
              }}
              className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
            >
              <option value="ALL">
                All reports ({totalReports})
              </option>

              <option value="OPEN">
                Open reports ({openReports})
              </option>

              <option value="RESOLVED">
                Resolved reports ({resolvedReports})
              </option>
            </select>

            {/* TIME */}

            <select
              value={
                timeFilter
              }
              onChange={(e) => {
                setTimeFilter(
                  e.target.value
                )

                setReportPage(
                  0
                )
              }}
              className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
            >
              <option value="all">
                Submitted: Any time
              </option>

              <option value="3">
                Submitted: Last 3 days
              </option>

              <option value="7">
                Submitted: Last 7 days
              </option>

              <option value="30">
                Submitted: Last 30 days
              </option>

              <option value="90">
                Submitted: Last 3 months
              </option>
            </select>

          </div>

          <div className="flex items-center justify-between gap-3 mt-3 px-1">

            <p className="text-[11px] text-gray-600">
              Showing{' '}
              <span className="text-gray-400">
                {
                  filteredReports.length
                }
              </span>{' '}
              of{' '}
              <span className="text-gray-400">
                {
                  totalReports
                }
              </span>{' '}
              reports
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-[11px] text-gray-600 hover:text-white transition-colors"
              >
                Clear filters
              </button>
            )}

          </div>

        </div>

        {/* ==================================================
            REPORTS
        ================================================== */}

        {loading ? (
          <LoadingState
            label="Loading reports..."
          />
        ) : filteredReports.length ===
          0 ? (
          <EmptyState
            icon={
              hasFilters
                ? Search
                : AlertTriangle
            }
            title={
              hasFilters
                ? 'No matching reports'
                : 'No reports found'
            }
            message={
              hasFilters
                ? 'Try changing your search or filter.'
                : 'User problem reports will appear here.'
            }
          />
        ) : (
          <>

            <div className="relative">

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={() => {
                  setReportPage(
                    (current) =>
                      Math.max(
                        0,
                        current - 1
                      )
                  )

                  setSelectedReport(
                    null
                  )
                }}
                disabled={
                  reportPage ===
                    0 ||
                  operation.loading
                }
                aria-label="Previous reports"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-9 h-9 rounded-full bg-gray-950 border border-gray-800 text-gray-500 hover:text-white hover:bg-gray-900 hover:border-gray-700 shadow-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed hidden sm:flex items-center justify-center"
              >
                <ChevronLeft
                  size={17}
                />
              </button>

              {/* GRID */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

                {visibleReports.map(
                  (report) => (
                    <ReportCard
                      key={
                        report.id
                      }
                      report={
                        report
                      }
                      operation={
                        operation
                      }
                      onOpen={
                        setSelectedReport
                      }
                      onResolve={
                        setReportToResolve
                      }
                    />
                  )
                )}

                {Array.from(
                  {
                    length:
                      placeholderCount,
                  }
                ).map(
                  (_, index) => (
                    <ReportPlaceholder
                      key={`placeholder-${index}`}
                    />
                  )
                )}

              </div>

              {/* NEXT */}

              <button
                type="button"
                onClick={() => {
                  setReportPage(
                    (current) =>
                      Math.min(
                        reportPages -
                          1,
                        current + 1
                      )
                  )

                  setSelectedReport(
                    null
                  )
                }}
                disabled={
                  reportPage >=
                    reportPages -
                      1 ||
                  operation.loading
                }
                aria-label="Next reports"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-9 h-9 rounded-full bg-gray-950 border border-gray-800 text-gray-500 hover:text-white hover:bg-gray-900 hover:border-gray-700 shadow-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed hidden sm:flex items-center justify-center"
              >
                <ChevronRight
                  size={17}
                />
              </button>

            </div>

            {/* MOBILE NAVIGATION */}

            <div className="flex sm:hidden items-center justify-between mt-3">

              <button
                type="button"
                onClick={() => {
                  setReportPage(
                    (current) =>
                      Math.max(
                        0,
                        current - 1
                      )
                  )

                  setSelectedReport(
                    null
                  )
                }}
                disabled={
                  reportPage ===
                  0
                }
                aria-label="Previous reports"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-800 bg-gray-950 text-gray-500 hover:text-white hover:bg-gray-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronLeft
                  size={16}
                />
              </button>

              <span className="text-[11px] text-gray-600">
                {reportPage + 1} /{' '}
                {reportPages}
              </span>

              <button
                type="button"
                onClick={() => {
                  setReportPage(
                    (current) =>
                      Math.min(
                        reportPages -
                          1,
                        current + 1
                      )
                  )

                  setSelectedReport(
                    null
                  )
                }}
                disabled={
                  reportPage >=
                  reportPages -
                    1
                }
                aria-label="Next reports"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-800 bg-gray-950 text-gray-500 hover:text-white hover:bg-gray-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <ChevronRight
                  size={16}
                />
              </button>

            </div>

            {/* PAGINATION DOTS */}

            {reportPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-4">

                {Array.from(
                  {
                    length:
                      reportPages,
                  }
                ).map(
                  (_, index) => (
                    <button
                      key={
                        index
                      }
                      type="button"
                      onClick={() => {
                        setReportPage(
                          index
                        )

                        setSelectedReport(
                          null
                        )
                      }}
                      aria-label={`Go to report group ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        reportPage ===
                        index
                          ? 'bg-red-500 w-4'
                          : 'bg-gray-800 hover:bg-gray-700 w-1.5'
                      }`}
                    />
                  )
                )}

              </div>
            )}

          </>
        )}

      </div>

      {/* ==================================================
          DETAILS DRAWER
      ================================================== */}

      <ReportDetailsDrawer
        report={
          selectedReport
        }
        operation={
          operation
        }
        onClose={() =>
          setSelectedReport(
            null
          )
        }
        onResolve={
          setReportToResolve
        }
      />

      {/* ==================================================
          RESOLVE CONFIRMATION
      ================================================== */}

      <ConfirmDialog
        open={
          !!reportToResolve
        }
        title="Mark report as resolved?"
        message={
          reportToResolve
            ? `Report #${reportToResolve.id} will be marked as resolved.`
            : ''
        }
        confirmLabel={
          operation.type ===
          'resolve'
            ? 'Resolving...'
            : 'Mark Resolved'
        }
        onCancel={() => {
          if (
            !operation.loading
          ) {
            setReportToResolve(
              null
            )
          }
        }}
        onConfirm={
          confirmResolve
        }
      />

    </AdminPageShell>
  )
}

export default AdminReports