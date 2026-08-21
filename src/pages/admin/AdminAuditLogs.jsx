import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FileClock,
  Search,
  RefreshCw,
  Shield,
  User,
  Film,
  MessageSquare,
  AlertTriangle,
  Tags,
  Trash2,
  X,
  CalendarDays,
  Hash,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import AdminPageShell from '../../components/admin/AdminPageShell'
import AdminTable from '../../components/admin/AdminTable'
import EmptyState from '../../components/admin/EmptyState'
import LoadingState from '../../components/admin/LoadingState'
import AdminPagination from '../../components/admin/AdminPagination'
import AdminToast from '../../components/admin/AdminToast'
import AdminFilterBar from '../../components/admin/AdminFilterBar'
import StatusBadge from '../../components/admin/StatusBadge'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

import useAdminCrudFeedback from '../../hooks/useAdminCrudFeedback'

const API_BASE = "https://filmscoreph-backend-production.up.railway.app/api";

const LOGS_PER_PAGE = 10

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
// DATE
// =========================================================

function formatDate(value) {
  if (!value) {
    return 'Unknown date'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
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

// =========================================================
// ACTION LABEL
// =========================================================

function getActionLabel(action) {
  if (!action) {
    return 'Unknown Action'
  }

  return action
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    )
}

// =========================================================
// ACTION ICON
// =========================================================

function getActionIcon(action) {
  const normalized =
    String(
      action ?? ''
    ).toUpperCase()

  if (
    normalized.includes(
      'MOVIE'
    )
  ) {
    return Film
  }

  if (
    normalized.includes(
      'REVIEW'
    )
  ) {
    return MessageSquare
  }

  if (
    normalized.includes(
      'USER'
    )
  ) {
    return User
  }

  if (
    normalized.includes(
      'GENRE'
    )
  ) {
    return Tags
  }

  if (
    normalized.includes(
      'REPORT'
    )
  ) {
    return AlertTriangle
  }

  return Shield
}

// =========================================================
// ACTION STYLE
// =========================================================

function getActionStyle(action) {
  const normalized =
    String(
      action ?? ''
    ).toUpperCase()

  if (
    normalized.includes(
      'DELETE'
    )
  ) {
    return {
      wrapper:
        'text-red-400 bg-red-500/10 border-red-500/20',
      text:
        'text-red-300',
    }
  }

  if (
    normalized.includes(
      'PROMOTE'
    )
  ) {
    return {
      wrapper:
        'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      text:
        'text-emerald-300',
    }
  }

  if (
    normalized.includes(
      'DEMOTE'
    )
  ) {
    return {
      wrapper:
        'text-amber-400 bg-amber-500/10 border-amber-500/20',
      text:
        'text-amber-300',
    }
  }

  if (
    normalized.includes(
      'CREATE'
    )
  ) {
    return {
      wrapper:
        'text-blue-400 bg-blue-500/10 border-blue-500/20',
      text:
        'text-blue-300',
    }
  }

  if (
    normalized.includes(
      'UPDATE'
    )
  ) {
    return {
      wrapper:
        'text-violet-400 bg-violet-500/10 border-violet-500/20',
      text:
        'text-violet-300',
    }
  }

  if (
    normalized.includes(
      'BLOCK'
    ) &&
    !normalized.includes(
      'UNBLOCK'
    )
  ) {
    return {
      wrapper:
        'text-orange-400 bg-orange-500/10 border-orange-500/20',
      text:
        'text-orange-300',
    }
  }

  if (
    normalized.includes(
      'UNBLOCK'
    )
  ) {
    return {
      wrapper:
        'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      text:
        'text-emerald-300',
    }
  }

  if (
    normalized.includes(
      'RESOLVE'
    )
  ) {
    return {
      wrapper:
        'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      text:
        'text-emerald-300',
    }
  }

  return {
    wrapper:
      'text-gray-400 bg-gray-800/50 border-gray-700/70',
    text:
      'text-gray-400',
  }
}

// =========================================================
// AUDIT LOG DETAILS DRAWER
// =========================================================

function AuditLogDetailsDrawer({
  log,
  onClose,
}) {
  const isOpen =
    Boolean(log)

  const ActionIcon =
    getActionIcon(
      log?.action
    )

  const actionStyle =
    getActionStyle(
      log?.action
    )

  return (
    <>
      {/* =====================================================
          BACKDROP
      ===================================================== */}

      <div
        className={`fixed inset-0 z-50 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* =====================================================
          DRAWER
      ===================================================== */}

      <aside
        className={`fixed top-0 right-0 z-[60] h-screen w-full sm:w-[480px] bg-gray-950 border-l border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        {log && (
          <>
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between gap-4 flex-shrink-0">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Audit Log Details
                </h2>

                <p className="text-[11px] text-gray-600 mt-0.5">
                  Log #{log.id}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close audit log details"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-white hover:bg-gray-900 transition-colors"
              >
                <X size={16} />
              </button>

            </div>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="flex-1 overflow-y-auto">

              <div className="p-5 space-y-5">

                {/* =================================================
                    ADMIN
                ================================================= */}

                <div className="flex items-center gap-3">

                  {log.adminAvatarUrl ? (
                    <img
                      src={
                        log.adminAvatarUrl
                      }
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-gray-800 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center flex-shrink-0">
                      <User
                        size={16}
                        className="text-gray-600"
                      />
                    </div>
                  )}

                  <div className="min-w-0">

                    <p className="text-sm text-white font-semibold truncate">
                      {log.adminName ||
                        'Unknown admin'}
                    </p>

                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {log.adminEmail ||
                        'No email'}
                    </p>

                  </div>

                </div>

                {/* =================================================
                    ACTION INFORMATION
                ================================================= */}

                <div className="rounded-xl border border-gray-800/80 bg-gray-950/70 overflow-hidden">

                  {/* ACTION */}

                  <div className="px-4 py-3.5 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-2">

                      <Shield
                        size={14}
                        className="text-gray-700"
                      />

                      <span className="text-xs text-gray-500">
                        Action
                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center ${actionStyle.wrapper}`}
                      >
                        <ActionIcon
                          size={14}
                        />
                      </div>

                      <span
                        className={`text-xs font-medium ${actionStyle.text}`}
                      >
                        {getActionLabel(
                          log.action
                        )}
                      </span>

                    </div>

                  </div>

                  {/* TARGET */}

                  <div className="border-t border-gray-800/70 px-4 py-3.5 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-2">

                      <Hash
                        size={14}
                        className="text-gray-700"
                      />

                      <span className="text-xs text-gray-500">
                        Target
                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <StatusBadge
                        label={
                          log.targetType ||
                          'Unknown'
                        }
                      />

                      {log.targetId !=
                        null && (
                        <span className="text-[11px] text-gray-600 font-mono">
                          #
                          {
                            log.targetId
                          }
                        </span>
                      )}

                    </div>

                  </div>

                  {/* DATE */}

                  <div className="border-t border-gray-800/70 px-4 py-3.5 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-2">

                      <CalendarDays
                        size={14}
                        className="text-gray-700"
                      />

                      <span className="text-xs text-gray-500">
                        Date
                      </span>

                    </div>

                    <span className="text-xs text-gray-400 text-right">
                      {formatDate(
                        log.createdAt
                      )}
                    </span>

                  </div>

                  {/* LOG ID */}

                  <div className="border-t border-gray-800/70 px-4 py-3.5 flex items-center justify-between">

                    <span className="text-xs text-gray-500">
                      Log ID
                    </span>

                    <span className="text-xs text-gray-500 font-mono">
                      #{log.id}
                    </span>

                  </div>

                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div>

                  <div className="flex items-center justify-between gap-3 mb-2">

                    <p className="text-[11px] text-gray-600 uppercase tracking-wider">
                      Description
                    </p>

                    <span className="text-[10px] text-gray-700">
                      {
                        (
                          log.description ||
                          ''
                        ).length
                      }{' '}
                      characters
                    </span>

                  </div>

                  <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">

                    <p className="text-sm text-gray-300 leading-6 whitespace-pre-wrap break-words">
                      {log.description ||
                        'No description provided.'}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-end flex-shrink-0">

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-xs text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Close
              </button>

            </div>
          </>
        )}
      </aside>
    </>
  )
}

// =========================================================
// ADMIN AUDIT LOGS
// =========================================================

function AdminAuditLogs() {

  const { token } =
    useAuth()

  const {
    toast,
    showToast,
    closeToast,
    handleError,
    startOperation,
    finishOperation,
    operation,
  } =
    useAdminCrudFeedback()

  // =========================================================
  // DATA
  // =========================================================

  const [logs, setLogs] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  // =========================================================
  // FILTERS
  // =========================================================

  const [search, setSearch] =
    useState('')

  const [actionFilter, setActionFilter] =
    useState('ALL')

  const [currentPage, setCurrentPage] =
    useState(1)

  // =========================================================
  // DETAILS
  // =========================================================

  const [selectedLog, setSelectedLog] =
    useState(null)

  // =========================================================
  // CLEAR LOG
  // =========================================================

  const [clearDays, setClearDays] =
    useState('')

  const [clearConfirmOpen, setClearConfirmOpen] =
    useState(false)

  // =========================================================
  // LOAD LOGS
  // =========================================================

  const loadLogs = async (
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

      const response =
        await fetch(
          `${API_BASE}/audit-logs?page=0&size=100`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      if (!response.ok) {

        let message = ''

        try {
          const errorData =
            await response.json()

          message =
            errorData?.message ||
            errorData?.error ||
            ''
        } catch {
          // Ignore invalid error body.
        }

        throw new Error(
          message ||
          `Failed to load audit logs: ${response.status}`
        )
      }

      const data =
        await response.json()

      setLogs(
        Array.isArray(data)
          ? data
          : data?.content ?? []
      )

    } catch (error) {

      console.error(
        'Failed to load audit logs:',
        error
      )

      handleError(
        error,
        'Unable to load audit logs.'
      )

    } finally {

      setLoading(false)
      setRefreshing(false)

    }
  }

  useEffect(() => {

    if (token) {
      loadLogs()
    }

  }, [token])

  // =========================================================
  // ACTION OPTIONS
  // =========================================================

  const actionOptions =
    useMemo(() => {

      return Array.from(
        new Set(
          logs
            .map(
              (log) =>
                log.action
            )
            .filter(Boolean)
        )
      ).sort()

    }, [logs])

  // =========================================================
  // FILTER
  // =========================================================

  const filteredLogs =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase()

      return logs.filter(
        (log) => {

          const matchesAction =
            actionFilter ===
              'ALL' ||
            log.action ===
              actionFilter

          if (!matchesAction) {
            return false
          }

          if (!value) {
            return true
          }

          const adminName =
            log.adminName
              ?.toLowerCase() ||
            ''

          const adminEmail =
            log.adminEmail
              ?.toLowerCase() ||
            ''

          const description =
            log.description
              ?.toLowerCase() ||
            ''

          const action =
            log.action
              ?.toLowerCase() ||
            ''

          const targetType =
            log.targetType
              ?.toLowerCase() ||
            ''

          const targetId =
            String(
              log.targetId ??
                ''
            )

          return (
            adminName.includes(
              value
            ) ||
            adminEmail.includes(
              value
            ) ||
            description.includes(
              value
            ) ||
            action.includes(
              value
            ) ||
            targetType.includes(
              value
            ) ||
            targetId.includes(
              value
            )
          )
        }
      )

    }, [
      logs,
      search,
      actionFilter,
    ])

  // =========================================================
  // RESET PAGE
  // =========================================================

  useEffect(() => {

    setCurrentPage(1)

  }, [
    search,
    actionFilter,
  ])

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredLogs.length /
          LOGS_PER_PAGE
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

  const paginatedLogs =
    useMemo(() => {

      const start =
        (currentPage - 1) *
        LOGS_PER_PAGE

      return filteredLogs.slice(
        start,
        start +
          LOGS_PER_PAGE
      )

    }, [
      filteredLogs,
      currentPage,
    ])

  const pageStart =
    filteredLogs.length === 0
      ? 0
      : (currentPage - 1) *
          LOGS_PER_PAGE +
        1

  const pageEnd =
    Math.min(
      currentPage *
        LOGS_PER_PAGE,
      filteredLogs.length
    )

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh =
    async () => {

      if (
        refreshing ||
        operation.loading
      ) {
        return
      }

      await loadLogs(true)

      showToast(
        'success',
        'Audit logs refreshed successfully.'
      )
    }

  // =========================================================
  // CLEAR OPTION LABEL
  // =========================================================

  const clearOptionLabel =
    useMemo(() => {

      switch (clearDays) {

        case 'all':
          return 'all audit logs'

        case '1':
          return '24 hours'

        case '3':
          return '3 days'

        case '7':
          return '7 days'

        case '30':
          return '30 days'

        case '90':
          return '90 days'

        case '365':
          return '1 year'

        default:
          return ''

      }

    }, [clearDays])

  // =========================================================
  // CLEAR LOG
  // =========================================================

  const handleClearLog =
    async () => {

      if (
        !clearDays ||
        operation.loading
      ) {
        return
      }

      startOperation(
        'clear-logs'
      )

      try {

        let response

        // =====================================================
        // CLEAR ALL
        // =====================================================

        if (
          clearDays === 'all'
        ) {

          response =
            await fetch(
              `${API_BASE}/audit-logs/clear-all`,
              {
                method: 'DELETE',
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

        }

        // =====================================================
        // CLEAR OLDER THAN X DAYS
        // =====================================================

        else {

          response =
            await fetch(
              `${API_BASE}/audit-logs/clear?days=${encodeURIComponent(
                clearDays
              )}`,
              {
                method: 'DELETE',
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )
        }

        let data = null

        try {

          data =
            await response.json()

        } catch {
          data = null
        }

        if (!response.ok) {

          throw new Error(
            data?.message ||
            data?.error ||
            `Unable to clear audit logs: ${response.status}`
          )
        }

        const deleted =
          Number(
            data?.deleted ??
            data?.deletedCount ??
            0
          )

        const wasClearAll =
          clearDays === 'all'

        setClearConfirmOpen(
          false
        )

        setClearDays('')

        setSelectedLog(null)

        await loadLogs()

        if (wasClearAll) {

          showToast(
            'success',
            deleted > 0
              ? `${deleted} audit log${
                  deleted === 1
                    ? ''
                    : 's'
                } cleared successfully.`
              : 'All audit logs were already empty.'
          )

        } else {

          showToast(
            'success',
            deleted > 0
              ? `${deleted} audit log${
                  deleted === 1
                    ? ''
                    : 's'
                } older than ${clearOptionLabel} cleared successfully.`
              : `No audit logs older than ${clearOptionLabel} were found.`
          )

        }

      } catch (error) {

        console.error(
          'Failed to clear audit logs:',
          error
        )

        handleError(
          error,
          'Unable to clear audit logs.'
        )

      } finally {

        finishOperation()

      }
    }

  // =========================================================
  // OPEN CLEAR CONFIRMATION
  // =========================================================

  const openClearConfirmation =
    () => {

      if (
        !clearDays ||
        operation.loading
      ) {
        return
      }

      setClearConfirmOpen(
        true
      )
    }

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters =
    () => {

      setSearch('')
      setActionFilter(
        'ALL'
      )
      setCurrentPage(1)

    }

  const hasFilters =
    search.trim() !== '' ||
    actionFilter !== 'ALL'

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalActions =
    logs.length

  const actionTypeCount =
    actionOptions.length

  const currentResults =
    filteredLogs.length

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AdminPageShell
      title="Audit Logs"
      subtitle="Track administrator actions and important changes across the FilmScore PH platform."
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

      <div className="space-y-5">

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          <StatCard
            label="Total Actions"
            value={
              totalActions
            }
            icon={
              FileClock
            }
            iconClassName="text-blue-400"
            valueClassName="text-blue-300"
          />

          <StatCard
            label="Action Types"
            value={
              actionTypeCount
            }
            icon={
              Shield
            }
            iconClassName="text-violet-400"
            valueClassName="text-violet-300"
          />

          <StatCard
            label="Current Results"
            value={
              currentResults
            }
            icon={
              Search
            }
            iconClassName="text-emerald-400"
            valueClassName="text-emerald-300"
          />

        </div>

        {/* =====================================================
            FILTER / CLEAR LOG BAR
        ===================================================== */}

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
          searchPlaceholder="Search admin, action, target, or description..."
          resultText={`Showing ${pageStart}-${pageEnd} of ${filteredLogs.length} logs`}
        >

          {/* ===================================================
              ACTION FILTER
          =================================================== */}

          <select
            value={
              actionFilter
            }
            onChange={(e) => {

              setActionFilter(
                e.target.value
              )

              setCurrentPage(
                1
              )

            }}
            className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
          >

            <option value="ALL">
              All actions
            </option>

            {actionOptions.map(
              (action) => (
                <option
                  key={action}
                  value={
                    action
                  }
                >
                  {getActionLabel(
                    action
                  )}
                </option>
              )
            )}

          </select>

          {/* ===================================================
              CLEAR LOG
          =================================================== */}

          <div className="flex items-center gap-2 w-full">

            <select
              value={
                clearDays
              }
              onChange={(e) => {

                setClearDays(
                  e.target.value
                )

              }}
              disabled={
                operation.loading
              }
              className="flex-1 min-w-0 h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >

              <option value="">
                Choose...
              </option>

              <option value="all">
                Clear all logs
              </option>

              <option value="1">
                Older than 24 hours
              </option>

              <option value="3">
                Older than 3 days
              </option>

              <option value="7">
                Older than 7 days
              </option>

              <option value="30">
                Older than 30 days
              </option>

              <option value="90">
                Older than 90 days
              </option>

              <option value="365">
                Older than 1 year
              </option>

            </select>

            <button
              type="button"
              onClick={
                openClearConfirmation
              }
              disabled={
                !clearDays ||
                operation.loading
              }
              title={
                clearDays
                  ? `Clear ${clearOptionLabel}`
                  : 'Choose a time period first'
              }
              className={`inline-flex items-center justify-center gap-1.5 h-[42px] px-3 rounded-lg border text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                clearDays
                  ? 'bg-red-600/10 border-red-600/30 text-red-400 hover:bg-red-600 hover:border-red-500 hover:text-white'
                  : 'bg-gray-900 border-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >

              <Trash2
                size={14}
              />

              Clear Log

            </button>

          </div>

        </AdminFilterBar>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        {loading ? (

          <LoadingState
            label="Loading audit logs..."
          />

        ) : filteredLogs.length === 0 ? (

          <EmptyState
            icon={
              hasFilters
                ? Search
                : FileClock
            }
            title={
              hasFilters
                ? 'No matching logs'
                : 'No audit logs yet'
            }
            message={
              hasFilters
                ? 'Try changing your search or action filter.'
                : 'Administrator activity will appear here once actions are recorded.'
            }
          />

        ) : (

          <>

            {/* =================================================
                TABLE
            ================================================= */}

            <AdminTable
              widths={[
                '24%',
                '17%',
                '15%',
                '28%',
                '16%',
              ]}
              columns={[
                <span
                  key="admin"
                  className="block text-left"
                >
                  Admin
                </span>,

                <span
                  key="action"
                  className="block text-left"
                >
                  Action
                </span>,

                <span
                  key="target"
                  className="block text-left"
                >
                  Target
                </span>,

                <span
                  key="description"
                  className="block text-left"
                >
                  Description
                </span>,

                <span
                  key="date"
                  className="block text-left"
                >
                  Date
                </span>,
              ]}
            >

              {paginatedLogs.map(
                (log) => {

                  const ActionIcon =
                    getActionIcon(
                      log.action
                    )

                  const actionStyle =
                    getActionStyle(
                      log.action
                    )

                  return (

                    <tr
                      key={
                        log.id
                      }
                      onClick={() =>
                        setSelectedLog(
                          log
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {

                        if (
                          event.key ===
                            'Enter' ||
                          event.key ===
                            ' '
                        ) {

                          event.preventDefault()

                          setSelectedLog(
                            log
                          )

                        }

                      }}
                      tabIndex={0}
                      className="cursor-pointer hover:bg-gray-900/60 focus:outline-none focus-visible:bg-gray-900/60 transition-colors duration-150"
                    >

                      {/* =================================================
                          ADMIN
                      ================================================= */}

                      <td className="px-4 py-3.5 text-left align-middle">

                        <div className="flex items-center gap-3 min-w-0">

                          {log.adminAvatarUrl ? (

                            <img
                              src={
                                log.adminAvatarUrl
                              }
                              alt=""
                              className="w-9 h-9 rounded-full object-cover border border-gray-800 flex-shrink-0"
                            />

                          ) : (

                            <div className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center flex-shrink-0">

                              <User
                                size={14}
                                className="text-gray-600"
                              />

                            </div>

                          )}

                          <div className="min-w-0">

                            <p className="text-sm text-white font-medium truncate">
                              {
                                log.adminName ||
                                'Unknown admin'
                              }
                            </p>

                            <p className="text-[10px] text-gray-600 truncate mt-0.5">
                              {
                                log.adminEmail ||
                                'No email'
                              }
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* =================================================
                          ACTION
                      ================================================= */}

                      <td className="px-4 py-3.5 text-left align-middle">

                        <div className="flex items-center gap-2">

                          <div
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${actionStyle.wrapper}`}
                          >

                            <ActionIcon
                              size={14}
                            />

                          </div>

                          <span
                            className={`text-xs font-medium whitespace-nowrap ${actionStyle.text}`}
                          >
                            {
                              getActionLabel(
                                log.action
                              )
                            }
                          </span>

                        </div>

                      </td>

                      {/* =================================================
                          TARGET
                      ================================================= */}

                      <td className="px-4 py-3.5 text-left align-middle">

                        <div className="flex items-center gap-2">

                          <StatusBadge
                            label={
                              log.targetType ||
                              'Unknown'
                            }
                          />

                          {log.targetId !=
                            null && (

                            <span className="text-[11px] text-gray-600 font-mono whitespace-nowrap">
                              #
                              {
                                log.targetId
                              }
                            </span>

                          )}

                        </div>

                      </td>

                      {/* =================================================
                          DESCRIPTION
                      ================================================= */}

                      <td className="px-4 py-3.5 text-left align-middle">

                        <p
                          className="text-xs text-gray-400 leading-relaxed line-clamp-2"
                          title={
                            log.description ||
                            ''
                          }
                        >
                          {
                            log.description ||
                            'No description provided.'
                          }
                        </p>

                      </td>

                      {/* =================================================
                          DATE
                      ================================================= */}

                      <td className="px-4 py-3.5 text-left align-middle whitespace-nowrap">

                        <span className="text-xs text-gray-500">
                          {formatDate(
                            log.createdAt
                          )}
                        </span>

                      </td>

                    </tr>

                  )

                }
              )}

            </AdminTable>

            {/* =================================================
                PAGINATION
            ================================================= */}

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

      {/* =====================================================
          AUDIT LOG DETAILS DRAWER
      ===================================================== */}

      <AuditLogDetailsDrawer
        log={
          selectedLog
        }
        onClose={() =>
          setSelectedLog(
            null
          )
        }
      />

      {/* =====================================================
          CLEAR LOG CONFIRMATION
      ===================================================== */}

      <ConfirmDialog
        open={
          clearConfirmOpen
        }
        title={
          clearDays === 'all'
            ? 'Clear all audit logs?'
            : 'Clear audit logs?'
        }
        message={
          clearDays === 'all'
            ? 'This will permanently delete ALL audit logs. This action cannot be undone.'
            : clearDays
              ? `This will permanently delete audit logs older than ${clearOptionLabel}. This action cannot be undone.`
              : 'Choose a time period before clearing audit logs.'
        }
        confirmLabel={
          operation.type ===
          'clear-logs'
            ? 'Clearing...'
            : clearDays === 'all'
              ? 'Clear All'
              : 'Clear Log'
        }
        onCancel={() => {

          if (
            !operation.loading
          ) {

            setClearConfirmOpen(
              false
            )

          }

        }}
        onConfirm={
          handleClearLog
        }
      />

    </AdminPageShell>
  )
}

export default AdminAuditLogs