import Skeleton from './Skeleton'

function HomeSkeleton() {
  return (
    <div>
      {/* Featured + New Movies */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Skeleton className="w-24 h-5 mb-4" />
          <Skeleton className="w-full h-56 sm:h-64 md:h-72 lg:h-80" />
        </div>
        <div>
          <Skeleton className="w-28 h-5 mb-4" />
          <Skeleton className="w-full h-56 sm:h-64 md:h-72 lg:h-80" />
        </div>
      </div>

      {/* Top Rated + Popular */}
      <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Skeleton className="w-24 h-5 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="w-20 h-5 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        </div>
      </div>

      {/* All Movies */}
      <Skeleton className="w-32 h-7 mb-4" />
      <Skeleton className="w-full h-12 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] w-full" />
        ))}
      </div>
    </div>
  )
}

export default HomeSkeleton