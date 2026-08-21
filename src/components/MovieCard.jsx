import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toggleWatched } from '../services/api'

function MovieCard({ movie, avgRating, reviewCount, isWatched, onWatchedChange }) {
  const { user, token } = useAuth()
  const [watched, setWatched] = useState(isWatched)
  const [loading, setLoading] = useState(false)

  const handleToggleWatched = async (e) => {
    e.preventDefault()

    if (!user) return

    setLoading(true)

    try {
      const result = await toggleWatched(token, movie.id)

      setWatched(result.watched)
      onWatchedChange?.(movie.id, result.watched)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group relative bg-gray-950 rounded-lg overflow-hidden border border-gray-900 hover:border-red-900/50 hover:shadow-lg hover:shadow-red-950/30 transition-all duration-300">

      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">

          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
              No poster
            </div>
          )}

          {watched && (
            <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">
              ✓ Watched
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-2">
          <h3 className="text-white font-semibold text-xs truncate leading-tight">
            {movie.title}
          </h3>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
            <span>{movie.releaseYear}</span>

            {movie.durationMinutes && (
              <>
                <span>·</span>
                <span>
                  {Math.floor(movie.durationMinutes / 60)}h{' '}
                  {movie.durationMinutes % 60}m
                </span>
              </>
            )}
          </div>

          {avgRating > 0 ? (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-400 text-[11px]">
                ★
              </span>

              <span className="text-white text-[11px] font-medium">
                {avgRating.toFixed(1)}
              </span>

              <span className="text-gray-500 text-[10px]">
                (
                {reviewCount >= 1000
                  ? `${(reviewCount / 1000).toFixed(1)}K`
                  : reviewCount}
                )
              </span>
            </div>
          ) : (
            <p className="text-gray-600 text-[10px] mt-1">
              No ratings yet
            </p>
          )}

          {movie.description && (
            <p className="text-gray-500 text-[10px] mt-1.5 line-clamp-2 leading-snug">
              {movie.description}
            </p>
          )}
        </div>
      </Link>

      <div className="px-2 pb-2 flex flex-col gap-1">

        <div className="flex gap-1">

          <Link
            to={`/movie/${movie.id}`}
            className="flex-1 text-center text-[10px] font-medium bg-red-600 hover:bg-red-500 text-white rounded py-1 transition-colors"
          >
            Rate
          </Link>

          {movie.watchLink ? (
            <a
              href={movie.watchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-[10px] font-medium bg-gray-800 hover:bg-gray-700 text-white rounded py-1 transition-colors"
            >
              Watch
            </a>
          ) : (
            <span className="flex-1 text-center text-[10px] font-medium bg-gray-900/40 text-gray-700 rounded py-1 cursor-not-allowed">
              Not Available
            </span>
          )}

        </div>

        {user && (
          <button
            onClick={handleToggleWatched}
            disabled={loading}
            className={`text-[10px] rounded py-1 transition-colors ${
              watched
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                : 'bg-transparent border border-gray-700 text-gray-400 hover:border-red-600 hover:text-white'
            }`}
          >
            {loading
              ? 'Updating...'
              : watched
                ? '✓ Watched'
                : 'Mark Watched'}
          </button>
        )}

      </div>
    </div>
  )
}

export default MovieCard