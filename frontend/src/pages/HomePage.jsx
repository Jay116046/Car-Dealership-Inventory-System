import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageSearch, Shield, TrendingUp } from 'lucide-react'
import VehicleCard from '../components/VehicleCard.jsx'
import CheckoutModal from '../components/CheckoutModal.jsx'

function HomePage() {
  const dispatch = useDispatch()
  const { list, error } = useSelector((state) => state.vehicles)
  const { user } = useSelector((state) => state.auth)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const filteredVehicles = useMemo(() => {
    return list.filter((vehicle) => {
      const matchesSearch = `${vehicle.make} ${vehicle.model} ${vehicle.category}`.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || vehicle.category === category
      return matchesSearch && matchesCategory
    })
  }, [list, search, category])

  const categories = useMemo(() => ['all', ...new Set(list.map((vehicle) => vehicle.category).filter(Boolean))], [list])
  const totalStock = list.reduce((sum, vehicle) => sum + Number(vehicle.quantity || 0), 0)
  const avgPrice = list.length ? Math.round(list.reduce((sum, vehicle) => sum + Number(vehicle.price || 0), 0) / list.length) : 0

  const handlePurchase = (vehicle) => {
    if (!user) {
        alert("Please login to purchase");
        return;
    }
    setSelectedVehicle(vehicle);
    setIsCheckoutOpen(true);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] bg-white p-5 shadow-xl shadow-slate-200/70">
          <p className="text-sm font-semibold text-slate-500">Total vehicles</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{list.length}</p>
        </div>
        <div className="rounded-[24px] bg-white p-5 shadow-xl shadow-slate-200/70">
          <p className="text-sm font-semibold text-slate-500">Units in stock</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{totalStock}</p>
        </div>
        <div className="rounded-[24px] bg-white p-5 shadow-xl shadow-slate-200/70">
          <p className="text-sm font-semibold text-slate-500">Average price</p>
          <p className="mt-2 text-3xl font-black text-slate-900">${avgPrice.toLocaleString()}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] bg-white p-5 shadow-xl shadow-slate-200/70">
            <div className="mb-4 flex items-center gap-2 text-blue-700">
              <PackageSearch size={18} />
              <span className="text-sm font-semibold uppercase tracking-[0.3em]">Inventory explorer</span>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Search</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Search by make or model" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                  {categories.map((item) => (
                    <option key={item} value={item}>{item === 'all' ? 'All categories' : item}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {error && <p className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</p>}

          {filteredVehicles.length === 0 ? (
            <div className="rounded-[28px] bg-white p-8 text-center shadow-xl shadow-slate-200/70">
              <p className="text-lg font-bold text-slate-900">No vehicles match your current filters.</p>
              <p className="mt-2 text-slate-600">Try a different search value or category.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} onPurchase={handlePurchase} isAdmin={false} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[28px] bg-white p-5 shadow-xl shadow-slate-200/70">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              <Shield size={16} /> Admin access
            </div>
            <h3 className="text-lg font-bold text-slate-900">Separate admin page</h3>
            <p className="mt-2 text-slate-600">Only admin accounts can open the management workspace for vehicle creation, editing, deletion, and restocking.</p>
            {user?.roll === 'admin' && (
              <Link to="/admin" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white">
                <TrendingUp size={16} /> Open admin dashboard
              </Link>
            )}
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-5 text-white shadow-xl shadow-slate-300/50">
            <h3 className="text-lg font-black">Quick showroom note</h3>
            <p className="mt-2 text-sm text-slate-200">Use the inventory search panel to narrow down vehicles by make, model, and category before purchasing.</p>
          </div>
        </aside>
      </section>
      
      {selectedVehicle && (
          <CheckoutModal
              vehicle={selectedVehicle}
              isOpen={isCheckoutOpen}
              onClose={() => {
                  setIsCheckoutOpen(false);
                  setSelectedVehicle(null);
              }}
          />
      )}
    </div>
  )
}

export default HomePage
