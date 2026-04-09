function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-20 text-center">
        <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700">
          Tailwind is ready
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Start building your e-commerce frontend
        </h1>
        <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
          Your React + Vite project is now configured with Tailwind CSS. You can
          build product grids, carts, and checkout pages using utility classes.
        </p>
        <div className="mt-10 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="mt-2 text-sm text-slate-600">Build reusable product cards and category sections.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
            <h2 className="text-lg font-semibold">Cart</h2>
            <p className="mt-2 text-sm text-slate-600">Add quantity controls, totals, and promo code blocks.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
            <h2 className="text-lg font-semibold">Checkout</h2>
            <p className="mt-2 text-sm text-slate-600">Create responsive forms and order summary components.</p>
          </div>
        </div>
        <div className="mt-10 rounded-xl bg-slate-900 px-5 py-3 text-sm text-slate-100">
          Edit <span className="font-mono">src/App.jsx</span> to continue.
        </div>
      </section>
    </main>
  )
}

export default App
