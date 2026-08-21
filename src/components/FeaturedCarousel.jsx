import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

function FeaturedCarousel({ movies }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const interval = setInterval(() => {
      if (!el) return
      const maxScroll = el.scrollWidth - el.clientWidth
      if (el.scrollLeft >= maxScroll - 5) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        el.scrollBy({ left: el.clientWidth * 0.75, behavior: 'smooth' })
      }
    }, 2200)

    return () => clearInterval(interval)
  }, [movies])

  const scrollByAmount = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: 'smooth' })
  }

  return (
    <div className="relative group/carousel">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth h-56 sm:h-64 md:h-72 lg:h-80"
      >
        {movies.map(movie => (
          <Link
            to={`/movie/${movie.id}`}
            key={movie.id}
            className="relative flex-shrink-0 h-full aspect-video rounded-lg overflow-hidden group"
          >
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center text-gray-600 text-sm">
                No poster
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
              <p className="text-white font-semibold text-sm md:text-lg truncate">{movie.title}</p>
              <p className="text-red-500 text-xs md:text-sm">{movie.releaseYear}</p>
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

export default FeaturedCarousel