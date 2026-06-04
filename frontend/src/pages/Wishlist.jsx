import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowRight, Heart, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const totalValue = useMemo(() => {
    return wishlistItems
      .map((item) => Number(item.price) || 0)
      .reduce((sum, value) => sum + value, 0);
  }, [wishlistItems]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FCFAF8] text-[#2A2520]">
      <Navbar />

      <main className="relative isolate px-6 pb-16 pt-28 md:px-12 lg:px-16">
        {/* Decorative Background Blurs */}
        <div className="pointer-events-none absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-[#f0c48b]/35 blur-3xl" />
        <div className="pointer-events-none absolute right-[-100px] top-56 h-72 w-72 rounded-full bg-[#d9c3a7]/35 blur-3xl" />

        {/* Header Section */}
        <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-[30px] border border-[#e8d7bb] bg-[#fff8ef]/90 p-7 shadow-[0_16px_50px_-30px_rgba(48,54,61,0.55)] backdrop-blur">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d8c2a1] bg-[#fff1dd] px-3 py-1 text-xs tracking-[0.18em] text-[#8a6138] uppercase font-medium">
              <Sparkles size={14} />
              Curated Edit
            </p>

            <h1 className="mt-5 text-4xl leading-tight text-[#2A2520] md:text-5xl" style={{ fontFamily: '"Bodoni Moda", "Times New Roman", serif' }}>
              Wishlist Atelier
            </h1>

            <p className="mt-3 max-w-2xl text-[15px] text-[#7A6E62] md:text-base leading-relaxed">
              A private curation of treatments and skin rituals you love. Every saved item lives here until it is ready for checkout.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium">
              <span className="rounded-full border border-[#d7c8af] bg-[#fff8ec] px-5 py-2.5 text-[#7A6E62]">
                {wishlistItems.length} saved picks
              </span>
              <span className="rounded-full border border-[#d7c8af] bg-[#fff8ec] px-5 py-2.5 text-[#7A6E62]">
                Total value: ₹{totalValue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <aside className="flex flex-col justify-center rounded-[30px] border border-[#e2ccb0] bg-[linear-gradient(140deg,#fff4e3_0%,#f8ede1_100%)] p-8 shadow-[0_16px_50px_-30px_rgba(20,31,45,0.45)]">
            <p className="text-xs tracking-[0.16em] text-[#8B7E72] uppercase font-semibold">Style Tip</p>
            <h2 className="mt-2 text-3xl text-[#2A2520]" style={{ fontFamily: '"Bodoni Moda", "Times New Roman", serif' }}>
              Pair & Layer
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#7A6E62]">
              Combine one serum, one moisturizer, and one SPF from your list to build an effortless daytime ritual.
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#2A2520] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#3A332D]"
            >
              Explore categories
              <ArrowRight size={16} />
            </button>
          </aside>
        </section>

        {/* Empty State vs Populated State */}
        {wishlistItems.length === 0 ? (
          <section className="mx-auto mt-10 max-w-7xl">
            <div className="rounded-[34px] border border-dashed border-[#d9c6a8] bg-[#fff7eb] p-12 md:p-20 text-center shadow-[0_18px_48px_-34px_rgba(34,42,50,0.55)]">
              <h2 className="text-3xl md:text-4xl text-[#2A2520]" style={{ fontFamily: '"Bodoni Moda", "Times New Roman", serif' }}>
                Your gallery is waiting
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm md:text-base leading-relaxed text-[#7A6E62]">
                Tap the heart on any product to add it here. Build your personal selection, compare items, and move favorites to cart whenever you are ready.
              </p>

              <button
                onClick={() => navigate("/new-arrivals")}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#2A2520] px-8 py-3.5 text-sm font-medium text-white transition duration-300 hover:bg-[#3A332D]"
              >
                Discover products
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        ) : (
          <section className="mx-auto mt-10 max-w-7xl">
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
              {wishlistItems.map((item, index) => (
                <article
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-[26px] border border-[#e6d6bc] bg-[#fffdf7] p-4 shadow-[0_18px_46px_-34px_rgba(28,33,39,0.65)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_62px_-34px_rgba(27,39,53,0.75)]"
                  style={{ animation: "premiumFadeUp 500ms ease-out both", animationDelay: `${index * 70}ms` }}
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#f9d59d]/35 blur-2xl" />

                  <div className="relative overflow-hidden rounded-2xl bg-[#f4ebe1]">
                    <img
                      src={item.image || "https://via.placeholder.com/600x800?text=Wishlist"}
                      alt={item.name}
                      className="h-60 w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/85 p-2 text-[#c95252] shadow-sm backdrop-blur transition hover:bg-white hover:scale-105"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <Heart className="fill-current" size={18} />
                    </button>
                  </div>

                  <div className="relative mt-5 flex flex-col flex-grow px-2">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8b6a44] uppercase">Wishlist pick</p>
                    <h3 className="mt-2 text-2xl text-[#2A2520] leading-tight" style={{ fontFamily: '"Bodoni Moda", "Times New Roman", serif' }}>
                      {item.name}
                    </h3>
                    <p className="mt-2 flex-grow text-sm leading-relaxed text-[#7A6E62]">{item.desc}</p>

                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-xl font-semibold text-[#8a6038]">₹{Number(item.price || 0).toLocaleString("en-IN")}</p>
                      <span className="rounded-full border border-[#e1cfb3] bg-[#fff3e2] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#8b6a44] uppercase">
                        Limited stock
                      </span>
                    </div>

                    <div className="mt-6 flex gap-3">
                      <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#8a6038] px-4 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[#b67d4a] shadow-md hover:shadow-lg">
                        <ShoppingBag size={18} />
                        Add to cart
                      </button>

                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="inline-flex items-center justify-center rounded-full border border-[#e1cfb3] px-4 text-[#7a5b38] transition duration-300 hover:bg-[#fff4e4] hover:text-[#c95252] hover:border-[#c95252]/30"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Keeps your exact custom animation */}
      <style>{`
        @keyframes premiumFadeUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Footer />
    </div>
  );
}

export default Wishlist;