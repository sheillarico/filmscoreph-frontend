import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { toggleWatched } from '../services/api'

function MovieCard({
  movie,
  avgRating,
  reviewCount,
  isWatched,
  onWatchedChange,
}) {
  const { user, token } = useAuth()

  const [watched, setWatched] = useState(isWatched)
  const [loading, setLoading] = useState(false)
  const [posterError, setPosterError] = useState(false)

  useEffect(() => {
    setWatched(isWatched)
  }, [isWatched])

  const handleToggleWatched = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) return

    setLoading(true)

    try {
      const result = await toggleWatched(token, movie.id)

      setWatched(result.watched)
      onWatchedChange?.(movie.id, result.watched)
    } catch (err) {
      console.error('Failed to toggle watched:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group relative bg-gray-950 rounded-lg overflow-hidden border border-gray-900 hover:border-red-900/50 hover:shadow-lg hover:shadow-red-950/30 transition-all duration-300">

      {/* POSTER */}
      <Link to={`/movie/${movie.id}`} className="block">

        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">

          {movie.posterUrl && !posterError ? (
            <img
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => {
                console.error(
                  `Failed to load poster for "${movie.title}":`,
                  movie.posterUrl
                )
                setPosterError(true)
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-600 px-4 text-center">
              <span className="text-3xl mb-2">🎬</span>
              <span className="text-xs">
                Poster unavailable
              </span>
            </div>
          )}

          {watched && (
            <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">
              ✓ Watched
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        </div>

        {/* MOVIE INFORMATION */}
        <div className="p-2.5">

          <h3 className="text-white font-semibold text-sm truncate leading-tight">
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

          {/* RATING */}
          {avgRating > 0 ? (
            <div className="flex items-center gap-1.5 mt-1">

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

          {/* LONGER DESCRIPTION */}
          {movie.description && (
            <p className="text-gray-400 text-[11px] mt-2 leading-relaxed line-clamp-4">
              {movie.description}
            </p>
          )}

        </div>

      </Link>

      {/* ACTION BUTTONS */}
      <div className="px-2.5 pb-2.5 flex flex-col gap-1.5">

        <div className="flex gap-1.5">

          <Link
            to={`/movie/${movie.id}`}
            className="flex-1 text-center text-[10px] font-medium bg-red-600 hover:bg-red-500 text-white rounded py-1.5 transition-colors"
          >
            Rate
          </Link>

          {movie.watchLink ? (
            <a
              href={movie.watchLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center text-[10px] font-medium bg-gray-800 hover:bg-gray-700 text-white rounded py-1.5 transition-colors"
            >
              Watch
            </a>
          ) : (
            <span className="flex-1 text-center text-[10px] font-medium bg-gray-900/40 text-gray-700 rounded py-1.5 cursor-not-allowed">
              Not Available
            </span>
          )}

        </div>

        {user && (
          <button
            onClick={handleToggleWatched}
            disabled={loading}
            className={`text-[10px] rounded py-1.5 transition-colors ${
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