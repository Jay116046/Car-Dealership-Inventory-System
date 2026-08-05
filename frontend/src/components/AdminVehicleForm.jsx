import { useEffect, useState } from 'react'
import ImageUpload from './ui/ImageUpload'

const emptyForm = {
  image: '',
  make: '',
  model: '',
  category: '',
  price: '',
  quantity: '',
}

function AdminVehicleForm({ mode = 'add', initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (mode === 'edit' && initialValue) {
      setForm({
        image: initialValue.image || '',
        make: initialValue.make || '',
        model: initialValue.model || '',
        category: initialValue.category || '',
        price: initialValue.price || '',
        quantity: initialValue.quantity || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [mode, initialValue])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{mode === 'edit' ? 'Update vehicle' : 'Add vehicle'}</h2>
        {mode === 'edit' && (
          <button type="button" onClick={onCancel} className="text-sm font-semibold text-slate-500">
            Cancel
          </button>
        )}
      </div>

      <div className="mb-4">
        <ImageUpload
          variant="light"
          value={form.image}
          onChange={(url) => setForm((current) => ({ ...current, image: url }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Make</span>
          <input name="make" value={form.make} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Toyota" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Model</span>
          <input name="model" value={form.model} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Corolla" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Category</span>
          <input name="category" value={form.category} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Sedan" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Price</span>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="23000" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Quantity</span>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="8" required />
        </label>
      </div>

      <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white">
        {mode === 'edit' ? 'Save changes' : 'Add vehicle'}
      </button>
    </form>
  )
}

export default AdminVehicleForm
