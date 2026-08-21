import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

/* =========================================================
   PUBLIC PAGES
========================================================= */

import IntroGate from './pages/IntroGate'
import Home from './pages/Home'
import OAuthSuccess from './pages/OAuthSuccess'
import MovieDetail from './pages/MovieDetail'
import TermsOfUse from './pages/TermsOfUse'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ReportProblem from './pages/ReportProblem'
import Donate from './pages/Donate'
import BlockedAccount from './pages/BlockedAccount'

/* =========================================================
   GLOBAL COMPONENTS
========================================================= */

import ScrollToTop from './components/ScrollToTop'
import ChatSupport from './components/ChatSupport'
import CinematicBackground from './components/CinematicBackground'
import CookieConsent from './components/CookieConsent'

/* =========================================================
   ADMIN
========================================================= */

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMovies from './pages/admin/AdminMovies'
import AdminGenres from './pages/admin/AdminGenres'
import AdminReviews from './pages/admin/AdminReviews'
import AdminUsers from './pages/admin/AdminUsers'
import AdminReports from './pages/admin/AdminReports'
import AdminAuditLogs from './pages/admin/AdminAuditLogs'

import ProtectedAdminRoute from './route/ProtectedAdminRoute'

/* =========================================================
   APP ROUTES
========================================================= */

function AppRoutes() {
  const location = useLocation()

  const {
    user: currentUser,
    loading: authLoading,
  } = useAuth()

  const hasSeenIntro =
    sessionStorage.getItem('hasSeenIntro')

  const isHomePage =
    location.pathname === '/home'

  const isAdminPage =
    location.pathname.startsWith('/admin')

  const isBlockedAccountPage =
    location.pathname === '/blocked-account'

  /*
   * IMPORTANT:
   * If the authenticated user is blocked, force them to
   * the blocked-account page.
   *
   * We don't do this while authentication is still loading,
   * otherwise the app could briefly redirect before the user
   * state has been restored.
   */
  if (
    !authLoading &&
    currentUser &&
    Boolean(
      currentUser.blocked ??
      currentUser.isBlocked ??
      false
    ) &&
    !isBlockedAccountPage
  ) {
    return (
      <Navigate
        to="/blocked-account"
        replace
      />
    )
  }

  return (
    <>
      {/* =================================================
          SCROLL
      ================================================= */}

      <ScrollToTop />

      {/* =================================================
          ADMIN ROUTES
      ================================================= */}

      {isAdminPage ? (
        <Routes location={location}>
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="movies"
              element={<AdminMovies />}
            />

            <Route
              path="genres"
              element={<AdminGenres />}
            />

            <Route
              path="reviews"
              element={<AdminReviews />}
            />

            <Route
              path="users"
              element={<AdminUsers />}
            />

            <Route
              path="reports"
              element={<AdminReports />}
            />

            <Route
              path="audit-logs"
              element={<AdminAuditLogs />}
            />
          </Route>
        </Routes>
      ) : (
        /* =================================================
           PUBLIC ROUTES
        ================================================= */

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{
              opacity: 0,
              y: isHomePage ? 8 : 3,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: isHomePage ? -8 : -3,
            }}
            transition={{
              duration: isHomePage
                ? 0.25
                : 0.16,
              ease: 'easeInOut',
            }}
          >
            <Routes location={location}>

              {/* =================================================
                  INTRO
              ================================================= */}

              <Route
                path="/"
                element={
                  hasSeenIntro ? (
                    <Navigate
                      to="/home"
                      replace
                    />
                  ) : (
                    <IntroGate />
                  )
                }
              />

              {/* =================================================
                  HOME
              ================================================= */}

              <Route
                path="/home"
                element={<Home />}
              />

              {/* =================================================
                  OAUTH SUCCESS
              ================================================= */}

              <Route
                path="/oauth-success"
                element={<OAuthSuccess />}
              />

              {/* =================================================
                  BLOCKED ACCOUNT
              ================================================= */}

              <Route
                path="/blocked-account"
                element={<BlockedAccount />}
              />

              {/* =================================================
                  MOVIE
              ================================================= */}

              <Route
                path="/movie/:id"
                element={<MovieDetail />}
              />

              {/* =================================================
                  TERMS
              ================================================= */}

              <Route
                path="/terms"
                element={<TermsOfUse />}
              />

              {/* =================================================
                  PRIVACY
              ================================================= */}

              <Route
                path="/privacy"
                element={<PrivacyPolicy />}
              />

              {/* =================================================
                  REPORT
              ================================================= */}

              <Route
                path="/report"
                element={<ReportProblem />}
              />

              {/* =================================================
                  DONATE
              ================================================= */}

              <Route
                path="/donate"
                element={<Donate />}
              />

              {/* =================================================
                  FALLBACK
              ================================================= */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/home"
                    replace
                  />
                }
              />

            </Routes>
          </motion.div>
        </AnimatePresence>
      )}

      {/* =================================================
          GLOBAL UI
      ================================================= */}

      {!isAdminPage &&
        !isBlockedAccountPage &&
        location.pathname !== '/' && (
          <ChatSupport />
        )}

      {!isAdminPage &&
        !isBlockedAccountPage &&
        location.pathname !== '/' && (
          <CookieConsent />
        )}
    </>
  )
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CinematicBackground />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App