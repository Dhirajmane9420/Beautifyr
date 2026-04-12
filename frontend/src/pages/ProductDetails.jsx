import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Eye, Shield, Share2, Truck } from "lucide-react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { searchIndex } from "../lib/searchIndex";
import { isLiquidProduct, toProductPayload, toProductSlug } from "../lib/productUtils";

function formatINR(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function resolveProductFromSlug(slug) {
  const match = searchIndex.find((item) => item.type === "Product" && toProductSlug(item.title) === slug);
  if (!match) return null;
  return toProductPayload({
    id: match.id,
    name: match.title,
    price: match.price,
    category: match.category,
  });
}

const reviewTemplatesByCategory = {
  cleanser: [
    "Very gentle on skin and removes buildup without making it dry.",
    "Great daily face wash texture and does not leave residue.",
    "Works perfectly for sensitive skin and helps with a clean feel.",
  ],
  serum: [
    "Absorbs quickly and layers well with moisturizer and sunscreen.",
    "Visible glow and smoother texture after regular use.",
    "Lightweight formula with noticeable hydration and brightness.",
  ],
  moisturizer: [
    "Keeps skin hydrated for long hours without feeling heavy.",
    "Barrier feels stronger and skin stays soft through the day.",
    "Excellent finish under makeup and in humid weather.",
  ],
  sunscreen: [
    "No white cast and easy to blend for daily outdoor use.",
    "Comfortable SPF wear with matte, non-sticky finish.",
    "Reliable sun protection and sits well above serum and cream.",
  ],
  default: [
    "Good quality product and performs as described.",
    "Packaging, texture, and effectiveness are all impressive.",
    "Value for money and suitable for regular skincare routine.",
  ],
};

function hashText(input) {
  return String(input || "")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getReviewCategoryKey(category) {
  const value = String(category || "").toLowerCase();
  if (value.includes("clean")) return "cleanser";
  if (value.includes("serum")) return "serum";
  if (value.includes("cream") || value.includes("moist")) return "moisturizer";
  if (value.includes("sun") || value.includes("spf")) return "sunscreen";
  return "default";
}

function buildDynamicReviews(product) {
  const names = ["Aarav S.", "Neha R.", "Ishita K.", "Kabir M.", "Riya P."];
  const seed = hashText(product?.name);
  const key = getReviewCategoryKey(product?.category);
  const templates = reviewTemplatesByCategory[key] || reviewTemplatesByCategory.default;

  return names.slice(0, 3).map((name, index) => {
    const template = templates[(seed + index) % templates.length];
    const rating = 4 + ((seed + index) % 2);
    return {
      id: `r-${toProductSlug(product?.name)}-${index}`,
      name,
      rating,
      text: `${template} (${product?.name})`,
    };
  });
}

export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { addToCart } = useCart();

  const resolved = useMemo(() => {
    const fromState = location.state?.product ? toProductPayload(location.state.product) : null;
    if (fromState) return fromState;
    const fromSlug = resolveProductFromSlug(slug);
    if (fromSlug) return fromSlug;
    return toProductPayload({
      name: "Cetaphil Gentle Cleanser",
      price: 408,
      originalPrice: 429,
      category: "Cleanser",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
      size: "125 ml",
    });
  }, [location.state, slug]);

  const [quantity, setQuantity] = useState(1);
  const [selectedThumb, setSelectedThumb] = useState(0);

  const reviews = useMemo(() => buildDynamicReviews(resolved), [resolved]);

  const relatedProducts = useMemo(() => {
    const sameCategory = searchIndex.filter(
      (item) =>
        item.type === "Product" &&
        item.category === resolved.category &&
        item.title !== resolved.name
    );

    return sameCategory.slice(0, 8).map((item) =>
      toProductPayload({
        id: item.id,
        name: item.title,
        price: item.price,
        category: item.category,
      })
    );
  }, [resolved.category, resolved.name]);

  const images = [
    resolved.image,
    resolved.image,
    resolved.image,
    resolved.image,
    resolved.image,
  ];

  const discountPct = Math.max(
    1,
    Math.round(((resolved.originalPrice - resolved.price) / Math.max(resolved.originalPrice, 1)) * 100)
  );

  const liquidProduct = isLiquidProduct(resolved);

  const addCurrentToCart = () => {
    addToCart({
      id: resolved.id,
      name: resolved.name,
      price: resolved.price,
      originalPrice: resolved.originalPrice,
      image: resolved.image,
      size: liquidProduct ? resolved.size : "",
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <Navbar />

      <main className="mx-auto grid max-w-6xl gap-6 px-5 pb-8 pt-26 lg:grid-cols-[1fr_1fr]">
        <section>
          <div className="rounded-2xl border border-[#edd8bc] bg-white p-3 shadow-sm">
            <img src={images[selectedThumb]} alt={resolved.name} className="h-[420px] w-full rounded-xl object-cover" />
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                onClick={() => setSelectedThumb(index)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border ${
                  selectedThumb === index ? "border-[#8a6038]" : "border-[#ddc4a4]"
                }`}
              >
                <img src={src} alt={`${resolved.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h1 className="text-2xl uppercase tracking-wide text-[#2b2018] md:text-3xl">{resolved.name}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-lg bg-[#b67d4a] px-3 py-2 text-sm text-white">24x7 Support</span>
            <span className="rounded-lg bg-[#b67d4a] px-3 py-2 text-sm text-white">Original Product Guaranteed</span>
          </div>

          <div className="mt-8">
            <p className="text-2xl text-[#2b2018] md:text-3xl">
              {formatINR(resolved.price)} <span className="text-xl text-[#9f9386] line-through">{formatINR(resolved.originalPrice)}</span>
            </p>
            <span className="mt-3 inline-flex rounded-lg bg-[#0f8b4c] px-3 py-1 text-sm font-semibold text-white">SAVE {discountPct}%</span>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-[#b67d4a]"><Truck size={20} /> Get delivery in 3-5 business days.</p>
          <p className="mt-3 text-base text-[#2b2018]">Want it shipped today? Order within: <span className="font-semibold text-[#b67d4a]">04:43:05</span></p>

          {liquidProduct ? (
            <div className="mt-6">
              <label className="mb-2 block text-base">Size</label>
              <select className="w-full rounded-lg border border-[#ddc4a4] bg-white px-4 py-2.5 text-base outline-none">
                <option>{resolved.size || "125 ml"}</option>
                <option>250 ml</option>
                <option>500 ml</option>
              </select>
            </div>
          ) : null}

          <button className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-[#b67d4a]"><Share2 size={16} /> Share</button>

          <div className="mt-7 flex gap-4">
            <div className="inline-flex items-center rounded-xl border border-[#ddc4a4]">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-lg">-</button>
              <span className="px-3 py-2 text-lg">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 text-lg">+</button>
            </div>
            <button
              onClick={addCurrentToCart}
              className="flex-1 rounded-xl border border-[#b67d4a] px-5 py-2 text-base text-[#b67d4a] transition hover:bg-[#fbf2e5]"
            >
              Add to cart
            </button>
          </div>

          <button
            onClick={() => {
              addCurrentToCart();
              navigate("/checkout");
            }}
            className="mt-4 w-full rounded-xl bg-[#b67d4a] px-6 py-2.5 text-base font-semibold text-white transition hover:bg-[#8a6038]"
          >
            Buy it now
          </button>

          <div className="mt-8 border-t border-[#eadbc6] pt-6">
            <h2 className="text-xl font-semibold text-[#8a6038]">Why Shopping with Us</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#eadbc6] bg-white p-4 text-center">
                <Shield className="mx-auto mb-2" size={20} />
                <p className="text-sm">100% Authentic Products</p>
              </div>
              <div className="rounded-xl border border-[#eadbc6] bg-white p-4 text-center">
                <Truck className="mx-auto mb-2" size={20} />
                <p className="text-sm">Easy Return & Replacement</p>
              </div>
              <div className="rounded-xl border border-[#eadbc6] bg-white p-4 text-center">
                <Eye className="mx-auto mb-2" size={20} />
                <p className="text-sm">Cash on Delivery Available</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="mx-auto max-w-6xl px-5 pb-6">
        <div className="rounded-2xl border border-[#eadbc6] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#8a6038]">Customer Reviews</h2>
            <p className="text-sm text-[#6e5947]">Average rating: 4.8/5</p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-xl border border-[#edd8bc] bg-[#fffaf4] p-4">
                <p className="text-sm font-semibold text-[#2b2018]">{review.name}</p>
                <p className="mt-1 text-xs text-[#8a6038]">Rating: {review.rating}/5</p>
                <p className="mt-3 text-sm leading-6 text-[#6e5947]">{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14">
        <div className="rounded-2xl border border-[#eadbc6] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#8a6038]">Related Products</h2>
          <p className="mt-2 text-sm text-[#6e5947]">Similar products you may like from {resolved.category}</p>

          {relatedProducts.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-[#ddc4a4] bg-[#fffaf4] p-5 text-sm text-[#6e5947]">
              No related items found for this product yet.
            </div>
          ) : (
            <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
              {relatedProducts.map((product) => (
                <article
                  key={product.id}
                  onClick={() =>
                    navigate(`/product/${toProductSlug(product.name)}`, {
                      state: { product },
                    })
                  }
                  className="w-56 shrink-0 cursor-pointer rounded-xl border border-[#edd8bc] bg-[#fffaf4] p-3 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img src={product.image} alt={product.name} className="h-32 w-full rounded-lg object-cover" />
                  <p className="mt-3 line-clamp-2 text-sm font-semibold text-[#2b2018]">{product.name}</p>
                  <p className="mt-1 text-xs text-[#8a6038]">{product.category}</p>
                  <p className="mt-2 text-sm font-semibold text-[#2b2018]">{formatINR(product.price)}</p>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                      });
                    }}
                    className="mt-3 w-full rounded-lg border border-[#b67d4a] py-2 text-sm font-semibold text-[#8a6038] transition hover:bg-[#fbf2e5]"
                  >
                    Add to cart
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mt-10 bg-[#fff7ee] px-6 py-12 sm:mt-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-4">
          <div>
            <h3 className="text-2xl font-bold text-[#7a522f] sm:text-3xl">
              Clinical Sanctuary
            </h3>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-gray-500 sm:mt-6 sm:text-lg">
              Dermatologist-formulated skincare that respects your biology and
              enhances your natural beauty.
            </p>

            <div className="mt-6 flex items-center gap-5 text-2xl text-[#8a6038] sm:mt-8 sm:text-3xl">
              <span>🌐</span>
              <span>@</span>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-[#7a522f] sm:text-2xl">
              Products
            </h4>
            <ul className="mt-4 space-y-3 text-base text-gray-500 sm:mt-6 sm:space-y-4 sm:text-lg">
              <li>Face Wash</li>
              <li>Serums</li>
              <li>Moisturizers</li>
              <li>Sunscreens</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-[#7a522f] sm:text-2xl">
              Support
            </h4>
            <ul className="mt-4 space-y-3 text-base text-gray-500 sm:mt-6 sm:space-y-4 sm:text-lg">
              <li>Contact Support</li>
              <li>Shipping & Returns</li>
              <li>FAQs</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-[#7a522f] sm:text-2xl">
              Newsletter
            </h4>
            <p className="mt-4 text-base leading-relaxed text-gray-500 sm:mt-6 sm:text-lg">
              The latest in skin science, delivered to your inbox.
            </p>

            <input
              type="email"
              placeholder="Email"
              className="mt-6 w-full rounded-2xl border border-gray-100 bg-white px-5 py-3.5 text-base text-gray-700 shadow-sm outline-none sm:mt-8 sm:py-4 sm:text-lg"
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-gray-200 pt-8 text-center text-xs text-gray-400 sm:mt-16 sm:text-sm md:flex-row md:text-left">
          <p>© 2024 Clinical Sanctuary. Dermatologist Recommended.</p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 md:justify-end">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </div>
  );
}
