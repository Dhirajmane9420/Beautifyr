function Footer() {
  return (
    <footer className="mt-12 rounded-t-4xl bg-[#1A1816] px-5 pb-12 pt-10 text-[#FCFAF8] sm:rounded-t-[3rem] sm:px-6 sm:pt-12 md:px-12 lg:px-24 lg:pt-14">
      <div className="mb-10 rounded-3xl border border-[#3a3129] bg-[#221c18] p-5 sm:p-6 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#cdb89f]">Need Routine Help?</p>
            <h3 className="mt-2 text-2xl font-light tracking-tight text-white sm:text-3xl">
              Get a personalized skincare ritual in under 60 seconds.
            </h3>
          </div>
          <button className="rounded-full border border-[#cdb89f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e9dbc8] transition hover:bg-[#e9dbc8] hover:text-[#1A1816]">
            Take Skin Quiz
          </button>
        </div>
      </div>

      <div className="mb-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-light tracking-tight">Join the <span className="font-serif italic text-[#D2C5B5]">Sanctuary</span></h2>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/55 sm:text-base">
            Early access to launches, ingredient deep-dives, and members-only ritual sets.
          </p>

          <div className="mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full rounded-full border border-[#3a3129] bg-[#26201b] px-5 py-3 text-sm text-white placeholder:text-white/35 focus:border-[#D2C5B5] focus:outline-none"
            />
            <button className="rounded-full bg-[#D2C5B5] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1816] transition hover:bg-[#e5d7c4]">
              Subscribe
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#3a3129] px-3 py-1 text-[11px] uppercase tracking-wider text-white/60">No Spam</span>
            <span className="rounded-full border border-[#3a3129] px-3 py-1 text-[11px] uppercase tracking-wider text-white/60">Unsubscribe Anytime</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm font-light text-white/65 sm:grid-cols-3 lg:col-span-7">
          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-white">Shop</h4>
            <a href="#" className="transition-colors hover:text-white">All Products</a>
            <a href="#" className="transition-colors hover:text-white">Best Sellers</a>
            <a href="#" className="transition-colors hover:text-white">Routines</a>
            <a href="#" className="transition-colors hover:text-white">Gift Cards</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-white">About</h4>
            <a href="#" className="transition-colors hover:text-white">Our Story</a>
            <a href="#" className="transition-colors hover:text-white">Ingredients</a>
            <a href="#" className="transition-colors hover:text-white">Clinical Trials</a>
            <a href="#" className="transition-colors hover:text-white">Journal</a>
          </div>
          <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-white">Support</h4>
            <a href="#" className="transition-colors hover:text-white">FAQ</a>
            <a href="#" className="transition-colors hover:text-white">Shipping</a>
            <a href="#" className="transition-colors hover:text-white">Returns</a>
            <a href="#" className="transition-colors hover:text-white">Contact</a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-xs font-light text-white/40 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Clinical Sanctuary. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          <a href="#" className="transition-colors hover:text-white">Privacy</a>
          <a href="#" className="transition-colors hover:text-white">Terms</a>
          <a href="#" className="transition-colors hover:text-white">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;