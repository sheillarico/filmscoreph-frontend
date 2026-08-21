import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <div className="sticky top-0 z-50 px-6 py-4 bg-black/70 backdrop-blur-xl border-b-2 border-red-600/50">
      <div className="flex justify-between items-center">
        <Link to="/home" onClick={() => window.scrollTo(0, 0)} className="text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">FilmScore</span>
          <span className="text-red-600">PH</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-3 py-1">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-red-600" />
              )}
              <span className="text-gray-300 text-sm">{user.email}</span>
              {user.role === 'ADMIN' && (
                <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
              )}
            </div>
            <button onClick={logout} className="text-sm text-gray-400 hover:text-white border border-gray-800 hover:border-red-600 rounded-full px-4 py-1.5 transition-colors">
              Logout
            </button>
          </div>
        ) : (
          <a href="https://filmscoreph-backend-production.up.railway.app/oauth2/authorization/google" className="text-sm bg-red-600 hover:bg-red-500 text-white rounded-full px-5 py-2 transition-colors shadow-lg shadow-red-950/50">
            Continue with Google
          </a>
        )}
      </div>
    </div>
  )
}

export default Navbar