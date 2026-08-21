import { useState } from 'react'

function StarRating({ rating, onRatingChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0)

  const displayRating = hovered || rating

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onRatingChange(star)}
          className={`text-2xl transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'} ${
            star <= displayRating ? 'text-yellow-400' : 'text-gray-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default StarRating