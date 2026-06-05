import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BadgePercent,
  ChevronLeft,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

const COURIER_PARTNERS = [
  { name: "Delhivery", eta: "3-5 days", cost: 0 },
  { name: "Blue Dart", eta: "2-3 days", cost: 49 },
  { name: "Express (Priority)", eta: "1-2 days", cost: 99 },
];

const ORDERS_STORAGE_KEY = "beautifyr_orders_v1";

function generateOrderId() {
  return "ORD" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function getStoredOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOrder(order) {
  const orders = getStoredOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

const PROFILE_STORAGE_KEY = "beautifyr_profile_v1";

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function BuyNow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const product = location.state?.product;

  // Load saved profile from localStorage
  const savedProfile = useMemo(() => loadProfile(), []);

  const [quantity, setQuantity] = useState(1);
  const [selectedCourier, setSelectedCourier] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState(() => {
    if (savedProfile) {
      return {
        fullName: savedProfile.fullName || user?.name || "",
        phone: savedProfile.phone || "",
        line1: savedProfile.line1 || "",
        line2: savedProfile.line2 || "",
        city: savedProfile.city || "",
        state: savedProfile.state || "",
        pincode: savedProfile.pincode || "",
      };
    }
    return {
      fullName: user?.name || "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    };
  });

  const placeOrder = () => {
    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        size: product.size,
      },
      quantity,
      courier: COURIER_PARTNERS[selectedCourier],
      address: { ...address },
      totals: {
        subtotal,
        discount,
        courierCost,
        platformFee,
        totalAmount,
      },
      status: "Confirmed",
    };
    saveOrder(order);
    setOrderPlaced(true);
  };

  const handleAddressChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const unitPrice = product?.price || 0;
  const originalUnitPrice = product?.originalPrice || unitPrice;
  const subtotal = unitPrice * quantity;
  const originalSubtotal = originalUnitPrice * quantity;
  const discount = Math.max(0, originalSubtotal - subtotal);
  const courierCost = COURIER_PARTNERS[selectedCourier].cost;
  const platformFee = 7;
  const totalAmount = subtotal + courierCost + platformFee;

  const isAddressValid = useMemo(
    () =>
      Boolean(
        address.fullName &&
          address.phone &&
          address.phone.length >= 10 &&
          address.line1 &&
          address.city &&
          address.state &&
          address.pincode &&
          address.pincode.length === 6
      ),
    [address]
  );

  const canPlaceOrder = isAuthenticated && isAddressValid && agreedToTerms && quantity > 0;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-32">
          <Package className="mb-6 text-[#d3b48f]" size={80} strokeWidth={1.2} />
          <h1 className="mb-2 text-2xl font-bold">No product selected</h1>
          <p className="mb-8 text-[#6e5947]">Please select a product to buy.</p>
          <button
            onClick={() => navigate("/cart")}
            className="rounded-xl bg-[#8a6038] px-8 py-3 font-semibold text-white transition hover:bg-[#7a522f]"
          >
            Back to Cart
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping rounded-full bg-green-200/50" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <Package className="text-green-600" size={44} strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Order Placed Successfully!</h1>
          <p className="mb-2 max-w-md text-[#6e5947]">
            Your order for <span className="font-semibold text-[#2b2018]">{product.name}</span> x{quantity} has been placed.
          </p>
          <p className="mb-8 text-sm text-[#8a775f]">
            Estimated delivery: {COURIER_PARTNERS[selectedCourier].eta}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="w-full rounded-xl border border-[#d3b48f] px-8 py-3 font-semibold text-[#8a6038] transition hover:bg-[#f9efe2] sm:w-auto"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/categories")}
              className="w-full rounded-xl bg-[#8a6038] px-8 py-3 font-semibold text-white transition hover:bg-[#7a522f] sm:w-auto"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <div className="relative flex min-h-screen w-full flex-col">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          {/* Back + Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-[#8a775f]">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 transition hover:bg-[#f3e1cc] hover:text-[#7a522f]"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <span className="text-[#dcc8aa]">/</span>
            <span>Cart</span>
            <span className="text-[#dcc8aa]">/</span>
            <span className="font-semibold text-[#8a6038]">Buy Now</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* ─── LEFT COLUMN ─── */}
            <div className="space-y-6">
              {/* Product Summary Card */}
              <section className="overflow-hidden rounded-2xl border border-[#e2d3bd] bg-white shadow-sm">
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#fdf3e8] to-[#f8efe2] px-5 py-3">
                  <Zap size={18} className="text-[#8a6038]" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#8a6038]">
                    Express Buy
                  </h2>
                </div>
                <div className="flex gap-3 p-4 sm:gap-5 sm:p-5">
                  <div className="shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-24 w-20 rounded-xl border border-[#eee3d5] object-cover shadow-sm sm:h-36 sm:w-32"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-base font-bold text-[#2b2018] sm:text-xl">{product.name}</h1>
                    {product.size && (
                      <p className="mt-1 text-xs text-[#8b7a68] sm:text-sm">Size: {product.size}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-baseline gap-2 sm:mt-3 sm:gap-3">
                      <span className="text-xl font-bold text-[#2d251f] sm:text-3xl">
                        {formatINR(unitPrice)}
                      </span>
                      {originalUnitPrice > unitPrice && (
                        <span className="text-sm text-[#9c8f82] line-through sm:text-lg">
                          {formatINR(originalUnitPrice)}
                        </span>
                      )}
                      {originalUnitPrice > unitPrice && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 sm:px-2.5 sm:text-xs">
                          {Math.round(((originalUnitPrice - unitPrice) / originalUnitPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center gap-2 sm:mt-4 sm:gap-3">
                      <span className="text-xs font-medium text-[#6e5947] sm:text-sm">Qty:</span>
                      <div className="flex items-center rounded-lg border border-[#d8c9b0] bg-white">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="flex h-8 w-8 items-center justify-center text-base text-[#8a6038] transition hover:bg-[#f9efe2] sm:h-9 sm:w-9 sm:text-lg"
                        >
                          −
                        </button>
                        <span className="flex h-8 w-9 items-center justify-center border-x border-[#d8c9b0] text-xs font-semibold sm:h-9 sm:w-10 sm:text-sm">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                          className="flex h-8 w-8 items-center justify-center text-base text-[#8a6038] transition hover:bg-[#f9efe2] sm:h-9 sm:w-9 sm:text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="rounded-2xl border border-[#e2d3bd] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-[#8a6038]" />
                  <h2 className="text-base font-bold uppercase tracking-wider text-[#8a6038]">
                    Delivery Address
                  </h2>
                </div>

                {!isAuthenticated && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Please{" "}
                    <button
                      onClick={() => navigate("/login?redirect=/cart")}
                      className="font-semibold text-[#8a6038] underline hover:text-[#7a522f]"
                    >
                      log in
                    </button>{" "}
                    to place an order.
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a775f]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={handleAddressChange("fullName")}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-[#dcc8aa] bg-white px-3 py-2.5 text-sm text-[#2b2018] outline-none transition placeholder:text-[#b8a692] focus:border-[#8a6038] focus:ring-1 focus:ring-[#8a6038]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a775f]">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={handleAddressChange("phone")}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full rounded-lg border border-[#dcc8aa] bg-white px-3 py-2.5 text-sm text-[#2b2018] outline-none transition placeholder:text-[#b8a692] focus:border-[#8a6038] focus:ring-1 focus:ring-[#8a6038]/30"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a775f]">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={address.line1}
                      onChange={handleAddressChange("line1")}
                      placeholder="House / Flat / Street"
                      className="w-full rounded-lg border border-[#dcc8aa] bg-white px-3 py-2.5 text-sm text-[#2b2018] outline-none transition placeholder:text-[#b8a692] focus:border-[#8a6038] focus:ring-1 focus:ring-[#8a6038]/30"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a775f]">
                      Address Line 2 (optional)
                    </label>
                    <input
                      type="text"
                      value={address.line2}
                      onChange={handleAddressChange("line2")}
                      placeholder="Landmark / Area"
                      className="w-full rounded-lg border border-[#dcc8aa] bg-white px-3 py-2.5 text-sm text-[#2b2018] outline-none transition placeholder:text-[#b8a692] focus:border-[#8a6038] focus:ring-1 focus:ring-[#8a6038]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a775f]">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={handleAddressChange("city")}
                      placeholder="Mumbai"
                      className="w-full rounded-lg border border-[#dcc8aa] bg-white px-3 py-2.5 text-sm text-[#2b2018] outline-none transition placeholder:text-[#b8a692] focus:border-[#8a6038] focus:ring-1 focus:ring-[#8a6038]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a775f]">
                      State *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={handleAddressChange("state")}
                      placeholder="Maharashtra"
                      className="w-full rounded-lg border border-[#dcc8aa] bg-white px-3 py-2.5 text-sm text-[#2b2018] outline-none transition placeholder:text-[#b8a692] focus:border-[#8a6038] focus:ring-1 focus:ring-[#8a6038]/30"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#8a775f]">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={handleAddressChange("pincode")}
                      placeholder="400001"
                      maxLength={6}
                      className="w-full rounded-lg border border-[#dcc8aa] bg-white px-3 py-2.5 text-sm text-[#2b2018] outline-none transition placeholder:text-[#b8a692] focus:border-[#8a6038] focus:ring-1 focus:ring-[#8a6038]/30"
                    />
                  </div>
                </div>
              </section>

              {/* Courier Selection */}
              <section className="rounded-2xl border border-[#e2d3bd] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-[#8a6038]" />
                  <h2 className="text-base font-bold uppercase tracking-wider text-[#8a6038]">
                    Delivery Option
                  </h2>
                </div>
                <div className="space-y-3">
                  {COURIER_PARTNERS.map((courier, idx) => (
                    <label
                      key={courier.name}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                        selectedCourier === idx
                          ? "border-[#8a6038] bg-[#fcf5ec]"
                          : "border-[#e2d3bd] bg-white hover:bg-[#faf5ef]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="courier"
                        checked={selectedCourier === idx}
                        onChange={() => setSelectedCourier(idx)}
                        className="h-4 w-4 accent-[#8a6038]"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#2b2018]">{courier.name}</p>
                        <p className="text-xs text-[#8a775f]">Estimated {courier.eta}</p>
                      </div>
                      <span className="text-sm font-semibold text-[#2b2018]">
                        {courier.cost === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          formatINR(courier.cost)
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* ─── RIGHT COLUMN — ORDER SUMMARY ─── */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#e2d3bd] bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-[#8a6038]">
                    Order Summary
                  </h3>

                  {/* Mini product preview */}
                  <div className="mb-4 flex items-center gap-3 rounded-lg bg-[#fcf5ec] p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-10 rounded-md border border-[#eee3d5] object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-tight text-[#2b2018]">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#8a775f]">Qty: {quantity}</p>
                    </div>
                    <span className="text-sm font-bold">{formatINR(subtotal)}</span>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-[#6e5947]">
                      <span>Price ({quantity} item)</span>
                      <span className="font-medium text-[#2b2018]">{formatINR(originalSubtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#6e5947]">Discount</span>
                        <span className="font-medium text-green-700">−{formatINR(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#6e5947]">
                      <span>
                        Delivery ({COURIER_PARTNERS[selectedCourier].name})
                      </span>
                      <span
                        className={`font-medium ${
                          courierCost === 0 ? "text-green-600" : "text-[#2b2018]"
                        }`}
                      >
                        {courierCost === 0 ? "FREE" : formatINR(courierCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#6e5947]">
                      <span>Platform Fee</span>
                      <span className="font-medium text-[#2b2018]">{formatINR(platformFee)}</span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-dashed border-[#e6d8c5]" />

                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#2b2018]">Total Amount</span>
                    <span className="text-2xl font-extrabold text-[#2b2018]">
                      {formatINR(totalAmount)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <p className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                      <BadgePercent size={16} /> You'll save {formatINR(discount)} on this order!
                    </p>
                  )}
                </div>

                {/* Trust badges */}
                <div className="rounded-2xl border border-[#e2d3bd] bg-white p-4 shadow-sm">
                  <div className="space-y-2 text-sm text-[#6e5947]">
                    <p className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-[#8a6038]" /> Safe & secure payments
                    </p>
                    <p className="flex items-center gap-2">
                      <Star size={16} className="text-[#8a6038]" /> 100% Authentic products
                    </p>
                    <p className="flex items-center gap-2">
                      <Package size={16} className="text-[#8a6038]" /> Easy returns within 7 days
                    </p>
                  </div>
                </div>

                {/* Terms + Place Order */}
                <div className="rounded-2xl border border-[#e2d3bd] bg-white p-5 shadow-sm">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#8a6038]"
                    />
                    <span className="text-xs leading-5 text-[#6e5947]">
                      I agree to the{" "}
                      <button className="font-semibold text-[#8a6038] underline">Terms of Use</button>{" "}
                      and{" "}
                      <button className="font-semibold text-[#8a6038] underline">
                        Privacy Policy
                      </button>
                    </span>
                  </label>

                  <button
                    disabled={!canPlaceOrder}
                    onClick={placeOrder}
                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-bold transition ${
                      canPlaceOrder
                        ? "bg-[#8a6038] text-white shadow-[0_8px_24px_rgba(138,96,56,0.25)] hover:bg-[#7a522f] active:scale-[0.98]"
                        : "cursor-not-allowed bg-[#dcc8aa] text-[#8a775f]"
                    }`}
                  >
                    <CreditCard size={18} />
                    Place Order · {formatINR(totalAmount)}
                  </button>

                  {!isAuthenticated && (
                    <p className="mt-3 text-center text-xs text-amber-700">
                      Log in required to place an order
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}