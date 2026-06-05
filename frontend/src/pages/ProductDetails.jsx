import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Eye, Shield, Share2, Truck, Minus, Plus, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { searchIndex } from "../lib/searchIndex";
import { isLiquidProduct, toProductPayload, toProductSlug } from "../lib/productUtils";
import { fetchCatalogProducts } from "../lib/catalogApi";
import heroImage from "../assets/hero.jpg";

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { addToCart } = useCart();

  const [dbProduct, setDbProduct] = useState(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Try to resolve from navigation state first, then searchIndex, then fetch from API
  const resolved = useMemo(() => {
    const fromState = location.state?.product ? toProductPayload(location.state.product) : null;
    if (fromState) return fromState;

    // Try searchIndex
    if (slug) {
      const match = searchIndex.find(
        (item) => item.type === "Product" && toProductSlug(item.title) === slug
      );
      if (match) {
        return toProductPayload({
          id: match.id,
          name: match.title,
          price: match.price,
          category: match.category,
          image: heroImage,
        });
      }
    }

    return null;
  }, [location.state, slug]);

  // Fallback: fetch from API if not resolved from state/index
  useEffect(() => {
    if (resolved) return;

    const fetchProduct = async () => {
      try {
        setLoadingDb(true);
        const allProducts = await fetchCatalogProducts();
        const found = allProducts.find(
          (p) => toProductSlug(p.title) === slug || toProductSlug(p.name) === slug
        );
        if (found) {
          setDbProduct(found);
        } else {
          // Show a generic "not found" state via dbProduct = null
          setDbProduct(null);
        }
      } catch {
        setDbProduct(null);
      } finally {
        setLoadingDb(false);
      }
    };

    fetchProduct();
  }, [slug, resolved]);

  const product = useMemo(() => {
    if (resolved) return resolved;
    if (dbProduct) return toProductPayload(dbProduct);
    return null;
  }, [resolved, dbProduct]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = searchIndex.filter(
      (item) => item.type === "Product" && item.category === product.category && toProductSlug(item.title) !== toProductSlug(product.name)
    );
    return sameCategory.slice(0, 4).map((item) =>
      toProductPayload({
        id: item.id,
        name: item.title,
        price: item.price,
        category: item.category,
        image: heroImage,
      })
    );
  }, [product]);

  const discountPct = product
    ? Math.max(1, Math.round(((product.originalPrice - product.price) / Math.max(product.originalPrice, 1)) * 100))
    : 0;

  const liquidProduct = product ? isLiquidProduct(product) : false;

  const addCurrentToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      size: liquidProduct ? product.size : "",
      quantity,
    });
  };

  // Loading state
  if (loadingDb) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#2A2520]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#C8A97E] border-t-transparent" />
            <p className="text-sm font-light text-[#8B7359]">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-[#2A2520]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
          <div className="mb-6 rounded-full bg-[#C8A97E]/10 p-6">
            <svg className="h-12 w-12 text-[#C8A97E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-[#2A2520] mb-3">Product not found</h2>
          <p className="text-sm text-[#7A6E62] max-w-md mb-8">
            We couldn't find a product matching that URL. Browse our curated collections below.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/categories")}
              className="rounded-full bg-[#2A2520] px-6 py-3 text-xs font-medium uppercase tracking-widest text-white hover:bg-[#3D3530] transition"
            >
              Shop Categories
            </button>
            <button
              onClick={() => navigate("/best-sellers")}
              className="rounded-full border border-[#C8A97E]/40 px-6 py-3 text-xs font-medium uppercase tracking-widest text-[#C8A97E] hover:bg-[#C8A97E]/5 transition"
            >
              Best Sellers
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2A2520]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 pt-24 pb-2">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8B7359]">
          <button onClick={() => navigate("/")} className="hover:text-[#C8A97E] transition">Home</button>
          <ChevronRight size={12} />
          <button onClick={() => navigate("/categories")} className="hover:text-[#C8A97E] transition">Shop</button>
          <ChevronRight size={12} />
          <span className="text-[#C8A97E]">{product.category}</span>
        </nav>
      </div>

      <main className="mx-auto max-w-7xl px-5 pb-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ─── IMAGE SECTION ─── */}
          <section>
            <div className="relative overflow-hidden rounded-3xl bg-[#F7F4F0] border border-[#D4B896]/20 shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="h-125 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {discountPct > 5 && (
                <div className="absolute top-4 left-4 bg-[#C8A97E] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  SAVE {discountPct}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-3">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  className={`h-16 w-16 overflow-hidden rounded-xl border transition ${
                    index === 0 ? "border-[#C8A97E] ring-1 ring-[#C8A97E]/30" : "border-[#D4B896]/30 hover:border-[#C8A97E]/50"
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </section>

          {/* ─── DETAILS SECTION ─── */}
          <section>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8B7359] font-semibold">{product.category}</span>
            <h1 className="mt-2 text-3xl font-light text-[#2A2520] md:text-4xl leading-tight">{product.name}</h1>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-[#2A2520]">{formatINR(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-[#B0A398] line-through">{formatINR(product.originalPrice)}</span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-lg bg-[#C8A97E]/10 px-3 py-2 text-xs font-medium text-[#7f674d] flex items-center gap-1.5">
                <Shield size={14} /> 100% Authentic
              </span>
              <span className="rounded-lg bg-[#C8A97E]/10 px-3 py-2 text-xs font-medium text-[#7f674d] flex items-center gap-1.5">
                <Truck size={14} /> Free Delivery
              </span>
              <span className="rounded-lg bg-[#C8A97E]/10 px-3 py-2 text-xs font-medium text-[#7f674d] flex items-center gap-1.5">
                <Eye size={14} /> Cash on Delivery
              </span>
            </div>

            {/* Delivery info */}
            <div className="mt-6 rounded-2xl border border-[#D4B896]/20 bg-white/50 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-[#2A2520]">
                <Truck size={16} className="text-[#C8A97E]" /> Get delivery in 3-5 business days
              </p>
              <p className="mt-1 text-xs text-[#7A6E62]">Order within the next 4 hours for same-day dispatch</p>
            </div>

            {/* Size selector (for liquid products) */}
            {liquidProduct ? (
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-[#2A2520]">Size</label>
                <div className="flex gap-3">
                  {["125 ml", "250 ml", "500 ml"].map((size) => (
                    <button
                      key={size}
                      className={`rounded-xl border px-5 py-2.5 text-sm transition ${
                        size === (product.size || "125 ml")
                          ? "border-[#C8A97E] bg-[#C8A97E]/10 text-[#7f674d] font-medium"
                          : "border-[#D4B896]/30 text-[#7A6E62] hover:border-[#C8A97E]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quantity & Add to Cart */}
            <div className="mt-8 flex gap-4">
              <div className="inline-flex items-center rounded-xl border border-[#D4B896]/30 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2.5 text-[#2A2520] hover:text-[#C8A97E] transition"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2.5 text-sm font-medium text-[#2A2520] min-w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2.5 text-[#2A2520] hover:text-[#C8A97E] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={addCurrentToCart}
                className="flex-1 rounded-xl bg-[#C8A97E] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#B8976E] hover:shadow-lg"
              >
                Add to Cart — {formatINR(product.price * quantity)}
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={() => {
                addCurrentToCart();
                navigate("/checkout");
              }}
              className="mt-3 w-full rounded-xl border-2 border-[#2A2520] px-6 py-2.5 text-sm font-semibold text-[#2A2520] transition hover:bg-[#2A2520] hover:text-white"
            >
              Buy it now
            </button>

            {/* Share */}
            <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#8B7359] hover:text-[#C8A97E] transition">
              <Share2 size={14} /> Share this product
            </button>

            {/* Why Shop With Us */}
            <div className="mt-8 border-t border-[#D4B896]/20 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8B7359] mb-4">Why Shop With Us</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#D4B896]/20 bg-white p-4 text-center">
                  <Shield className="mx-auto mb-2 text-[#C8A97E]" size={20} />
                  <p className="text-xs text-[#7A6E62]">100% Authentic Products</p>
                </div>
                <div className="rounded-xl border border-[#D4B896]/20 bg-white p-4 text-center">
                  <Truck className="mx-auto mb-2 text-[#C8A97E]" size={20} />
                  <p className="text-xs text-[#7A6E62]">Easy Return & Replacement</p>
                </div>
                <div className="rounded-xl border border-[#D4B896]/20 bg-white p-4 text-center">
                  <Eye className="mx-auto mb-2 text-[#C8A97E]" size={20} />
                  <p className="text-xs text-[#7A6E62]">Cash on Delivery Available</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ─── CUSTOMER REVIEWS ─── */}
      <section className="mx-auto max-w-7xl px-5 pb-10">
        <div className="rounded-3xl border border-[#D4B896]/20 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#2A2520]">Customer Reviews</h2>
            <p className="text-sm text-[#8B7359]">No verified user reviews yet.</p>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-[#D4B896]/30 bg-[#FAFAF8] p-6 text-sm text-[#7A6E62]">
            Reviews will appear here only after real customers submit them.
          </div>
        </div>
      </section>

      {/* ─── RELATED PRODUCTS ─── */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <div className="rounded-3xl border border-[#D4B896]/20 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#2A2520]">Complete Your Routine</h2>
              <p className="mt-1 text-sm text-[#7A6E62]">More from {product.category}</p>
            </div>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#D4B896]/30 bg-[#FAFAF8] p-6 text-center text-sm text-[#7A6E62]">
              No related products found for this category yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <article
                  key={related.id}
                  onClick={() =>
                    navigate(`/product/${toProductSlug(related.name)}`, {
                      state: { product: related },
                    })
                  }
                  className="group cursor-pointer rounded-xl border border-[#D4B896]/20 bg-[#FAFAF8] p-4 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-[#F7F4F0] mb-3">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-sm font-medium text-[#2A2520] line-clamp-1">{related.name}</p>
                  <p className="mt-1 text-xs text-[#8B7359]">{related.category}</p>
                  <p className="mt-2 text-sm font-semibold text-[#C8A97E]">{formatINR(related.price)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: related.id,
                        name: related.name,
                        price: related.price,
                        originalPrice: related.originalPrice,
                        image: related.image,
                      });
                    }}
                    className="mt-3 w-full rounded-lg border border-[#C8A97E]/30 py-2 text-xs font-semibold text-[#7f674d] transition hover:bg-[#C8A97E] hover:text-white"
                  >
                    Add to Cart
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
