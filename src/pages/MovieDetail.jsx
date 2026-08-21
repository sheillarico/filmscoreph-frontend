import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  getMovie,
  getReviews,
  createReview,
  getAverageRating,
  incrementView
} from '../services/api'
import StarRating from '../components/StarRating'
import Navbar from '../components/Navbar'
import CinematicBackground from '../components/CinematicBackground'
import Footer from '../components/Footer'

function getYouTubeEmbedUrl(url) {
  if (!url) return null

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  )

  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [starFilter, setStarFilter] = useState(0)

  const loadData = () => {
    getMovie(id)
      .then(setMovie)
      .catch(console.error)

    getReviews(id)
      .then(data => setReviews(data.content))
      .catch(console.error)

    getAverageRating(id)
      .then(setAvgRating)
      .catch(console.error)
  }

  useEffect(() => {
    loadData()
  }, [id])

  useEffect(() => {
    if (movie?.trailerUrl) {
      incrementView(id)
    }
  }, [movie])

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Please select a rating.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await createReview(token, {
        movieId: Number(id),
        rating,
        reviewText,
        containsSpoilers: false
      })

      setReviewText('')
      setRating(0)
      loadData()
    } catch (err) {
      setError(
        'Could not submit review — you may have already reviewed this movie.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!movie) {
    return (
      <div className="min-h-screen relative text-white">
        <CinematicBackground />
        <Navbar />

        <p className="relative p-6 text-gray-400">
          Loading...
        </p>
      </div>
    )
  }

  const embedUrl = getYouTubeEmbedUrl(movie.trailerUrl)

  const alreadyReviewed =
    user && reviews.some(r => r.user.email === user.email)

  const filteredReviews =
    starFilter === 0
      ? reviews
      : reviews.filter(r => r.rating === starFilter)

  return (
    <div className="min-h-screen relative text-white">
      <CinematicBackground />
      <Navbar />

      <div className="relative">
        <div className="max-w-5xl mx-auto px-6 mt-8">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-6 transition-colors group"
          >
            <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform">
              ‹
            </span>
            Back
          </button>

          {/* Poster + Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8"
          >

            {/* Poster */}
            <div className="mx-auto md:mx-0 w-36 md:w-full">

              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-900 border border-gray-800 shadow-xl shadow-black/50">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                    No poster
                  </div>
                )}
              </div>

              {/* Watch Now - Below Poster */}
              {movie.watchLink ? (
                <a
                  href={movie.watchLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 shadow-lg shadow-red-950/50"
                >
                  Watch Now
                </a>
              ) : (
                <span className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 bg-red-950/30 text-gray-600 text-sm font-semibold rounded-full cursor-not-allowed">
                  Not Available
                </span>
              )}

            </div>

            {/* Movie Information */}
            <div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-400">
                <span>{movie.releaseYear}</span>

                <span className="text-gray-700">·</span>

                <span>{movie.director}</span>

                <span className="text-gray-700">·</span>

                <span>{movie.durationMinutes} min</span>

                <span className="text-gray-700">·</span>

                <span>{movie.language}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {movie.genres?.map(g => (
                  <span
                    key={g.id}
                    className="text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-5">
                <StarRating
                  rating={Math.round(avgRating)}
                  readOnly
                />

                <span className="text-gray-400 text-sm">
                  {avgRating > 0
                    ? `${avgRating.toFixed(1)} / 5`
                    : 'No ratings yet'}
                  {' · '}
                  {reviews.length} review
                  {reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Description */}
              <p className="mt-6 text-gray-300 text-sm leading-relaxed max-w-2xl">
                {movie.description}
              </p>
            </div>
          </motion.div>

          {/* Trailer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-red-600 rounded-full" />
              Trailer
            </h2>

            <div className="bg-gray-950/80 backdrop-blur-sm border border-gray-900 rounded-xl overflow-hidden">
              {embedUrl ? (
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={embedUrl}
                    title={`${movie.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center text-gray-500">
                  No trailer available
                </div>
              )}
            </div>
          </motion.div>

          <hr className="border-gray-900 my-10" />

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-1 h-5 bg-red-600 rounded-full" />

                Reviews

                <span className="text-gray-500 text-sm font-normal">
                  ({filteredReviews.length})
                </span>
              </h2>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setStarFilter(0)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    starFilter === 0
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  All
                </button>

                {[5, 4, 3, 2, 1].map(n => (
                  <button
                    key={n}
                    onClick={() => setStarFilter(n)}
                    className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                      starFilter === n
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                    }`}
                  >
                    {n}★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-gray-950/80 backdrop-blur-sm border border-gray-900 rounded-xl p-5 mb-6">
              {alreadyReviewed ? (
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600/15 text-red-500 flex items-center justify-center text-xs">
                    ✓
                  </span>

                  You've already reviewed this movie.
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-400 mb-2">
                    Your rating
                  </p>

                  <StarRating
                    rating={rating}
                    onRatingChange={user ? setRating : () => {}}
                    readOnly={!user}
                  />

                  {user ? (
                    <form
                      onSubmit={handleSubmitReview}
                      className="mt-4"
                    >
                      <textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="Share your thoughts about this movie..."
                        className="w-full bg-gray-900 border border-gray-800 focus:border-red-900/50 rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors resize-none"
                        rows={3}
                        required
                      />

                      {error && (
                        <p className="text-red-400 text-sm mt-2">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="mt-3 px-5 py-2 bg-red-600 hover:bg-red-500 rounded-full disabled:opacity-50 transition-all hover:scale-105 text-sm font-medium shadow-lg shadow-red-950/40"
                      >
                        {submitting
                          ? 'Submitting...'
                          : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <a
                      href="http://localhost:8081/oauth2/authorization/google"
                      className="inline-block mt-4 px-5 py-2 bg-red-600 hover:bg-red-500 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
                    >
                      Log in to Review
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {reviews.length === 0
                  ? 'No reviews yet — be the first to share your thoughts.'
                  : 'No reviews match this filter.'}
              </p>
            ) : (
              <div className="space-y-3">
                {filteredReviews.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.05
                    }}
                    className="bg-gray-950/80 backdrop-blur-sm border border-gray-900 hover:border-red-900/30 rounded-xl p-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">

                        <div className="w-7 h-7 rounded-full bg-red-600/15 flex items-center justify-center text-red-500 text-xs font-semibold">
                          {r.user.name?.charAt(0).toUpperCase()}
                        </div>

                        <p className="font-medium text-sm">
                          {r.user.name}
                        </p>
                      </div>

                      <StarRating
                        rating={r.rating}
                        readOnly
                      />
                    </div>

                    <p className="text-gray-300 mt-2 text-sm leading-relaxed">
                      {r.reviewText}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MovieDetail