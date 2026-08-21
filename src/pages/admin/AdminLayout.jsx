import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'

function AdminLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />
      <div className="relative z-10 flex-1 p-8 overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout