import { Link } from 'react-router-dom'
import { useRef } from 'react'

function NewMoviesGrid({ movies }) {
  const scrollRef = useRef(null)

  const scrollByAmount = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' })
  }

  return (
    <div className="relative group/carousel">
      <div
        ref={scrollRef}
        className="grid grid-rows-2 grid-flow-col auto-cols-[160px] sm:auto-cols-[190px] md:auto-cols-[220px] gap-3 overflow-x-auto no-scrollbar h-56 sm:h-64 md:h-72 lg:h-80"
      >
        {movies.map(movie => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="flex items-center gap-3 bg-gray-950 rounded-lg overflow-hidden hover:bg-gray-900 transition-colors p-2"
          >
            <div className="h-full aspect-square flex-shrink-0 rounded overflow-hidden bg-gray-900">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No img</div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs md:text-sm font-medium truncate">{movie.title}</p>
              <p className="text-gray-500 text-xs">{movie.releaseYear}</p>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scrollByAmount(-1)}
        aria-label="Previous"
        className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-red-600"
      >
        ‹
      </button>
      <button
        onClick={() => scrollByAmount(1)}
        aria-label="Next"
        className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-red-600"
      >
        ›
      </button>
    </div>
  )
}

export default NewMoviesGrid