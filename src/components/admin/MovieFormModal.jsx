import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const emptyForm = {
  title: '',
  description: '',
  releaseYear: '',
  type: 'MOVIE',
  posterUrl: '',
  trailerUrl: '',
  watchLink: '',
  director: '',
  durationMinutes: '',
  language: '',
  genreIds: [],
}

function MovieFormModal({
  open,
  movie,
  genres = [],
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setError('')

    if (movie) {
      setForm({
        title: movie.title ?? '',
        description: movie.description ?? '',
        releaseYear: movie.releaseYear ?? '',
        type: movie.type ?? 'MOVIE',
        posterUrl: movie.posterUrl ?? '',
        trailerUrl: movie.trailerUrl ?? '',
        watchLink: movie.watchLink ?? '',
        director: movie.director ?? '',
        durationMinutes: movie.durationMinutes ?? '',
        language: movie.language ?? '',

        genreIds: Array.isArray(movie.genres)
          ? movie.genres
              .map((genre) => Number(genre?.id))
              .filter(
                (id) => Number.isFinite(id)
              )
          : [],
      })
    } else {
      setForm({
        ...emptyForm,
        genreIds: [],
      })
    }
  }, [movie, open])

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const toggleGenre = (id) => {
    const numericId = Number(id)

    setForm((current) => ({
      ...current,

      genreIds: current.genreIds.includes(
        numericId
      )
        ? current.genreIds.filter(
            (genreId) =>
              genreId !== numericId
          )
        : [
            ...current.genreIds,
            numericId,
          ],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      setError('Movie title is required.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const payload = {
        title: form.title.trim(),

        description:
          form.description.trim() || null,

        releaseYear:
          form.releaseYear === ''
            ? null
            : Number(form.releaseYear),

        type:
          form.type || 'MOVIE',

        posterUrl:
          form.posterUrl.trim() || null,

        trailerUrl:
          form.trailerUrl.trim() || null,

        watchLink:
          form.watchLink.trim() || null,

        director:
          form.director.trim() || null,

        durationMinutes:
          form.durationMinutes === ''
            ? null
            : Number(form.durationMinutes),

        language:
          form.language.trim() || null,

        genreIds:
          form.genreIds.map((id) =>
            Number(id)
          ),
      }

      await onSave(payload)

    } catch (err) {
      console.error(
        'Failed to save movie:',
        err
      )

      setError(
        err?.message ||
          'Unable to save movie. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-600/50 transition-colors'

  const labelClass =
    'text-xs text-gray-500 mb-1.5 block'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              if (!saving) {
                onClose()
              }
            }
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
            }}
            transition={{
              duration: 0.15,
            }}
            className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-900 sticky top-0 bg-gray-950 z-10">
              <div>
                <h2 className="text-white font-semibold">
                  {movie
                    ? 'Edit Movie'
                    : 'Add Movie'}
                </h2>

                <p className="text-[11px] text-gray-600 mt-0.5">
                  {movie
                    ? 'Update the movie information below.'
                    : 'Add a new movie to your catalog.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    onClose()
                  }
                }}
                disabled={saving}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-gray-900 transition-colors disabled:opacity-40"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              {/* ERROR */}

              {error && (
                <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3">
                  <p className="text-xs text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* TITLE */}

              <div>
                <label className={labelClass}>
                  Title *
                </label>

                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateField(
                      'title',
                      event.target.value
                    )
                  }
                  placeholder="Enter movie title"
                  className={inputClass}
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className={labelClass}>
                  Description
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      'description',
                      event.target.value
                    )
                  }
                  placeholder="Enter movie description"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* YEAR / TYPE */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Release Year
                  </label>

                  <input
                    type="number"
                    min="1800"
                    max="2100"
                    value={form.releaseYear}
                    onChange={(event) =>
                      updateField(
                        'releaseYear',
                        event.target.value
                      )
                    }
                    placeholder="2026"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateField(
                        'type',
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="MOVIE">
                      Movie
                    </option>

                    <option value="SERIES">
                      Series
                    </option>

                    <option value="DOCUMENTARY">
                      Documentary
                    </option>
                  </select>
                </div>
              </div>

              {/* DIRECTOR / DURATION */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Director
                  </label>

                  <input
                    type="text"
                    value={form.director}
                    onChange={(event) =>
                      updateField(
                        'director',
                        event.target.value
                      )
                    }
                    placeholder="Director name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Duration (minutes)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.durationMinutes
                    }
                    onChange={(event) =>
                      updateField(
                        'durationMinutes',
                        event.target.value
                      )
                    }
                    placeholder="120"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* LANGUAGE */}

              <div>
                <label className={labelClass}>
                  Language
                </label>

                <input
                  type="text"
                  value={form.language}
                  onChange={(event) =>
                    updateField(
                      'language',
                      event.target.value
                    )
                  }
                  placeholder="Filipino"
                  className={inputClass}
                />
              </div>

              {/* POSTER */}

              <div>
                <label className={labelClass}>
                  Poster URL
                </label>

                <input
                  type="url"
                  value={form.posterUrl}
                  onChange={(event) =>
                    updateField(
                      'posterUrl',
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              {/* TRAILER */}

              <div>
                <label className={labelClass}>
                  Trailer URL
                </label>

                <input
                  type="url"
                  value={form.trailerUrl}
                  onChange={(event) =>
                    updateField(
                      'trailerUrl',
                      event.target.value
                    )
                  }
                  placeholder="https://youtube.com/..."
                  className={inputClass}
                />
              </div>

              {/* WATCH LINK */}

              <div>
                <label className={labelClass}>
                  Watch Link
                </label>

                <input
                  type="url"
                  value={form.watchLink}
                  onChange={(event) =>
                    updateField(
                      'watchLink',
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              {/* GENRES */}

              <div>
                <label className={labelClass}>
                  Genres
                </label>

                {genres.length === 0 ? (
                  <p className="text-xs text-gray-600">
                    No genres available.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => {
                      const genreId =
                        Number(genre.id)

                      const selected =
                        form.genreIds.includes(
                          genreId
                        )

                      return (
                        <button
                          type="button"
                          key={genre.id}
                          onClick={() =>
                            toggleGenre(
                              genreId
                            )
                          }
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            selected
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                          }`}
                        >
                          {genre.name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* ACTIONS */}

              <div className="flex gap-3 pt-3 border-t border-gray-900">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 py-2.5 text-sm rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 text-sm rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : movie
                      ? 'Save Changes'
                      : 'Add Movie'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MovieFormModal