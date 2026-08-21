import { useState, useEffect } from 'react'

function SearchBar({ onSearch, genres, onGenreFilter, selectedGenre, onTypeFilter, selectedType, onLanguageFilter, selectedLanguage, onSortChange, sortBy }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => onSearch(query), 400)
    return () => clearTimeout(timer)
  }, [query])

  const languages = ['Tagalog', 'Bisaya', 'English', 'Ilocano']
  const types = [
    { value: 'MOVIE', label: 'Movies' },
    { value: 'SERIES', label: 'Series' },
    { value: 'DOCUMENTARY', label: 'Documentaries' },
  ]

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded px-4 py-2 border border-transparent hover:border-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
        />
        <select
          value={selectedType || ''}
          onChange={e => onTypeFilter(e.target.value || null)}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-2 border border-transparent hover:border-red-900/50 transition-colors cursor-pointer"
        >
          <option value="">All Types</option>
          {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <select
          value={selectedLanguage || ''}
          onChange={e => onLanguageFilter(e.target.value || null)}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-2 border border-transparent hover:border-red-900/50 transition-colors cursor-pointer"
        >
          <option value="">All Languages</option>
          {languages.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded px-3 py-2 border border-transparent hover:border-red-900/50 transition-colors cursor-pointer"
        >
          <option value="default">Default</option>
          <option value="newest">Newest</option>
          <option value="top-rated">Highest Rated</option>
        </select>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onGenreFilter(null)}
          className={`px-3 py-1 rounded text-sm transition-colors ${!selectedGenre ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          All Genres
        </button>
        {genres.map(g => (
          <button
            key={g.id}
            onClick={() => onGenreFilter(g.id)}
            className={`px-3 py-1 rounded text-sm transition-colors ${selectedGenre === g.id ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchBar