import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Users,
  ShieldCheck,
  ShieldOff,
  Search,
  Trash2,
  UserCheck,
  Mail,
  RefreshCw,
  Ban,
  CheckCircle2,
  Eye,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

import { useAdminCrud } from '../../hooks/useAdminCrud'
import useAdminSelection from '../../hooks/useAdminSelection'
import useAdminCrudFeedback from '../../hooks/useAdminCrudFeedback'

import AdminPageShell from '../../components/admin/AdminPageShell'
import AdminTable from '../../components/admin/AdminTable'
import AdminActionButtons from '../../components/admin/AdminActionButtons'
import SelectionToolbar from '../../components/admin/SelectionToolbar'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/admin/EmptyState'
import LoadingState from '../../components/admin/LoadingState'
import AdminPagination from '../../components/admin/AdminPagination'
import AdminToast from '../../components/admin/AdminToast'
import AdminFilterBar from '../../components/admin/AdminFilterBar'
import StatusBadge from '../../components/admin/StatusBadge'

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
    return '—'
  }

  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  )
}

function getLastLoginValue(user) {
  return (
    user.lastLoginAt ??
    user.lastLogin ??
    user.lastLoggedInAt ??
    null
  )
}

// =========================================================
// DATE FILTER
// =========================================================

function matchesDateRange(
  value,
  filter
) {
  if (
    !filter ||
    filter === 'all'
  ) {
    return true
  }

  if (filter === 'never') {
    return !value
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
// ADMIN USERS
// =========================================================

function AdminUsers() {
  const {
    items,
    loading,
    load: loadUsers,
    updateItem,
    deleteItem,
    deleteSelected,
  } = useAdminCrud('users')

  const {
    user: currentUser,
  } = useAuth()

  const {
    toast,
    showToast,
    closeToast,
    operation,
    startOperation,
    finishOperation,
    handleError,
  } = useAdminCrudFeedback()

  const {
    selectedIds,
    toggleSelect,
    clearSelection,
  } = useAdminSelection(items)

  // =========================================================
  // FILTERS
  // =========================================================

  const [search, setSearch] =
    useState('')

  const [roleFilter, setRoleFilter] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('')

  const [joinedFilter, setJoinedFilter] =
    useState('all')

  const [lastLoginFilter, setLastLoginFilter] =
    useState('all')

  const [currentPage, setCurrentPage] =
    useState(1)

  // =========================================================
  // MODALS
  // =========================================================

  const [pendingUser, setPendingUser] =
    useState(null)

  const [userToBlock, setUserToBlock] =
    useState(null)

  const [userToDelete, setUserToDelete] =
    useState(null)

  const [selectedDeleteOpen, setSelectedDeleteOpen] =
    useState(false)

  const [viewUser, setViewUser] =
    useState(null)

  // =========================================================
  // REFRESH
  // =========================================================

  const [refreshing, setRefreshing] =
    useState(false)

  const USERS_PER_PAGE = 10

  // =========================================================
  // CURRENT USER
  // =========================================================

  const isCurrentUser = (user) => {
    if (!currentUser) {
      return false
    }

    return (
      user.id === currentUser.id ||
      user.email === currentUser.email
    )
  }

  // =========================================================
  // BLOCKED
  // =========================================================

  const isBlocked = (user) => {
    return Boolean(
      user.blocked ??
      user.isBlocked ??
      false
    )
  }

  // =========================================================
  // LAST LOGIN
  // =========================================================

  const getUserLastLogin = (user) => {
    return getLastLoginValue(user)
  }

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalUsers =
    items.length

  const adminCount =
    items.filter(
      (user) =>
        String(
          user.role ?? ''
        ).toUpperCase() === 'ADMIN'
    ).length

  const activeCount =
    items.filter(
      (user) =>
        !isBlocked(user)
    ).length

  const blockedCount =
    items.filter(
      (user) =>
        isBlocked(user)
    ).length

  const googleCount =
    items.filter(
      (user) =>
        String(
          user.provider ?? ''
        ).toUpperCase() ===
        'GOOGLE'
    ).length

  // =========================================================
  // ADMIN SAFETY
  // =========================================================

  /*
   * Viewing your own account is allowed.
   * Demoting your own account is allowed as long as
   * another administrator remains.
   */
  const canChangeRole = (user) => {
    const isAdmin =
      String(
        user.role ?? ''
      ).toUpperCase() === 'ADMIN'

    if (
      isAdmin &&
      adminCount <= 1
    ) {
      return false
    }

    return true
  }

  /*
   * Deleting your own account is allowed as long as
   * another administrator remains.
   */
  const canDelete = (user) => {
    const isAdmin =
      String(
        user.role ?? ''
      ).toUpperCase() === 'ADMIN'

    if (
      isAdmin &&
      adminCount <= 1
    ) {
      return false
    }

    return true
  }

  /*
   * Blocking/unblocking your own account is never allowed.
   */
  const canBlock = (user) => {
    return !isCurrentUser(user)
  }

  // =========================================================
  // FILTERING
  // =========================================================

  const filteredUsers =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase()

      return items.filter(
        (user) => {
          const name =
            user.name
              ?.toLowerCase() ||
            ''

          const email =
            user.email
              ?.toLowerCase() ||
            ''

          const role =
            String(
              user.role ?? ''
            ).toUpperCase()

          const blocked =
            isBlocked(user)

          const matchesSearch =
            !value ||
            name.includes(value) ||
            email.includes(value)

          const matchesRole =
            !roleFilter ||
            role === roleFilter

          const matchesStatus =
            !statusFilter ||
            (
              statusFilter ===
                'BLOCKED' &&
              blocked
            ) ||
            (
              statusFilter ===
                'ACTIVE' &&
              !blocked
            )

          const matchesJoined =
            matchesDateRange(
              user.createdAt,
              joinedFilter
            )

          const matchesLastLogin =
            matchesDateRange(
              getUserLastLogin(user),
              lastLoginFilter
            )

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus &&
            matchesJoined &&
            matchesLastLogin
          )
        }
      )
    }, [
      items,
      search,
      roleFilter,
      statusFilter,
      joinedFilter,
      lastLoginFilter,
    ])

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredUsers.length /
          USERS_PER_PAGE
      )
    )

  useEffect(() => {
    setCurrentPage(1)
  }, [
    search,
    roleFilter,
    statusFilter,
    joinedFilter,
    lastLoginFilter,
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

  const paginatedUsers =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        USERS_PER_PAGE

      return filteredUsers.slice(
        start,
        start +
          USERS_PER_PAGE
      )
    }, [
      filteredUsers,
      currentPage,
    ])

  const pageStart =
    filteredUsers.length === 0
      ? 0
      : (currentPage - 1) *
          USERS_PER_PAGE +
        1

  const pageEnd =
    Math.min(
      currentPage *
        USERS_PER_PAGE,
      filteredUsers.length
    )

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
      await loadUsers()

      showToast(
        'success',
        'Users refreshed successfully.'
      )
    } catch (error) {
      console.error(
        'Failed to refresh users:',
        error
      )

      handleError(
        error,
        'Unable to refresh users.'
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
    setRoleFilter('')
    setStatusFilter('')
    setJoinedFilter('all')
    setLastLoginFilter('all')
    setCurrentPage(1)
  }

  // =========================================================
  // ROLE CHANGE
  // =========================================================

  const confirmRoleChange =
    async () => {
      if (
        !pendingUser ||
        operation.loading
      ) {
        return
      }

      const currentRole =
        String(
          pendingUser.role ?? ''
        ).toUpperCase()

      const newRole =
        currentRole === 'ADMIN'
          ? 'USER'
          : 'ADMIN'

      if (
        currentRole ===
          'ADMIN' &&
        adminCount <= 1
      ) {
        showToast(
          'error',
          'At least one administrator must remain.'
        )

        setPendingUser(null)
        return
      }

      startOperation('role')

      try {
        await updateItem(
          pendingUser.id,
          {
            role: newRole,
          }
        )

        showToast(
          'success',
          newRole === 'ADMIN'
            ? `${pendingUser.name} is now an admin.`
            : `${pendingUser.name} is now a regular user.`
        )

        setPendingUser(null)
      } catch (error) {
        handleError(
          error,
          'Unable to update the user role.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // BLOCK / UNBLOCK
  // =========================================================

  const confirmBlockUser =
    async () => {
      if (
        !userToBlock ||
        operation.loading
      ) {
        return
      }

      if (
        !canBlock(userToBlock)
      ) {
        showToast(
          'error',
          'You cannot block or unblock your own account.'
        )

        setUserToBlock(null)
        return
      }

      const currentlyBlocked =
        isBlocked(
          userToBlock
        )

      startOperation(
        currentlyBlocked
          ? 'unblock'
          : 'block'
      )

      try {
        await updateItem(
          userToBlock.id,
          {
            blocked:
              !currentlyBlocked,
          }
        )

        showToast(
          'success',
          currentlyBlocked
            ? `${userToBlock.name} has been unblocked.`
            : `${userToBlock.name} has been blocked from the website.`
        )

        setUserToBlock(null)
      } catch (error) {
        handleError(
          error,
          currentlyBlocked
            ? 'Unable to unblock this user.'
            : 'Unable to block this user.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // DELETE SINGLE
  // =========================================================

  const confirmDeleteUser =
    async () => {
      if (
        !userToDelete ||
        operation.loading
      ) {
        return
      }

      if (
        !canDelete(
          userToDelete
        )
      ) {
        showToast(
          'error',
          'At least one administrator must remain.'
        )

        setUserToDelete(null)
        return
      }

      startOperation('delete')

      try {
        await deleteItem(
          userToDelete.id
        )

        showToast(
          'success',
          `${userToDelete.name} was deleted successfully.`
        )

        setUserToDelete(null)
      } catch (error) {
        handleError(
          error,
          'Unable to delete this user.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // DELETE SELECTED
  // =========================================================

  const confirmDeleteSelected =
    async () => {
      if (
        selectedIds.length === 0 ||
        operation.loading
      ) {
        return
      }

      const selectedUsers =
        items.filter(
          (user) =>
            selectedIds.includes(
              user.id
            )
        )

      const selectedAdmins =
        selectedUsers.filter(
          (user) =>
            String(
              user.role ?? ''
            ).toUpperCase() ===
            'ADMIN'
        ).length

      if (
        adminCount -
          selectedAdmins <
        1
      ) {
        showToast(
          'error',
          'At least one administrator must remain.'
        )

        setSelectedDeleteOpen(false)
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
          `${count} user${
            count !== 1
              ? 's'
              : ''
          } deleted successfully.`
        )
      } catch (error) {
        handleError(
          error,
          'Unable to delete the selected users.'
        )
      } finally {
        finishOperation()
      }
    }

  // =========================================================
  // SELECT CURRENT PAGE
  // =========================================================

  const allPageSelected =
    paginatedUsers.length > 0 &&
    paginatedUsers.every(
      (user) =>
        selectedIds.includes(
          user.id
        )
    )

  const togglePageSelection =
    () => {
      if (
        allPageSelected
      ) {
        paginatedUsers.forEach(
          (user) => {
            if (
              selectedIds.includes(
                user.id
              )
            ) {
              toggleSelect(
                user.id
              )
            }
          }
        )
      } else {
        paginatedUsers.forEach(
          (user) => {
            if (
              !selectedIds.includes(
                user.id
              )
            ) {
              toggleSelect(
                user.id
              )
            }
          }
        )
      }
    }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <AdminPageShell
      title="User Account Management"
      subtitle="Manage community accounts, roles, access, and activity throughout the FilmScore PH website."
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

        {/* ==================================================
            STATS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">

          <StatCard
            label="Total Users"
            value={
              totalUsers
            }
            icon={
              Users
            }
            iconClassName="text-blue-400"
            valueClassName="text-blue-300"
          />

          <StatCard
            label="Administrators"
            value={
              adminCount
            }
            icon={
              ShieldCheck
            }
            iconClassName="text-violet-400"
            valueClassName="text-violet-300"
          />

          <StatCard
            label="Active Users"
            value={
              activeCount
            }
            icon={
              UserCheck
            }
            iconClassName="text-emerald-400"
            valueClassName="text-emerald-300"
          />

          <StatCard
            label="Blocked Users"
            value={
              blockedCount
            }
            icon={
              Ban
            }
            iconClassName="text-red-400"
            valueClassName="text-red-300"
          />

          <StatCard
            label="Google Accounts"
            value={
              googleCount
            }
            icon={
              Mail
            }
            iconClassName="text-amber-400"
            valueClassName="text-amber-300"
          />

        </div>

        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <AdminFilterBar
          search={
            search
          }
          onSearchChange={(value) => {
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
          searchPlaceholder="Search name or email..."
          resultText={`Showing ${pageStart}-${pageEnd} of ${filteredUsers.length} users`}
        >

          <select
            value={
              roleFilter
            }
            onChange={(e) => {
              setRoleFilter(
                e.target.value
              )
              setCurrentPage(
                1
              )
            }}
            className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
          >
            <option value="">
              All Roles
            </option>

            <option value="USER">
              Users
            </option>

            <option value="ADMIN">
              Admins
            </option>
          </select>

          <select
            value={
              statusFilter
            }
            onChange={(e) => {
              setStatusFilter(
                e.target.value
              )
              setCurrentPage(
                1
              )
            }}
            className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
          >
            <option value="">
              All Statuses
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="BLOCKED">
              Blocked
            </option>
          </select>

          <select
            value={
              joinedFilter
            }
            onChange={(e) => {
              setJoinedFilter(
                e.target.value
              )
              setCurrentPage(
                1
              )
            }}
            className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
          >
            <option value="all">
              Date Joined: All
            </option>

            <option value="3">
              Joined: Last 3 days
            </option>

            <option value="7">
              Joined: Last 7 days
            </option>

            <option value="30">
              Joined: Last month
            </option>

            <option value="90">
              Joined: Last 3 months
            </option>
          </select>

          <select
            value={
              lastLoginFilter
            }
            onChange={(e) => {
              setLastLoginFilter(
                e.target.value
              )
              setCurrentPage(
                1
              )
            }}
            className="w-full h-[42px] bg-gray-900 border border-gray-800 rounded-lg px-3 text-sm text-gray-300 focus:outline-none focus:border-red-600/50 transition-colors duration-150"
          >
            <option value="all">
              Last Login: Any
            </option>

            <option value="3">
              Login: Last 3 days
            </option>

            <option value="7">
              Login: Last 7 days
            </option>

            <option value="30">
              Login: Last month
            </option>

            <option value="90">
              Login: Last 3 months
            </option>

            <option value="never">
              Never logged in
            </option>
          </select>

        </AdminFilterBar>

        {/* ==================================================
            BULK ACTIONS
        ================================================== */}

        {selectedIds.length > 0 && (
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
        )}

        {/* ==================================================
            TABLE
        ================================================== */}

        {loading ? (
          <LoadingState
            label="Loading users..."
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users yet"
            message="Registered accounts will appear here."
          />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No users found"
            message="No users match your current search or filters."
          />
        ) : (
          <>
            <AdminTable
              widths={[
                '5%',
                '22%',
                '18%',
                '9%',
                '10%',
                '9%',
                '11%',
                '7%',
                '9%',
              ]}
              columns={[
                <div
                  key="select"
                  className="flex justify-center"
                >
                  <input
                    type="checkbox"
                    checked={
                      allPageSelected
                    }
                    onChange={
                      togglePageSelection
                    }
                    disabled={
                      operation.loading
                    }
                    className="appearance-none w-4 h-4 rounded-[4px] border border-gray-700 bg-gray-900 cursor-pointer transition-all checked:bg-red-600 checked:border-red-500 hover:border-gray-500 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>,

                <span
                  key="user"
                  className="block text-left"
                >
                  User
                </span>,

                <span
                  key="email"
                  className="block text-left"
                >
                  Email
                </span>,

                <span
                  key="provider"
                  className="block text-center"
                >
                  Provider
                </span>,

                <span
                  key="role"
                  className="block text-center"
                >
                  Role
                </span>,

                <span
                  key="joined"
                  className="block text-center"
                >
                  Joined
                </span>,

                <span
                  key="lastLogin"
                  className="block text-center"
                >
                  Last Login
                </span>,

                <span
                  key="reviews"
                  className="block text-center"
                >
                  Reviews
                </span>,

                <span
                  key="actions"
                  className="block text-center"
                >
                  Actions
                </span>,
              ]}
            >
              {paginatedUsers.map(
                (user) => {
                  const admin =
                    String(
                      user.role ?? ''
                    ).toUpperCase() ===
                    'ADMIN'

                  const blocked =
                    isBlocked(user)

                  return (
                    <tr
                      key={
                        user.id
                      }
                      className="hover:bg-gray-900/40 transition-colors duration-150"
                    >

                      {/* SELECT */}

                      <td className="px-3 py-3.5 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            user.id
                          )}
                          onChange={() =>
                            toggleSelect(
                              user.id
                            )
                          }
                          disabled={
                            operation.loading
                          }
                          aria-label={`Select ${user.name}`}
                          className="appearance-none w-4 h-4 rounded-[4px] border border-gray-700 bg-gray-900 cursor-pointer transition-all checked:bg-red-600 checked:border-red-500 hover:border-gray-500 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                        />
                      </td>

                      {/* USER */}

                      <td className="px-4 py-3.5 text-left">
                        <div className="flex items-center gap-3 min-w-0">
                          {user.avatarUrl ? (
                            <img
                              src={
                                user.avatarUrl
                              }
                              alt=""
                              className="w-9 h-9 rounded-full object-cover border border-gray-800 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-400 font-medium flex-shrink-0">
                              {user.name
                                ?.charAt(
                                  0
                                )
                                .toUpperCase() ||
                                '?'}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-white font-medium truncate">
                                {
                                  user.name
                                }
                              </p>

                              {isCurrentUser(
                                user
                              ) && (
                                <span className="text-[9px] text-red-400 border border-red-600/20 bg-red-600/10 rounded px-1.5 py-0.5 whitespace-nowrap">
                                  You
                                </span>
                              )}

                              {blocked && (
                                <span className="text-[9px] text-red-300 border border-red-500/20 bg-red-500/10 rounded px-1.5 py-0.5 whitespace-nowrap">
                                  Blocked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}

                      <td className="px-4 py-3.5 text-left">
                        <span className="text-sm text-gray-400 truncate block">
                          {
                            user.email
                          }
                        </span>
                      </td>

                      {/* PROVIDER */}

                      <td className="px-4 py-3.5 text-center align-middle">
                        <span className="text-[11px] text-gray-500 uppercase tracking-wide">
                          {
                            user.provider ||
                            'GOOGLE'
                          }
                        </span>
                      </td>

                      {/* ROLE */}

                      <td className="px-4 py-3.5 text-center align-middle">
                        <div className="flex justify-center">
                          <StatusBadge
                            label={
                              user.role
                            }
                          />
                        </div>
                      </td>

                      {/* JOINED */}

                      <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                        <span className="text-xs text-gray-500">
                          {formatDate(
                            user.createdAt
                          )}
                        </span>
                      </td>

                      {/* LAST LOGIN */}

                      <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                        <span
                          className={`text-xs ${
                            getUserLastLogin(
                              user
                            )
                              ? 'text-gray-500'
                              : 'text-gray-700'
                          }`}
                        >
                          {formatDate(
                            getUserLastLogin(
                              user
                            )
                          )}
                        </span>
                      </td>

                      {/* REVIEWS */}

                      <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                        <span className="text-sm text-gray-400 tabular-nums">
                          {Number(
                            user.reviewCount ??
                              0
                          ).toLocaleString()}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-3 py-3.5 text-center align-middle">
                        <AdminActionButtons>

                          {/* VIEW */}

                          <button
                            type="button"
                            disabled={
                              operation.loading
                            }
                            onClick={() =>
                              setViewUser(
                                user
                              )
                            }
                            title="View user"
                            aria-label={`View ${user.name}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
                          >
                            <Eye
                              size={15}
                            />
                          </button>

                          {/* PROMOTE / DEMOTE */}

                          <button
                            type="button"
                            disabled={
                              operation.loading ||
                              !canChangeRole(
                                user
                              )
                            }
                            onClick={() =>
                              setPendingUser(
                                user
                              )
                            }
                            title={
                              admin
                                ? 'Demote user'
                                : 'Promote user'
                            }
                            aria-label={
                              admin
                                ? `Demote ${user.name}`
                                : `Promote ${user.name}`
                            }
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors duration-150 disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/40"
                          >
                            {admin ? (
                              <ShieldOff
                                size={15}
                              />
                            ) : (
                              <ShieldCheck
                                size={15}
                              />
                            )}
                          </button>

                          {/* BLOCK / UNBLOCK */}

                          <button
                            type="button"
                            disabled={
                              operation.loading ||
                              !canBlock(user)
                            }
                            onClick={() =>
                              setUserToBlock(
                                user
                              )
                            }
                            title={
                              blocked
                                ? 'Unblock user'
                                : 'Block user'
                            }
                            aria-label={
                              blocked
                                ? `Unblock ${user.name}`
                                : `Block ${user.name}`
                            }
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-150 disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none ${
                              blocked
                                ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                                : 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
                            }`}
                          >
                            {blocked ? (
                              <CheckCircle2
                                size={15}
                              />
                            ) : (
                              <Ban
                                size={15}
                              />
                            )}
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            disabled={
                              operation.loading ||
                              !canDelete(
                                user
                              )
                            }
                            onClick={() =>
                              setUserToDelete(
                                user
                              )
                            }
                            title="Delete user"
                            aria-label={`Delete ${user.name}`}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-150 disabled:opacity-25 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/40"
                          >
                            <Trash2
                              size={15}
                            />
                          </button>

                        </AdminActionButtons>
                      </td>
                    </tr>
                  )
                }
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

      {/* ==================================================
          VIEW USER
      ================================================== */}

      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <button
            type="button"
            aria-label="Close user details"
            onClick={() =>
              setViewUser(null)
            }
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-gray-950 border border-gray-800/80 rounded-2xl shadow-2xl overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-800/80 flex items-center justify-between">

              <div>
                <h2 className="text-sm font-semibold text-white">
                  User Details
                </h2>

                <p className="text-[11px] text-gray-600 mt-0.5">
                  Account information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewUser(null)
                }
                className="text-gray-600 hover:text-white transition-colors"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <div className="p-5">

              <div className="flex flex-col items-center text-center pb-5 border-b border-gray-800">

                {viewUser.avatarUrl ? (
                  <img
                    src={
                      viewUser.avatarUrl
                    }
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border border-gray-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-lg text-gray-400 font-medium">
                    {viewUser.name
                      ?.charAt(
                        0
                      )
                      .toUpperCase() ||
                      '?'}
                  </div>
                )}

                <h3 className="text-base text-white font-semibold mt-3">
                  {
                    viewUser.name
                  }
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  {
                    viewUser.email
                  }
                </p>

                <div className="flex items-center justify-center gap-2 mt-3">

                  <StatusBadge
                    label={
                      viewUser.role
                    }
                  />

                  {isBlocked(
                    viewUser
                  ) && (
                    <span className="text-[10px] text-red-400 border border-red-600/20 bg-red-600/10 rounded px-2 py-0.5">
                      Blocked
                    </span>
                  )}

                </div>

              </div>

              <div className="divide-y divide-gray-800">

                <div className="flex items-center justify-between py-3">
                  <span className="text-xs text-gray-600">
                    Provider
                  </span>

                  <span className="text-xs text-gray-400 uppercase">
                    {
                      viewUser.provider ||
                      'GOOGLE'
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-xs text-gray-600">
                    Joined
                  </span>

                  <span className="text-xs text-gray-400">
                    {formatDate(
                      viewUser.createdAt
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-xs text-gray-600">
                    Last Login
                  </span>

                  <span className="text-xs text-gray-400">
                    {formatDate(
                      getUserLastLogin(
                        viewUser
                      )
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-xs text-gray-600">
                    Reviews
                  </span>

                  <span className="text-xs text-gray-400">
                    {Number(
                      viewUser.reviewCount ??
                        0
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-xs text-gray-600">
                    User ID
                  </span>

                  <span className="text-xs text-gray-500 font-mono">
                    #{viewUser.id}
                  </span>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          ROLE CHANGE
      ================================================== */}

      <ConfirmDialog
        open={
          !!pendingUser
        }
        title={
          pendingUser?.role ===
          'ADMIN'
            ? 'Remove admin access?'
            : 'Grant admin access?'
        }
        message={
          pendingUser?.role ===
          'ADMIN'
            ? `${pendingUser?.email} will lose administrator access. Another administrator must remain active.`
            : `${pendingUser?.email} will gain administrator access to the admin panel.`
        }
        confirmLabel={
          operation.type ===
          'role'
            ? 'Saving...'
            : pendingUser?.role ===
                'ADMIN'
              ? 'Demote'
              : 'Promote'
        }
        onCancel={() => {
          if (
            !operation.loading
          ) {
            setPendingUser(null)
          }
        }}
        onConfirm={
          confirmRoleChange
        }
      />

      {/* ==================================================
          BLOCK / UNBLOCK
      ================================================== */}

      <ConfirmDialog
        open={
          !!userToBlock
        }
        title={
          userToBlock &&
          isBlocked(
            userToBlock
          )
            ? 'Unblock user?'
            : 'Block user?'
        }
        message={
          userToBlock
            ? isBlocked(
                userToBlock
              )
              ? `${userToBlock.name} will be allowed to use the website again.`
              : `${userToBlock.name} will be prevented from accessing the website.`
            : ''
        }
        confirmLabel={
          operation.type ===
            'block' ||
          operation.type ===
            'unblock'
            ? 'Saving...'
            : userToBlock &&
                isBlocked(
                  userToBlock
                )
              ? 'Unblock'
              : 'Block'
        }
        onCancel={() => {
          if (
            !operation.loading
          ) {
            setUserToBlock(null)
          }
        }}
        onConfirm={
          confirmBlockUser
        }
      />

      {/* ==================================================
          DELETE SINGLE
      ================================================== */}

      <ConfirmDialog
        open={
          !!userToDelete
        }
        title="Delete user?"
        message={
          userToDelete
            ? `This will permanently delete ${userToDelete.name}'s account. This cannot be undone.`
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
            setUserToDelete(
              null
            )
          }
        }}
        onConfirm={
          confirmDeleteUser
        }
      />

      {/* ==================================================
          DELETE SELECTED
      ================================================== */}

      <ConfirmDialog
        open={
          selectedDeleteOpen
        }
        title="Delete selected users?"
        message={`This will permanently delete ${selectedIds.length} selected user${
          selectedIds.length !==
          1
            ? 's'
            : ''
        }. At least one administrator must remain. This cannot be undone.`}
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

export default AdminUsers