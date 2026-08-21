function AdminPageShell({
  title,
  subtitle,
  actions,
  children,
}) {
  return (
    <div className="relative z-10">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">

        {/* TITLE / SUBTITLE */}

        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="text-gray-500 text-sm mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* HEADER ACTIONS */}

        {actions && (
          <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
            {actions}
          </div>
        )}

      </div>

      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      {children}

    </div>
  )
}

export default AdminPageShell