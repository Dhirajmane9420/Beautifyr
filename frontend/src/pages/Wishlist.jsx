import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ArrowRight, Heart, ShoppingBag, Sparkles, Trash2 } from "lucide-react";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Hydrating Serum",
      desc: "Deep hydration for glowing skin",
      price: "₹1,299",
      image: "/src/assets/hero.jpg",
    },
    {
      id: 2,
      name: "Vitamin C Cream",
      desc: "Brightens and evens tone",
      price: "₹999",
      image: "/src/assets/hero.jpg",
    },
    {
      id: 3,
      name: "Niacinamide Booster",
      desc: "Reduces pores & controls oil",
      price: "₹1,199",
      image: "/src/assets/hero.jpg",
    },
    {
      id: 4,
      name: "Sunscreen SPF 50",
      desc: "Lightweight daily protection",
      price: "₹799",
      image: "/src/assets/hero.jpg",
    },
  ]);

  const removeItem = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const totalValue = useMemo(() => {
    return wishlist
      .map((item) => Number(item.price.replace(/[^0-9]/g, "")))
      .reduce((sum, value) => sum + value, 0);
  }, [wishlist]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8f2e8] text-[#1f2b38]">
      <Navbar />

      <main className="relative isolate px-6 pb-16 pt-28 md:px-12 lg:px-16">
        <div className="pointer-events-none absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-[#ffc87a]/35 blur-3xl" />
        <div className="pointer-events-none absolute right-[-100px] top-56 h-72 w-72 rounded-full bg-[#8dc7a4]/30 blur-3xl" />

        <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[30px] border border-[#e8d7bb] bg-[#fff9ef]/85 p-7 shadow-[0_16px_50px_-30px_rgba(48,54,61,0.55)] backdrop-blur">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d8c2a1] bg-[#fff1dd] px-3 py-1 text-xs tracking-[0.18em] text-[#8a6138] uppercase">
              <Sparkles size={14} />
              Curated Edit
            </p>

            <h1 className="mt-4 text-4xl leading-tight text-[#1f2b38] md:text-5xl" style={{ fontFamily: '"Bodoni Moda", "Times New Roman", serif' }}>
              Wishlist Atelier
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] text-[#4e5b69] md:text-base">
              A private curation of treatments and skin rituals you love. Every saved item lives here until it is ready for checkout.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-[#d7c8af] bg-[#fff8ec] px-4 py-2 text-[#5f6875]">
                {wishlist.length} saved picks
              </span>
              <span className="rounded-full border border-[#d7c8af] bg-[#fff8ec] px-4 py-2 text-[#5f6875]">
                Total value: ₹{totalValue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <aside className="rounded-[30px] border border-[#cedecf] bg-[linear-gradient(140deg,#eff9f2_0%,#f7fbff_100%)] p-6 shadow-[0_16px_50px_-30px_rgba(20,31,45,0.45)]">
            <p className="text-xs tracking-[0.16em] text-[#5b7a66] uppercase">Style Tip</p>
            <h2 className="mt-2 text-2xl text-[#294337]" style={{ fontFamily: '"Bodoni Moda", "Times New Roman", serif' }}>
              Pair & Layer
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#4e6356]">
              Combine one serum, one moisturizer, and one SPF from your list to build an effortless daytime ritual.
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#274736] px-5 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-[#1e3a2b]"
            >
              Explore categories
              <ArrowRight size={16} />
            </button>
          </aside>
        </section>

        {wishlist.length === 0 ? (
          <section className="mx-auto mt-10 max-w-7xl">
            <div className="rounded-[34px] border border-dashed border-[#d9c6a8] bg-[#fff7eb] p-14 text-center shadow-[0_18px_48px_-34px_rgba(34,42,50,0.55)]">
              <h2 className="text-3xl text-[#263344]" style={{ fontFamily: '"Bodoni Moda", "Times New Roman", serif' }}>
                Your gallery is waiting
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#637183]">
                Tap the heart on any product to add it here. Build your personal selection, compare items, and move favorites to cart whenever you are ready.
              </p>

              <button
                onClick={() => navigate("/new-arrivals")}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#253b56] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#1f3045]"
              >
                Discover products
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        ) : (
          <section className="mx-auto mt-10 max-w-7xl">
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
              {wishlist.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-[26px] border border-[#e6d6bc] bg-[#fffdf7] p-4 shadow-[0_18px_46px_-34px_rgba(28,33,39,0.65)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_62px_-34px_rgba(27,39,53,0.75)]"
                  style={{ animation: "premiumFadeUp 500ms ease-out both", animationDelay: `${index * 70}ms` }}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f9d59d]/35 blur-2xl" />

                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/85 p-2 text-[#c95252] shadow-md backdrop-blur transition hover:bg-white"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <Heart className="fill-current" size={17} />
                    </button>
                  </div>

                  <div className="relative mt-5">
                    <p className="text-[11px] tracking-[0.18em] text-[#8b6a44] uppercase">Wishlist pick</p>
                    <h3 className="mt-1 text-2xl text-[#1f2b38]" style={{ fontFamily: '"Bodoni Moda", "Times New Roman", serif' }}>
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#5f6f7f]">{item.desc}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xl font-semibold text-[#22364e]">{item.price}</p>
                      <span className="rounded-full bg-[#eff5ff] px-3 py-1 text-xs font-medium text-[#3c5a7d]">
                        Limited stock
                      </span>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#234b6f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1c3d5b]">
                        <ShoppingBag size={16} />
                        Add to cart
                      </button>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center justify-center rounded-full border border-[#e1cfb3] px-3 text-[#7a5b38] transition hover:bg-[#fff4e4]"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <style>{`
        @keyframes premiumFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Wishlist;