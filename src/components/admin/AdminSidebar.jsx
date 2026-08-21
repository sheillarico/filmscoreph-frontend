import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { getAdminStats } from '../../services/api'

function Icon({
  path,
  className = 'w-[18px] h-[18px]',
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {path}
    </svg>
  )
}

const icons = {
  dashboard: (
    <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 12h8v9h-8zM3 15h8v6H3z" />
  ),

  movies: (
    <path d="M3 7h18M3 7v13a1 1 0 001 1h16a1 1 0 001-1V7M8 3l2 4M14 3l2 4M3 7l2-4h14l2 4" />
  ),

  genres: (
    <path d="M20.59 13.41L11 3.83V3H4v7l.83.83L14.41 20.6a2 2 0 002.83 0l3.35-3.35a2 2 0 000-2.84zM7 8a1 1 0 110-2 1 1 0 010 2z" />
  ),

  reviews: (
    <path d="M12 17.3l-6.2 3.7 1.6-7-5.4-4.7 7.1-.6L12 2l2.9 6.7 7.1.6-5.4 4.7 1.6 7z" />
  ),

  users: (
    <path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  ),

  reports: (
    <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  ),

  audit: (
    <path d="M9 2h6l6 6v12a2 2 0 01-2 2H9a2 2 0 01-2-2V4a2 2 0 012-2zM9 12h6M9 16h6M9 8h2" />
  ),

  logout: (
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  ),
}

const navSections = [
  {
    label: 'Overview',
    items: [
      {
        to: '/admin',
        label: 'Dashboard',
        icon: 'dashboard',
        end: true,
      },
    ],
  },

  {
    label: 'Content',
    items: [
      {
        to: '/admin/genres',
        label: 'Genres',
        icon: 'genres',
      },

      {
        to: '/admin/movies',
        label: 'Movies',
        icon: 'movies',
      },

      {
        to: '/admin/reviews',
        label: 'Reviews',
        icon: 'reviews',
      },
    ],
  },

  {
    label: 'Community',
    items: [
      {
        to: '/admin/users',
        label: 'Users',
        icon: 'users',
      },

      {
        to: '/admin/reports',
        label: 'Problem Reports',
        icon: 'reports',
      },
    ],
  },

  {
    label: 'System',
    items: [
      {
        to: '/admin/audit-logs',
        label: 'Audit Logs',
        icon: 'audit',
      },
    ],
  },
]

function AdminSidebar() {
  const {
    user,
    token,
    logout,
  } = useAuth()

  const [openCount, setOpenCount] =
    useState(0)

  const [statsFailed, setStatsFailed] =
    useState(false)

  useEffect(() => {
    if (!token) {
      return
    }

    let cancelled = false

    getAdminStats(token)
      .then((data) => {
        if (cancelled) {
          return
        }

        setOpenCount(
          data.openReports || 0
        )

        setStatsFailed(false)
      })
      .catch((error) => {
        console.error(
          'Error fetching admin stats:',
          error
        )

        if (!cancelled) {
          setStatsFailed(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className="w-64 h-screen sticky top-0 bg-gray-950 border-r border-gray-900 flex flex-col">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="px-5 py-5 border-b border-gray-900">

        <h1 className="text-base font-bold tracking-tight">
          <span className="text-white">
            FilmScore
          </span>

          <span className="text-red-600">
            PH
          </span>
        </h1>

        <p className="text-gray-600 text-[11px] mt-0.5 uppercase tracking-wider font-medium">
          Admin Console
        </p>

      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">

        {navSections.map(
          (section) => (
            <div
              key={
                section.label
              }
            >

              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                {section.label}
              </p>

              <div className="space-y-0.5">

                {section.items.map(
                  (item) => (
                    <NavLink
                      key={
                        item.to
                      }
                      to={
                        item.to
                      }
                      end={
                        item.end
                      }
                      className={({
                        isActive,
                      }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                          isActive
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-500 hover:bg-gray-900/60 hover:text-gray-200'
                        }`
                      }
                    >
                      {({
                        isActive,
                      }) => (
                        <>
                          <Icon
                            path={
                              icons[
                                item
                                  .icon
                              ]
                            }
                            className={`w-[17px] h-[17px] ${
                              isActive
                                ? 'text-red-500'
                                : 'text-gray-600'
                            }`}
                          />

                          <span className="flex-1">
                            {
                              item.label
                            }
                          </span>

                          {item.to ===
                            '/admin/reports' &&
                            !statsFailed &&
                            openCount >
                              0 && (
                              <span className="bg-red-600 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                                {openCount >
                                99
                                  ? '99+'
                                  : openCount}
                              </span>
                            )}
                        </>
                      )}
                    </NavLink>
                  )
                )}

              </div>

            </div>
          )
        )}

      </nav>

      {/* ==================================================
          USER / LOGOUT
      ================================================== */}

      <div className="px-3 py-4 border-t border-gray-900">

        <div className="flex items-center gap-2.5 px-2 py-2 mb-2 rounded-lg bg-gray-900/40">

          {user?.avatarUrl ? (
            <img
              src={
                user.avatarUrl
              }
              alt=""
              className="w-7 h-7 rounded-full ring-1 ring-gray-800"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-gray-500 font-medium">
              {user?.email
                ?.charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">

            <p className="text-gray-300 text-xs truncate">
              {user?.email}
            </p>

            <p className="text-red-500 text-[10px] font-medium uppercase tracking-wide">
              Administrator
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={
            logout
          }
          className="w-full flex items-center justify-center gap-2 text-[13px] font-medium text-gray-500 hover:text-white border border-gray-900 hover:border-red-900/50 hover:bg-red-600/5 rounded-md py-2 transition-colors"
        >
          <Icon
            path={
              icons.logout
            }
            className="w-4 h-4"
          />

          Sign Out
        </button>

      </div>

    </div>
  )
}

export default AdminSidebar