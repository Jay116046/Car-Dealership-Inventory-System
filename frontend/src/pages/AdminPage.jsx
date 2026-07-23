import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Shield, RefreshCcw } from 'lucide-react'
import VehicleCard from '../components/VehicleCard.jsx'
import AdminVehicleForm from '../components/AdminVehicleForm.jsx'
import { addVehicle, deleteVehicle, fetchVehicles, restockVehicle, updateVehicle } from '../store/vehicleSlice.js'

function AdminPage() {
  const dispatch = useDispatch()
  const { list, error } = useSelector((state) => state.vehicles)
  const { user } = useSelector((state) => state.auth)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [restockAmount, setRestockAmount] = useState(5)

  const categories = useMemo(() => [...new Set(list.map((vehicle) => vehicle.category).filter(Boolean))], [list])

  if (!user || user.roll !== 'admin') {
    return <Navigate to="/" replace />
  }

  const handleAddVehicle = async (payload) => {
    await dispatch(addVehicle({ ...payload, price: Number(payload.price), quantity: Number(payload.quantity) }))
  }

  const handleUpdateVehicle = async (payload) => {
    await dispatch(updateVehicle({
      id: selectedVehicle._id,
      data: { ...payload, price: Number(payload.price), quantity: Number(payload.quantity) },
    }))
    setSelectedVehicle(null)
  }

  const handleDeleteVehicle = async (vehicleId) => {
    await dispatch(deleteVehicle(vehicleId))
  }

  const handleRestock = async (vehicle) => {
    const amount = Number(restockAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      return
    }
    await dispatch(restockVehicle({ id: vehicle._id, amount }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            <Shield size={16} /> Protected admin workspace
          </div>
          <h2 className="text-2xl font-black text-slate-900">Vehicle management</h2>
          <p className="mt-2 text-slate-600">Create, update, delete, and restock vehicles from this admin-only page.</p>
        </div>

        {error && <p className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {list.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              isAdmin
              onEdit={(item) => setSelectedVehicle(item)}
              onDelete={handleDeleteVehicle}
              onRestock={handleRestock}
              onPurchase={() => {}}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60">
          <AdminVehicleForm
            mode={selectedVehicle ? 'edit' : 'add'}
            initialValue={selectedVehicle}
            onSubmit={selectedVehicle ? handleUpdateVehicle : handleAddVehicle}
            onCancel={() => setSelectedVehicle(null)}
          />
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <RefreshCcw size={18} /> Restock batch size
          </h3>
          <input
            type="number"
            value={restockAmount}
            onChange={(e) => setRestockAmount(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Restock amount"
          />
          <p className="mt-3 text-sm text-slate-600">Use the restock button on a vehicle card to increment quantity by this fixed amount.</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60">
          <h3 className="text-lg font-bold text-slate-900">Categories in inventory</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
