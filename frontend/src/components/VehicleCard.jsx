import { ShoppingCart, ShieldCheck } from 'lucide-react'

function VehicleCard({ vehicle, onPurchase, isAdmin, onEdit, onDelete, onRestock }) {
  const quantity = Number(vehicle.quantity || 0)

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          src={vehicle.image || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-800">
            {vehicle.category}
          </span>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            ${Number(vehicle.price || 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">{vehicle.make} {vehicle.model}</h3>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>In stock: {quantity}</span>
          <span className={quantity === 0 ? 'font-semibold text-red-600' : 'font-semibold text-emerald-600'}>
            {quantity === 0 ? 'Out of stock' : 'Available'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onPurchase(vehicle)}
            disabled={quantity <= 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShoppingCart size={18} />
            Purchase
          </button>

          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => onEdit(vehicle)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(vehicle._id)}
                className="rounded-xl border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => onRestock(vehicle)}
                className="rounded-xl border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                <ShieldCheck size={16} className="inline" /> Restock
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default VehicleCard
