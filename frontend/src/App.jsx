import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LogOut, Shield, UserRound } from 'lucide-react'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { fetchVehicles } from './store/vehicleSlice.js'
import { checkAuth, logoutUser } from './store/authSlice.js'

function App() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuth())
    dispatch(fetchVehicles())
  }, [dispatch])

  const handleLogout = async () => {
    await dispatch(logoutUser())
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8 rounded-[28px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900 px-6 py-6 text-white shadow-2xl shadow-slate-300/50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-200">Car Inventory</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">Premium vehicle showroom</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {user ? (
                <>
                  <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    <span className="mr-2 inline-flex"><UserRound size={16} /></span>
                    {user.userName} ({user.roll})
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">Guest Access</div>
              )}
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={user ? <HomePage /> : <Navigate to="/" replace />} />
          <Route path="/admin" element={user?.roll === 'admin' ? <AdminPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {user?.roll === 'admin' && (
          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <Shield size={16} /> Admin mode enabled
          </div>
        )}
      </div>
    </div>
  )
}

export default App
