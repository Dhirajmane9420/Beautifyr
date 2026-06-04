import React from "react";
import { useNavigate } from "react-router-dom";
import { BadgePercent, ShieldCheck, ShoppingCart, Trash2, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toProductSlug } from "../lib/productUtils";

const relatedSkincare = {
  serum: [
    { id: "rs1", name: "Niacinamide Refining Serum", price: 899, oldPrice: 1399 },
    { id: "rs2", name: "Hyaluronic Hydration Serum", price: 799, oldPrice: 1299 },
    { id: "rs3", name: "Retinol Renewal Serum", price: 1199, oldPrice: 1699 },
    { id: "rs4", name: "Vitamin C Bright Serum", price: 999, oldPrice: 1499 },
  ],
  sunscreen: [
    { id: "ss1", name: "SPF 50 Matte Sunscreen Gel", price: 699, oldPrice: 1099 },
    { id: "ss2", name: "Hydra Shield Sunscreen Fluid", price: 799, oldPrice: 1199 },
    { id: "ss3", name: "Invisible Daily UV Defense", price: 899, oldPrice: 1299 },
    { id: "ss4", name: "Mineral Sun Veil SPF 50", price: 999, oldPrice: 1499 },
  ],
  moisturizer: [
    { id: "rm1", name: "Barrier Repair Moisturizer", price: 849, oldPrice: 1299 },
    { id: "rm2", name: "Ceramide Comfort Cream", price: 949, oldPrice: 1399 },
    { id: "rm3", name: "Oil-Free Gel Moisturizer", price: 799, oldPrice: 1199 },
    { id: "rm4", name: "Overnight Nourish Cream", price: 1099, oldPrice: 1599 },
  ],
  cleanser: [
    { id: "rc1", name: "Gentle Foaming Cleanser", price: 549, oldPrice: 899 },
    { id: "rc2", name: "Cream-to-Foam Face Wash", price: 629, oldPrice: 999 },
    { id: "rc3", name: "Hydrating Amino Cleanser", price: 699, oldPrice: 1099 },
    { id: "rc4", name: "Pore Balance Gel Cleanser", price: 599, oldPrice: 949 },
  ],
  default: [
    { id: "rd1", name: "Glow Boost Day Cream", price: 899, oldPrice: 1299 },
    { id: "rd2", name: "Peptide Repair Night Serum", price: 1199, oldPrice: 1699 },
    { id: "rd3", name: "Hydration Lock Essence", price: 799, oldPrice: 1199 },
    { id: "rd4", name: "Daily Skin Defense SPF 40", price: 749, oldPrice: 1149 },
  ],
};

function getSimilarSkincareProducts(name) {
  const key = String(name || "").toLowerCase();

  if (key.includes("serum")) return relatedSkincare.serum;
  if (key.includes("sunscreen") || key.includes("spf")) return relatedSkincare.sunscreen;
  if (key.includes("moist") || key.includes("cream")) return relatedSkincare.moisturizer;
  if (key.includes("cleanser") || key.includes("face wash") || key.includes("wash")) {
    return relatedSkincare.cleanser;
  }

  return relatedSkincare.default;
}

