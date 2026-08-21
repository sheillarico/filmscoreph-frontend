const API_BASE = import.meta.env.VITE_API_BASE

export async function getMovies(page = 0) {
  const res = await fetch(`${API_BASE}/movies?page=${page}&size=10`)
  if (!res.ok) throw new Error('Failed to fetch movies')
  return res.json()
}

export async function getMovie(id) {
  const res = await fetch(`${API_BASE}/movies/${id}`)
  if (!res.ok) throw new Error('Failed to fetch movie')
  return res.json()
}

export async function getReviews(movieId, page = 0) {
  const res = await fetch(`${API_BASE}/reviews/movie/${movieId}?page=${page}&size=20`)
  if (!res.ok) throw new Error('Failed to fetch reviews')
  return res.json()
}

export async function createReview(token, reviewData) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reviewData)
  })
  if (!res.ok) throw new Error('Failed to submit review')
  return res.json()
}

export async function getNewMovies() {
  const res = await fetch(`${API_BASE}/movies/new?page=0&size=10`)
  if (!res.ok) throw new Error('Failed to fetch new movies')
  return res.json()
}

export async function getTopRatedMovies() {
  const res = await fetch(`${API_BASE}/movies/top-rated?page=0&size=5`)
  if (!res.ok) throw new Error('Failed to fetch top rated movies')
  return res.json()
}

export async function searchMovies(title, page = 0) {
  const res = await fetch(`${API_BASE}/movies/search?title=${encodeURIComponent(title)}&page=${page}&size=10`)
  if (!res.ok) throw new Error('Failed to search movies')
  return res.json()
}

export async function getGenres() {
  const res = await fetch(`${API_BASE}/genres`)
  if (!res.ok) throw new Error('Failed to fetch genres')
  return res.json()
}

export async function getMoviesByGenre(genreId, page = 0) {
  const res = await fetch(`${API_BASE}/movies/genre/${genreId}?page=${page}&size=10`)
  if (!res.ok) throw new Error('Failed to fetch movies by genre')
  return res.json()
}

export async function getMoviesByLanguage(language, page = 0) {
  const res = await fetch(`${API_BASE}/movies/language/${encodeURIComponent(language)}?page=${page}&size=10`)
  if (!res.ok) throw new Error('Failed to fetch movies by language')
  return res.json()
}

export async function getMoviesByType(type, page = 0) {
  const res = await fetch(`${API_BASE}/movies/type/${type}?page=${page}&size=10`)
  if (!res.ok) throw new Error('Failed to fetch movies by type')
  return res.json()
}

export async function getAverageRating(movieId) {
  const res = await fetch(`${API_BASE}/reviews/movie/${movieId}/average`)
  if (!res.ok) return 0
  return res.json()
}

export async function getAverageRatings() {
  const res = await fetch(`${API_BASE}/reviews/averages`)
  if (!res.ok) return {}
  return res.json()
}

export async function getWatchedMovieIds(token) {
  const res = await fetch(`${API_BASE}/watched`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) return []
  return res.json()
}

export async function toggleWatched(token, movieId) {
  const res = await fetch(`${API_BASE}/watched/${movieId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to toggle watched')
  return res.json()
}

export async function getReviewCounts() {
  const res = await fetch(`${API_BASE}/reviews/counts`)
  if (!res.ok) return {}
  return res.json()
}

export async function getPopularMovies() {
  const res = await fetch(`${API_BASE}/movies/popular?page=0&size=5`)
  if (!res.ok) throw new Error('Failed to fetch popular movies')
  return res.json()
}

export async function incrementView(movieId) {
  try {
    const res = await fetch(`${API_BASE}/movies/${movieId}/view`, { method: 'POST' })
    console.log('incrementView response status:', res.status)
  } catch (err) {
    console.log('incrementView caught an error:', err)
  }
}

export async function submitReport(token, message) {
  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  })
  if (!res.ok) throw new Error('Failed to submit report')
  return res.json()
}

export async function getReports(token, page = 0) {
  const res = await fetch(`${API_BASE}/reports?page=${page}&size=20`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch reports')
  return res.json()
}

export async function resolveReport(token, id) {
  const res = await fetch(`${API_BASE}/reports/${id}/resolve`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to resolve report')
  return res.json()
}

export async function getAdminStats(token) {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch admin stats')
  return res.json()
}