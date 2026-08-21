import { Film, Eye } from 'lucide-react'
import EmptyState from '../EmptyState'

function TopMovies({ movies = [] }) {
  if (!movies.length) return <EmptyChart message="No movie view data available yet." />

  return (
    <div className="space-y-3">
      {movies.slice(0, 5).map((movie, index) => (
        <div key={movie.id || index} className="flex items-center gap-3">
          <div className="w-7 text-center text-gray-600 font-bold text-sm">{index + 1}</div>
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt="" className="w-10 h-14 rounded object-cover bg-gray-900" />
          ) : (
            <div className="w-10 h-14 rounded bg-gray-900 flex items-center justify-center">
              <Film size={16} className="text-gray-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{movie.title}</p>
            <p className="text-gray-500 text-xs mt-1">{movie.viewCount || 0} views</p>
          </div>
          <Eye size={15} className="text-gray-600 flex-shrink-0" />
        </div>
      ))}
    </div>
  )
}

export default TopMovies