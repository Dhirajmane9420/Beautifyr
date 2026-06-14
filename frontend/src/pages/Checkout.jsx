import React, { useMemo, useState } from "react";
import { Bell, MapPinHouse, PackageCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../lib/ordersApi";
import {
  createPaymentOrder,
  verifyPayment,
} from "../lib/paymentApi";

function formatINR(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function StepHeader({ index, title, active }) {
  return (
    <div
      className={`flex items-center gap-3 border px-4 py-3 ${
        active
          ? "border-[#8a6038] bg-[#8a6038] text-white"
          : "border-[#e4d5be] bg-[#f8efe2] text-[#7a654f]"
      }`}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-sm text-xs font-bold ${
          active ? "bg-white text-[#8a6038]" : "bg-[#efe1cc] text-[#8a6038]"
        }`}
      >
        {index}
      </span>
      <h2 className="text-sm font-semibold uppercase tracking-wide sm:text-base">{title}</h2>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, totals, clearCart } = useCart();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    city: "",
    pincode: "",
  });
  const [showAddressStep, setShowAddressStep] = useState(isAuthenticated);
  const [showSummaryStep, setShowSummaryStep] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  const canContinueAddress = useMemo(
    () => Boolean(address.fullName && address.phone && address.line1 && address.city && address.pincode),
    [address]
  );

  // Extract the real product ID, stripping the composite size suffix
  const getRealProductId = (item) => {
    const raw = item.productId || item.id || "";
    return raw.includes("__") ? raw.split("__")[0] : raw;
  };

  const handlePlaceOrder = async () => {
  if (!canContinueAddress || items.length === 0) {
    return;
  }

  try {
    setIsPlacingOrder(true);
    setOrderMessage("");

    const orderItems = items.map(
      (item) => ({
        productId: getRealProductId(item),
        title: item.name,
        category:
          item.category ||
          "Skincare",
        imageUrl: item.image,
        price: item.price,
        quantity:
          item.quantity,
        size:
          item.size || "",
        sizeVariant:
          item.sizeVariant
            ?.label ||
          item.size ||
          "",
      })
    );

    if (paymentMethod === "cod") {
  const order =
    await placeOrder({
      items: orderItems,
      address,
      paymentMethod: "cod",
    });

  clearCart();

  setOrderMessage(
    `Order placed successfully. Ref: ${String(
      order?._id || ""
    )
      .slice(-6)
      .toUpperCase()}`
  );

  navigate("/orders");

  return;
}

    const razorpayOrder =
      await createPaymentOrder(
        totals.totalAmount
      );

    const options = {
      key:
        import.meta.env
          .VITE_RAZORPAY_KEY_ID,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      order_id:
        razorpayOrder.id,

      name:
        "Clinical Sanctuary",

      description:
        "Order Payment",

      handler:
        async (response) => {
          try {
            const verification =
              await verifyPayment(
                response
              );

            if (
              !verification.success
            ) {
              setOrderMessage(
                "Payment verification failed."
              );
              return;
            }

            const order =
              await placeOrder({
                items:
                  orderItems,

                address,

                paymentMethod:
                  paymentMethod,

                razorpayOrderId:
                  response.razorpay_order_id,

                razorpayPaymentId:
                  response.razorpay_payment_id,
              });

            clearCart();

            setOrderMessage(
              `Order placed successfully. Ref: ${String(
                order?._id || ""
              )
                .slice(-6)
                .toUpperCase()}`
            );

            // Use window.location as fallback — navigate() can fail
            // inside Razorpay's async callback context
            try {
              navigate(
                "/orders"
              );
            } catch {
              window.location.href = "/orders";
            }
          } catch (err) {
            setOrderMessage(
              err.message || "Order failed after payment. Please contact support."
            );
          }
        },

      prefill: {
        name:
          address.fullName,

        contact:
          address.phone,

        email:
          user?.email,
      },

      theme: {
        color:
          "#8a6038",
      },
    };

    const razorpay =
      new window.Razorpay(
        options
      );

    razorpay.open();
  } catch (error) {
    setOrderMessage(
      error.message ||
        "Payment failed."
    );
  } finally {
    setIsPlacingOrder(false);
  }
};

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-26 sm:px-6">
        <section className="overflow-hidden rounded border border-[#e4d5be] bg-white shadow-sm">
          <StepHeader index={1} title="Login or Signup" active={!isAuthenticated} />

          <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 sm:gap-6 sm:px-6 sm:py-6">
            {isAuthenticated ? (
              <div>
                <p className="text-xs text-[#8a775f]">Logged in as</p>
                <p className="mt-1 text-xl font-semibold text-[#2b2018]">{user?.name || "User"}</p>
                <p className="mt-1 text-sm text-[#8a775f]">{user?.email || "Account verified"}</p>
                <button
                  onClick={() => setShowAddressStep(true)}
                  className="mt-4 rounded bg-[#8a6038] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a522f]"
                >
                  CONTINUE
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Enter Email/Mobile number"
                  className="w-full border-b border-[#dcc8aa] bg-transparent px-0 py-2 text-lg text-[#2b2018] outline-none placeholder:text-[#9b8a76]"
                />
                <p className="mt-4 max-w-lg text-sm leading-6 text-[#8a775f]">
                  By continuing, you agree to Clinical Sanctuary's Terms of Use and Privacy Policy.
                </p>
                <button
                  onClick={() => navigate("/login?redirect=/checkout")}
                  className="mt-5 w-full max-w-md rounded bg-[#8a6038] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#7a522f]"
                >
                  CONTINUE
                </button>
              </div>
            )}

            <div>
              <p className="text-lg text-[#6e5947]">Advantages of our secure login</p>
              <ul className="mt-3 space-y-3 text-base text-[#2b2018]">
                <li className="inline-flex items-center gap-2"><Truck size={16} className="text-[#8a6038]" /> Easily Track Orders, Hassle free Returns</li>
                <li className="inline-flex items-center gap-2"><Bell size={16} className="text-[#8a6038]" /> Get Relevant Alerts and Recommendation</li>
                <li className="inline-flex items-center gap-2">Wishlist, Reviews, Ratings and more.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-3 overflow-hidden rounded border border-[#e4d5be] bg-white shadow-sm">
          <StepHeader index={2} title="Delivery Address" active={showAddressStep} />
          {showAddressStep ? (
            <div className="grid gap-3 px-4 py-4 sm:grid-cols-2 sm:px-6 sm:py-5">
              <input
                placeholder="Full Name"
                value={address.fullName}
                onChange={(e) => setAddress((prev) => ({ ...prev, fullName: e.target.value }))}
                className="rounded border border-[#dcc8aa] px-3 py-2.5 text-sm outline-none focus:border-[#8a6038]"
              />
              <input
                placeholder="Phone Number"
                value={address.phone}
                onChange={(e) => setAddress((prev) => ({ ...prev, phone: e.target.value }))}
                className="rounded border border-[#dcc8aa] px-3 py-2.5 text-sm outline-none focus:border-[#8a6038]"
              />
              <input
                placeholder="Address Line"
                value={address.line1}
                onChange={(e) => setAddress((prev) => ({ ...prev, line1: e.target.value }))}
                className="rounded border border-[#dcc8aa] px-3 py-2.5 text-sm outline-none focus:border-[#8a6038] sm:col-span-2"
              />
              <input
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                className="rounded border border-[#dcc8aa] px-3 py-2.5 text-sm outline-none focus:border-[#8a6038]"
              />
              <input
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress((prev) => ({ ...prev, pincode: e.target.value }))}
                className="rounded border border-[#dcc8aa] px-3 py-2.5 text-sm outline-none focus:border-[#8a6038]"
              />

              <button
                disabled={!canContinueAddress}
                onClick={() => {
                  setShowSummaryStep(true);
                  setShowPaymentStep(false);
                }}
                className="mt-1 rounded bg-[#8a6038] px-5 py-2.5 text-sm font-semibold text-white transition enabled:hover:bg-[#7a522f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                USE THIS ADDRESS
              </button>
            </div>
          ) : null}
        </section>

        <section className="mt-3 overflow-hidden rounded border border-[#e4d5be] bg-white shadow-sm">
          <StepHeader index={3} title="Order Summary" active={showSummaryStep} />
          {showSummaryStep ? (
            <div className="px-5 py-5 sm:px-6">
              {items.length === 0 ? (
                <p className="text-sm text-[#8a775f]">Your cart is empty. Add products to continue checkout.</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded border border-[#e8dbc7] px-3 py-2.5">
                      <div className="inline-flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" />
                        <div>
                          <p className="text-sm font-semibold text-[#2b2018]">{item.name}</p>
                          <p className="text-xs text-[#8a775f]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#2b2018]">{formatINR(item.price * item.quantity)}</p>
                    </div>
                  ))}

                  <div className="rounded border border-[#e8dbc7] bg-[#fbf3e8] p-3 text-sm">
                    <div className="flex justify-between"><span>Total</span><span className="font-semibold">{formatINR(totals.totalAmount)}</span></div>
                  </div>

                  <button
                    onClick={() => setShowPaymentStep(true)}
                    className="rounded bg-[#8a6038] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a522f]"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="mt-3 overflow-hidden rounded border border-[#e4d5be] bg-white shadow-sm">
          <StepHeader index={4} title="Payment Options" active={showPaymentStep} />
          {showPaymentStep ? (
            <div className="px-5 py-5 sm:px-6">
              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded border border-[#e8dbc7] px-3 py-2.5 text-sm">
                  <input type="radio" name="payment" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                  <span>UPI / Wallet</span>
                </label>
                <label className="flex items-center gap-3 rounded border border-[#e8dbc7] px-3 py-2.5 text-sm">
                  <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                  <span>Credit / Debit Card</span>
                </label>
                <label className="flex items-center gap-3 rounded border border-[#e8dbc7] px-3 py-2.5 text-sm">
                  <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                  <span>Cash on Delivery</span>
                </label>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#8a775f]">
                <MapPinHouse size={18} /> Delivering to {address.city || "your address"}, {address.pincode || "000000"}
              </div>

              {orderMessage ? (
                <p className="mt-4 rounded border border-[#e8dbc7] bg-[#fbf3e8] px-3 py-2 text-sm text-[#7a654f]">
                  {orderMessage}
                </p>
              ) : null}

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || items.length === 0}
                className="mt-5 inline-flex items-center gap-2 rounded bg-[#8a6038] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a522f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <PackageCheck size={18} />

{isPlacingOrder
  ? "PLACING ORDER..."
  : paymentMethod === "cod"
  ? "PLACE ORDER (COD)"
  : `PAY ${formatINR(
      totals.totalAmount
    )}`}
              </button>
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </div>
  );
}
