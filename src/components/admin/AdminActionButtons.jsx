function AdminActionButtons({
  children,
  className = '',
}) {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </div>
  )
}

export default AdminActionButtons