import { useDispatch, useSelector } from 'react-redux'
import { useMemo, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Shield, RefreshCcw, PackageSearch, ListOrdered } from 'lucide-react'
import VehicleCard from '../components/VehicleCard.jsx'
import AdminVehicleForm from '../components/AdminVehicleForm.jsx'
import { addVehicle, deleteVehicle, restockVehicle, updateVehicle } from '../store/vehicleSlice.js'
import { getAllOrders, updateOrderStatus } from '../store/orderSlice.js'

function AdminPage() {
  const dispatch = useDispatch()
  const { list, error } = useSelector((state) => state.vehicles)
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders)
  const { user } = useSelector((state) => state.auth)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [restockAmount, setRestockAmount] = useState(5)
  const [activeTab, setActiveTab] = useState('vehicles')

  const categories = useMemo(() => [...new Set(list.map((vehicle) => vehicle.category).filter(Boolean))], [list])

  useEffect(() => {
      if (activeTab === 'orders') {
          dispatch(getAllOrders())
      }
  }, [activeTab, dispatch])

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

  const handleUpdateOrderStatus = async (orderId, progressStatus) => {
      await dispatch(updateOrderStatus({ orderId, progressStatus }))
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
          <button
              className={`pb-4 px-4 text-sm font-medium border-b-2 ${activeTab === 'vehicles' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('vehicles')}
          >
              <PackageSearch className="inline w-4 h-4 mr-2" />
              Vehicles
          </button>
          <button
              className={`pb-4 px-4 text-sm font-medium border-b-2 ${activeTab === 'orders' ? 'border-slate-900 text-slate-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('orders')}
          >
              <ListOrdered className="inline w-4 h-4 mr-2" />
              Orders History
          </button>
      </div>

      {activeTab === 'vehicles' && (
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
      )}

      {activeTab === 'orders' && (
          <div className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Buyers History</h2>
            {ordersLoading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {order.user?.userName}<br/>
                                        <span className="text-gray-500 text-xs">{order.user?.email}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.vehicle?.make} {order.vehicle?.model}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${order.amount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            value={order.progressStatus}
                                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-1 px-2 border"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Ready for Pickup">Ready for Pickup</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
      )}
    </div>
  )
}

export default AdminPage
