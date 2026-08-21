import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedAdminRoute({ children }) {

  const { user, token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm">
          Checking authorization...
        </div>
      </div>
    )
  }

  if (!token || !user) {
    return (
      <Navigate
        to="/home"
        replace
        state={{ from: location }}
      />
    )
  }

  if (user.role !== 'ADMIN') {
    return (
      <Navigate
        to="/home"
        replace
      />
    )
  }

  return children
}

export default ProtectedAdminRoute