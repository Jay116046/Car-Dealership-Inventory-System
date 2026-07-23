import AuthCard from '../components/AuthCard.jsx'

function LoginPage() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white shadow-2xl shadow-slate-300/50">
        <div className="flex h-full flex-col justify-between gap-8">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
              Car Inventory
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              Drive your inventory experience forward.
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-200">
              Browse premium vehicles, check stock instantly, and manage inventory from a modern dashboard designed for fast showroom operations.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black">Live</p>
              <p className="text-sm text-slate-200">Vehicle stock</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black">Fast</p>
              <p className="text-sm text-slate-200">Purchase flow</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-black">Admin</p>
              <p className="text-sm text-slate-200">Protected controls</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] bg-white p-4 shadow-xl shadow-slate-200/70 sm:p-6">
        <AuthCard />
      </div>
    </section>
  )
}

export default LoginPage