const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Cart() {
  const navigate = useNavigate();
  const { items, isEmpty, totals, removeFromCart, updateQuantity, addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const firstItem = items[0];
  const relatedProducts = getSimilarSkincareProducts(firstItem?.name);
  const payableAmount = totals.totalAmount;

  const openProductDetails = (item) => {
    navigate(`/product/${toProductSlug(item?.name)}`, {
      state: {
        product: {
          id: item?.id,
          name: item?.name,
          price: item?.price,
          originalPrice: item?.originalPrice,
          image: item?.image,
          size: item?.size,
        },
      },
    });
  };

  const buyNow = (item) => {
    navigate("/buy-now", {
      state: {
        product: {
          id: item?.id,
          name: item?.name,
          price: item?.price,
          originalPrice: item?.originalPrice,
          image: item?.image,
          size: item?.size,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]" style={{ fontFamily: '"Segoe UI", "Tahoma", sans-serif' }}>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <Navbar />

        {isEmpty ? (
          <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 pt-24 sm:px-6 sm:py-20 sm:pt-28 md:px-12">
            <div className="relative flex w-full max-w-md flex-col items-center text-center">
              <div className="relative mb-8 flex h-36 w-36 items-center justify-center sm:mb-12 sm:h-48 sm:w-48">
                <div className="falling-item delay-1 absolute -top-12 left-1/4">
                  <div className="h-6 w-4 rotate-12 rounded-sm bg-[#8a6038]/20"></div>
                </div>

                <div className="falling-item delay-2 absolute -top-16 right-1/4">
                  <div className="h-5 w-5 rounded-full bg-[#b67d4a]/30"></div>
                </div>

                <div className="falling-item delay-3 absolute -top-8 left-1/2">
                  <div className="h-4 w-8 -rotate-45 rounded-full bg-[#d3b48f]/60"></div>
                </div>

                <div className="relative">
                  <ShoppingCart className="leading-none text-[#d3b48f]" size={80} strokeWidth={1.5} />

                  <div className="absolute bottom-9 left-1/2 -translate-x-1/2">
                    <div className="flex h-10 w-5 flex-col items-center rounded-md border border-[#8a6038]/15 bg-[#f3e1cc] pt-1 shadow-sm">
                      <div className="mb-1 h-1 w-2 rounded-full bg-[#8a6038]/25"></div>
                    </div>
                  </div>
                </div>
              </div>

              {!isAuthenticated ? (
                <>
                  <div className="mb-10 space-y-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#2b2018] md:text-4xl">Missing Cart items?</h1>

                    <p className="mx-auto max-w-[280px] text-sm font-medium leading-relaxed text-[#6e5947]">
                      Log in to see items you've previously added and continue your curation.
                    </p>
                  </div>

                  <div className="flex w-full flex-col items-center gap-4">
                    <button
                      onClick={() => navigate("/login")}
                      className="cta-gradient h-14 w-full max-w-[320px] rounded-xl font-bold text-white shadow-[0_12px_32px_rgba(138,96,56,0.22)] transition-all hover:opacity-95 active:scale-[0.98]"
                    >
                      Login
                    </button>

                    <button
                      onClick={() => navigate("/categories")}
                      className="h-10 px-6 font-semibold text-[#8a6038] transition-colors hover:text-[#7a522f]"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-10 space-y-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#2b2018] md:text-4xl">Your Cart is Empty</h1>

                    <p className="mx-auto max-w-[280px] text-sm font-medium leading-relaxed text-[#6e5947]">
                      Looks like you haven't added anything yet. Browse our collection and find your perfect skincare products.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/categories")}
                    className="cta-gradient h-14 w-full max-w-[320px] rounded-xl font-bold text-white shadow-[0_12px_32px_rgba(138,96,56,0.22)] transition-all hover:opacity-95 active:scale-[0.98]"
                  >
                    Start Shopping
                  </button>
                </>
              )}
            </div>
          </main>
        ) : (
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
              <section className="space-y-4">
                <div className="rounded-xl border border-[#e2d3bd] bg-white p-4 text-sm text-[#6e5947] shadow-sm">
                  From Saved Addresses
                  <button className="float-right rounded-md border border-[#d3b48f] px-4 py-1.5 text-xs text-[#8a6038] transition hover:bg-[#f9efe2]">
                    Enter Delivery Pincode
                  </button>
                </div>

                {items.map((item) => (
                  <article key={item.id} className="rounded-xl border border-[#e2d3bd] bg-white shadow-sm">
                    <div className="p-3 sm:p-5">
                      <p className="mb-2 inline-block rounded-sm bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 sm:mb-3 sm:px-2 sm:text-xs">Hot Deal</p>
                      <div className="flex gap-3 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => openProductDetails(item)}
                          className="shrink-0"
                        >
                          <img src={item.image} alt={item.name} className="h-24 w-20 rounded-md border border-[#eee3d5] object-cover sm:h-28 sm:w-24" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => openProductDetails(item)}
                            className="text-left text-base text-[#2b2018] hover:text-[#8a6038] sm:text-xl"
                          >
                            {item.name}
                          </button>
                          {item.size ? <p className="mt-0.5 text-[11px] text-[#8b7a68] sm:mt-1 sm:text-sm">Size: {item.size}</p> : null}
                          <p className="mt-2 flex flex-wrap items-baseline gap-1.5 text-[#2d251f] sm:mt-3">
                            <span className="text-sm text-green-700 sm:text-xl">83% </span>
                            <span className="text-xs text-[#9c8f82] line-through sm:text-lg">{formatINR(item.originalPrice)}</span>
                            <span className="text-xl font-semibold sm:text-3xl">{formatINR(item.price)}</span>
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:mt-4 sm:gap-3 sm:text-sm">
                            <label className="rounded-md border border-[#d8c9b0] px-1.5 py-0.5 sm:px-2 sm:py-1">
                              Qty:
                              <select
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                className="ml-1 bg-transparent outline-none sm:ml-2"
                              >
                                {[1, 2, 3, 4, 5].map((qty) => (
                                  <option key={qty} value={qty}>{qty}</option>
                                ))}
                              </select>
                            </label>
                            <span className="text-[10px] text-[#6e5947] sm:text-sm">Delivery by Wed Apr 15</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 border-t border-[#eee3d5] text-center text-[11px] font-semibold text-[#6e5947] sm:text-sm">
                      <button className="px-1 py-2.5 transition hover:bg-[#f9efe2] sm:px-3 sm:py-3">Save for later</button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center justify-center gap-0.5 border-x border-[#eee3d5] px-1 py-2.5 transition hover:bg-[#f9efe2] sm:gap-1 sm:px-3 sm:py-3"
                      >
                        <Trash2 size={11} className="sm:size-[14px]" /> Remove
                      </button>
                      <button
                        onClick={() => buyNow(item)}
                        className="flex items-center justify-center gap-0.5 px-1 py-2.5 transition hover:bg-[#f9efe2] sm:gap-1 sm:px-3 sm:py-3"
                      >
                        <Zap size={11} className="sm:size-[14px]" /> Buy now
                      </button>
                    </div>
                  </article>
                ))}

                <section className="rounded-xl border border-[#e2d3bd] bg-white p-4 shadow-sm">
                  <h3 className="mb-4 text-2xl text-[#2b2018]">Items you may have missed</h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((product) => (
                      <div key={product.id} className="rounded-lg border border-[#efe4d4] p-3">
                        <div className="h-32 overflow-hidden rounded-md bg-[#f6eee2]">
                          <img
                            src={firstItem?.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="mt-2 line-clamp-1 text-sm text-[#473628]">{product.name}</p>
                        <p className="text-sm font-semibold text-[#2b2018]">{formatINR(product.price)} <span className="text-[#9c8f82] line-through">{formatINR(product.oldPrice)}</span></p>
                        <button
                          onClick={() =>
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              originalPrice: product.oldPrice,
                              image: firstItem?.image,
                            })
                          }
                          className="mt-2 w-full rounded-md border border-[#d3b48f] py-1.5 text-sm font-semibold text-[#8a6038] transition hover:bg-[#8a6038] hover:text-white"
                        >
                          Add to cart
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </section>

              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-xl border border-[#e2d3bd] bg-white p-3 shadow-sm sm:p-4">
                  <h3 className="text-lg text-[#2b2018] sm:text-2xl">Price Details</h3>
                  <div className="mt-3 space-y-2 text-xs sm:mt-4 sm:space-y-3 sm:text-sm text-[#6e5947]">
                    <div className="flex justify-between"><span>Price ({totals.itemCount} item)</span><span className="font-medium text-[#2b2018]">{formatINR(totals.originalTotal)}</span></div>
                    <div className="flex justify-between"><span>Discount</span><span className="font-medium text-green-700">-{formatINR(totals.discount)}</span></div>
                    <div className="flex justify-between"><span>Platform Fee</span><span className="font-medium text-[#2b2018]">{formatINR(totals.platformFee)}</span></div>
                  </div>
                  <div className="my-3 border-t border-dashed border-[#e6d8c5] sm:my-4" />
                  <div className="flex justify-between text-base font-semibold text-[#2b2018] sm:text-lg">
                    <span>Total Amount</span>
                    <span>{formatINR(payableAmount)}</span>
                  </div>
                  <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-green-100 px-2 py-1.5 text-xs font-semibold text-green-700 sm:mt-4 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
                    <BadgePercent size={14} className="shrink-0 sm:size-[16px]" /> You'll save {formatINR(totals.savings)} on this order!
                  </p>
                </div>

                <div className="rounded-xl border border-[#e2d3bd] bg-white p-3 shadow-sm sm:p-4">
                  <p className="flex items-start gap-1.5 text-xs text-[#6e5947] sm:items-center sm:gap-2 sm:text-sm"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#8a6038] sm:mt-0 sm:size-[18px]" /> Safe and secure payments. Easy returns. 100% Authentic products.</p>
                </div>

                <div className="rounded-xl border border-[#e2d3bd] bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#9c8f82] line-through sm:text-sm">{formatINR(totals.originalTotal)}</p>
                      <p className="text-xl font-semibold text-[#2b2018] sm:text-3xl">{formatINR(payableAmount)}</p>
                    </div>
                    <button
                      onClick={() => navigate("/checkout")}
                      className="shrink-0 rounded-md bg-[#f2c500] px-5 py-2 text-sm font-semibold text-[#2b2018] transition hover:bg-[#e5b900] sm:px-10 sm:py-3 sm:text-lg"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </main>
        )}

        <Footer />
      </div>

      <style>{`
        @keyframes float-down {
          0% { transform: translateY(-80px) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(0) rotate(20deg); opacity: 0; }
        }

        .falling-item {
          animation: float-down 3s infinite ease-in-out;
        }

        .delay-1 { animation-delay: 0.5s; }
        .delay-2 { animation-delay: 1.5s; }
        .delay-3 { animation-delay: 2.2s; }

        .cta-gradient {
          background: linear-gradient(135deg, #7a522f 0%, #8a6038 100%);
        }
      `}</style>
    </div>
  );
}
