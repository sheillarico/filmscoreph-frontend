import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import {
  Film, Users, Star, Eye, AlertTriangle,
  RefreshCw, TrendingUp, Activity, Clock,
} from 'lucide-react'
import StatCard from '../../components/admin/dashboard/StatCard'
import ViewsChart from '../../components/admin/dashboard/ViewsChart'
import ReviewsChart from '../../components/admin/dashboard/ReviewsChart'
import TopMovies from '../../components/admin/dashboard/TopMovies'
import ReportsSummary from '../../components/admin/dashboard/ReportsSummary'
import RecentActivity from '../../components/admin/dashboard/RecentActivity'
import { getAdminStats } from '../../services/api'

function AdminDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (!token) return
    isRefresh ? setRefreshing(true) : setLoading(true)
    setError('')
    try {
      const data = await getAdminStats(token)
      setStats(data)
    } catch (err) {
      console.error('Dashboard error:', err)
      setError(
        isRefresh
          ? 'Refresh failed — showing last loaded data.'
          : 'Unable to load dashboard data.'
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token])

  useEffect(() => {
    let cancelled = false
    if (token) {
      // fetchStats itself checks `token`; the cancelled flag here just
      // prevents a late response from a previous token from clobbering state.
      fetchStats().then(() => {
        if (cancelled) return
      })
    }
    return () => {
      cancelled = true
    }
  }, [token, fetchStats])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={24} className="text-red-500 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Hard error: nothing loaded yet, no data to fall back on.
  if (error && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={32} className="text-red-500 mx-auto mb-3" />
          <p className="text-gray-300 mb-4">{error}</p>
          <button onClick={() => fetchStats()} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Nothing loaded and no error (e.g. token not ready yet) — avoid rendering
  // against a null `stats` below.
  if (!stats) return null

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={18} className="text-red-500" />
            <span className="text-red-500 text-xs font-semibold uppercase tracking-widest">Admin Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome back, Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening across FilmScorePH.</p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-800 bg-gray-950/60 hover:bg-gray-900 text-gray-300 hover:text-white text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Soft error: a refresh failed, but we still have data on screen. */}
      {error && stats && (
        <div className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-lg border border-red-900/50 bg-red-600/5 text-red-400 text-sm">
          <AlertTriangle size={15} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        <StatCard icon={Film} label="Total Movies" value={stats.totalMovies ?? 0} subtitle="Movies in catalog" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers ?? 0} subtitle="Registered accounts" />
        <StatCard icon={Star} label="Total Reviews" value={stats.totalReviews ?? 0} subtitle="Submitted reviews" />
        <StatCard icon={Eye} label="Page Views" value={stats.totalViews ?? 0} subtitle="All-time views" />
        <StatCard
          icon={AlertTriangle}
          label="Open Reports"
          value={stats.openReports ?? 0}
          subtitle="Require attention"
          accent={stats.openReports > 0 ? 'red' : 'green'}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl">
        <StatCard
          icon={Star}
          label="Average Rating"
          value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
          subtitle="Across all reviewed movies"
          accent="yellow"
        />
        <StatCard icon={TrendingUp} label="Platform Status" value="Active" subtitle="All systems operational" accent="green" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Page Views Over Time</h2>
              <p className="text-gray-600 text-xs mt-1">Platform traffic</p>
            </div>
            <Eye size={18} className="text-gray-600" />
          </div>
          <ViewsChart data={stats.viewsOverTime || []} />
        </div>

        <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Reviews by Rating</h2>
              <p className="text-gray-600 text-xs mt-1">Rating distribution</p>
            </div>
            <Star size={18} className="text-gray-600" />
          </div>
          <ReviewsChart data={stats.reviewsByRating || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Top Movies by Views</h2>
              <p className="text-gray-600 text-xs mt-1">Most viewed content</p>
            </div>
            <TrendingUp size={18} className="text-gray-600" />
          </div>
          <TopMovies movies={stats.topMoviesByViews || []} />
        </div>

        <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-semibold">Problem Reports</h2>
              <p className="text-gray-600 text-xs mt-1">Moderation status</p>
            </div>
            <AlertTriangle size={18} className="text-gray-600" />
          </div>
          <ReportsSummary reports={stats.reportSummary} />
        </div>
      </div>

      <div className="bg-gray-950/70 backdrop-blur-sm border border-gray-800/80 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold">Recent Admin Activity</h2>
            <p className="text-gray-600 text-xs mt-1">Latest actions recorded in the system</p>
          </div>
          <Clock size={18} className="text-gray-600" />
        </div>
        <RecentActivity activities={stats.recentActivity || []} />
      </div>
    </div>
  )
}

export default AdminDashboard
