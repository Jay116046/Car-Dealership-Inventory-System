import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser, clearAuthError } from '../store/authSlice.js'

function AuthCard() {
  const dispatch = useDispatch()
  const { status, error } = useSelector((state) => state.auth)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(clearAuthError())

    if (mode === 'register') {
      await dispatch(registerUser(form))
      setMode('login')
      setForm({ userName: '', email: '', password: '' })
      return
    }

    await dispatch(loginUser({ email: form.email, password: form.password }))
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
      <div className="mb-6 flex gap-2 rounded-full bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === 'login' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode('register')}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === 'register' ? 'bg-slate-900 text-white' : 'text-slate-600'
          }`}
        >
          Register
        </button>
      </div>

      <div className="mb-4 text-sm text-slate-600">
        {mode === 'login' ? 'Sign in to access your dashboard.' : 'Create a customer account to explore inventory.'}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Username</span>
            <input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              placeholder="Enter username"
              required
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            placeholder="Enter email"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            placeholder="Enter password"
            required
          />
        </label>

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'loading' ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
        </button>
      </form>
    </div>
  )
}

export default AuthCard
