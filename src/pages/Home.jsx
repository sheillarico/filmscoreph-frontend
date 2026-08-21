import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getMovies,
  getNewMovies,
  getTopRatedMovies,
  searchMovies,
  getGenres,
  getMoviesByGenre,
  getMoviesByType,
  getMoviesByLanguage,
  getAverageRatings,
  getWatchedMovieIds,
  getReviewCounts,
  getPopularMovies
} from '../services/api'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import NewMoviesGrid from '../components/NewMoviesGrid'
import Navbar from '../components/Navbar'
import CinematicBackground from '../components/CinematicBackground'
import FeaturedCarousel from '../components/FeaturedCarousel'
import RankedList from '../components/RankedList'
import Pagination from '../components/Pagination'
import Footer from '../components/Footer'
import HomeSkeleton from '../components/HomeSkeleton'

function Home() {
  const { user, token } = useAuth()

  const [movies, setMovies] = useState([])
  const [newMovies, setNewMovies] = useState([])
  const [topRated, setTopRated] = useState([])
  const [popular, setPopular] = useState([])
  const [genres, setGenres] = useState([])

  const [selectedGenre, setSelectedGenre] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')

  const [loading, setLoading] = useState(true)
  const [avgRatings, setAvgRatings] = useState({})
  const [watchedIds, setWatchedIds] = useState([])
  const [reviewCounts, setReviewCounts] = useState({})

  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const allMoviesRef = useRef(null)

  const handleWatchedChange = (movieId, isWatched) => {
    setWatchedIds(prev =>
      isWatched
        ? [...prev, movieId]
        : prev.filter(id => id !== movieId)
    )
  }

  // Initial load — everything needed for first paint, including page 1 of movies
  useEffect(() => {
    async function loadHomeData() {
      try {
        const [
          newMoviesData,
          topRatedData,
          popularData,
          genresData,
          moviesData
        ] = await Promise.all([
          getNewMovies(),
          getTopRatedMovies(),
          getPopularMovies(),
          getGenres(),
          getMovies(0)
        ])

        setNewMovies(newMoviesData.content)
        setTopRated(topRatedData.content)
        setPopular(popularData.content)
        setGenres(genresData)
        setMovies(moviesData.content)
        setTotalPages(moviesData.totalPages)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  // Ratings, review counts, watched status
  useEffect(() => {
    getAverageRatings().then(setAvgRatings).catch(console.error)
    getReviewCounts().then(setReviewCounts).catch(console.error)

    if (user && token) {
      getWatchedMovieIds(token).then(setWatchedIds).catch(console.error)
    }
  }, [user, token])

  // Reset to page 0 whenever a filter/search/sort changes
  useEffect(() => {
    if (loading) return
    setCurrentPage(0)
  }, [searchQuery, selectedGenre, selectedType, selectedLanguage, sortBy])

  // Fetch movies for "All Movies" whenever filters or page change
  useEffect(() => {
    if (loading) return

    if (searchQuery) {
      searchMovies(searchQuery, currentPage)
        .then(data => {
          setMovies(data.content)
          setTotalPages(data.totalPages)
        })
        .catch(console.error)
    } else if (selectedGenre) {
      getMoviesByGenre(selectedGenre, currentPage)
        .then(data => {
          setMovies(data.content)
          setTotalPages(data.totalPages)
        })
        .catch(console.error)
    } else if (selectedType) {
      getMoviesByType(selectedType, currentPage)
        .then(data => {
          setMovies(data.content)
          setTotalPages(data.totalPages)
        })
        .catch(console.error)
    } else if (selectedLanguage) {
      getMoviesByLanguage(selectedLanguage, currentPage)
        .then(data => {
          setMovies(data.content)
          setTotalPages(data.totalPages)
        })
        .catch(console.error)
    } else if (sortBy === 'newest') {
      getNewMovies()
        .then(data => {
          setMovies(data.content)
          setTotalPages(1)
        })
        .catch(console.error)
    } else if (sortBy === 'top-rated') {
      getTopRatedMovies()
        .then(data => {
          setMovies(data.content)
          setTotalPages(1)
        })
        .catch(console.error)
    } else {
      getMovies(currentPage)
        .then(data => {
          setMovies(data.content)
          setTotalPages(data.totalPages)
        })
        .catch(console.error)
    }
  }, [searchQuery, selectedGenre, selectedType, selectedLanguage, sortBy, currentPage])

  return (
    <div className="min-h-screen relative">
      <CinematicBackground />
      <Navbar />

      <div className="relative px-6 py-8">
        {loading ? (
          <HomeSkeleton />
        ) : (
          <>
            <section className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topRated.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-600 rounded-full" />
                    Featured
                  </h2>
                  <FeaturedCarousel movies={topRated} />
                </div>
              )}
              {newMovies.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-600 rounded-full" />
                    New Movies
                  </h2>
                  <NewMoviesGrid movies={[...newMovies].sort((a, b) => b.releaseYear - a.releaseYear)} />
                </div>
              )}
            </section>

            <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topRated.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-600 rounded-full" />
                    Top Rated
                  </h2>
                  <RankedList
                    movies={topRated}
                    metricLabel="★"
                    getMetricValue={movie => (avgRatings[movie.id] || 0).toFixed(1)}
                  />
                </div>
              )}
              {popular.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 bg-red-600 rounded-full" />
                    Popular
                  </h2>
                  <RankedList
                    movies={popular}
                    metricLabel="page views"
                    getMetricValue={movie => movie.viewCount || 0}
                  />
                </div>
              )}
            </section>

            <section ref={allMoviesRef}>
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full" />
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : selectedGenre
                  ? 'Filtered'
                  : 'All Movies'}
              </h2>

              <SearchBar
                onSearch={setSearchQuery}
                genres={genres}
                onGenreFilter={setSelectedGenre}
                selectedGenre={selectedGenre}
                onTypeFilter={setSelectedType}
                selectedType={selectedType}
                onLanguageFilter={setSelectedLanguage}
                selectedLanguage={selectedLanguage}
                onSortChange={setSortBy}
                sortBy={sortBy}
              />

              {movies.length === 0 ? (
                <p className="text-gray-400 mb-24">No movies found.</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {movies.map(movie => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        avgRating={avgRatings[movie.id] || 0}
                        reviewCount={reviewCounts[movie.id] || 0}
                        isWatched={watchedIds.includes(movie.id)}
                        onWatchedChange={handleWatchedChange}
                      />
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page)
                      allMoviesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  />
                </>
              )}
            </section>

            <Footer />
          </>
        )}
      </div>
    </div>
  )
}

export default Home