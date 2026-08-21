import { Link } from 'react-router-dom'

function RankedList({ movies, metricLabel, getMetricValue }) {
  return (
    <div className="bg-gray-950 rounded-lg border border-gray-900 overflow-hidden">
      {movies.map((movie, index) => (
        <Link
          to={`/movie/${movie.id}`}
          key={movie.id}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors border-b border-gray-900 last:border-0"
        >
          <span className="text-gray-600 font-bold text-sm w-5 text-center flex-shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-white text-base font-semibold truncate">{movie.title}</p>
            <p className="text-gray-500 text-xs">{movie.releaseYear}</p>
          </div>
          <span className="text-red-500 text-xs font-semibold flex-shrink-0">
            {getMetricValue(movie)} {metricLabel}
          </span>
        </Link>
      ))}
    </div>
  )
}

export default RankedList