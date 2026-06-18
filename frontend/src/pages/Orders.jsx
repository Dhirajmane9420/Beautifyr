import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDown,
  Calendar,
  ChevronDown,
  Clock,
  Copy,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { fetchOrders } from "../lib/ordersApi";

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_COLORS = {
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Shipped: "bg-purple-100 text-purple-700 border-purple-200",
  "Out for Delivery": "bg-amber-100 text-amber-700 border-amber-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const ORDERS_STORAGE_KEY = "actshiine_orders_v1";

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

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order._id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const statusMap = {
  processing: "Confirmed",
  packed: "Shipped",
  shipped: "Out for Delivery",
  delivered: "Delivered",
};

const displayStatus =
  statusMap[order.status] ||
  "Confirmed";

const statusClass =
  STATUS_COLORS[displayStatus];
  const firstItem = order.items?.[0];
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e2d3bd] bg-white shadow-sm transition hover:shadow-md">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-2 bg-gradient-to-r from-[#fcf5ec] to-[#f8efe2] px-3 py-3 text-left sm:gap-4 sm:px-5 sm:py-4"
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8a6038]/10 sm:h-10 sm:w-10">
            <ShoppingBag size={16} className="text-[#8a6038] sm:hidden" />
            <ShoppingBag size={18} className="hidden text-[#8a6038] sm:block" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-[#8a775f] sm:text-xs">
              <Calendar size={10} className="-mt-0.5 mr-0.5 inline sm:hidden" />
              <Calendar size={12} className="-mt-0.5 mr-1 hidden sm:inline" />
              {formatDate(order.date)} at {formatTime(order.date)}
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold text-[#2b2018] sm:text-sm">
              {firstItem?.title}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <span
            className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:text-xs ${statusClass}`}
          >
            {displayStatus}
          </span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-[#8a775f] transition-transform sm:size-[18px] ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Body (collapsible) */}
      {expanded && (
        <div className="border-t border-[#eee3d5] p-4 sm:p-5">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            {/* Product Image + Details */}
            <div className="flex gap-3 sm:gap-4">
              <img
                src={firstItem?.imageUrl}
                alt={firstItem?.title}
                className="h-20 w-16 shrink-0 rounded-xl border border-[#eee3d5] object-cover sm:h-24 sm:w-20"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#2b2018] sm:text-sm">
                  {firstItem?.title}
                </p>
                {firstItem?.size && (
                  <p className="text-[10px] text-[#8a775f] sm:text-xs">
                    Size: {firstItem.size}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-[#8a775f] sm:text-xs">
                 Qty: {firstItem?.quantity || 1}
                </p>
                <p className="mt-1 text-base font-bold text-[#2b2018] sm:mt-2 sm:text-lg">
                  {formatINR(firstItem?.price || 0)}
                  {firstItem?.originalPrice > firstItem?.price && (
                    <span className="ml-1 text-[10px] text-[#9c8f82] line-through sm:ml-2 sm:text-sm">
                      {formatINR(firstItem?.originalPrice || 0)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
              {/* Order ID */}
              <div className="flex items-center justify-between">
                <span className="text-[#8a775f]">Order ID</span>
                <button
                  onClick={handleCopyId}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#dcc8aa] px-2 py-0.5 text-[10px] text-[#8a6038] transition hover:bg-[#f9efe2] sm:text-xs"
                >
                  <Copy size={10} className="sm:size-[12px]" />
                  {copied ? "Copied!" : order._id.slice(0, 12) + "..."}
                </button>
              </div>
              
               {/* PAYMENT METHOD */}
  <div className="flex items-center justify-between">
    <span className="text-[#8a775f]">
      Payment Method
    </span>

    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        order.paymentMethod === "cod"
          ? "bg-orange-100 text-orange-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {order.paymentMethod === "cod"
        ? "CASH ON DELIVERY"
        : "PAID ONLINE"}
    </span>
  </div>


              {/* Delivery */}
              <div className="flex items-center gap-1.5 text-[#6e5947] sm:gap-2">
                <Truck
                  size={12}
                  className="shrink-0 text-[#8a6038] sm:size-[14px]"
                />
                <span className="truncate">
                  {order.courier?.name || "Standard"} —{" "}
                  {order.courier?.eta || "3-5 days"}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-1.5 text-[#6e5947] sm:gap-2">
                <MapPin
                  size={12}
                  className="mt-0.5 shrink-0 text-[#8a6038] sm:size-[14px]"
                />
                <span className="leading-snug">
                  {order.address?.fullName}, {order.address?.line1}
                  {order.address?.line2 ? ", " + order.address.line2 : ""},{" "}
                  {order.address?.city}, {order.address?.state} —{" "}
                  {order.address?.pincode}
                </span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-4 rounded-xl border border-[#eee3d5] bg-[#fcf9f5] p-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#6e5947]">
                <span>Subtotal ({order.quantity} item)</span>
                <span>{formatINR(order.subtotal || 0)}</span>
              </div>
              {false  && (
                <div className="flex justify-between">
                  <span className="text-[#6e5947]">Discount</span>
                  <span className="text-green-600">
                    −{formatINR(order.totals.discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#6e5947]">
                <span>Delivery ({order.courier?.name || "Standard"})</span>
                <span>
                  <span className="text-green-600">FREE</span>
                </span>
              </div>
              <div className="flex justify-between text-[#6e5947]">
                <span>Platform Fee</span>
                <span>{formatINR(order.deliveryFee || 0)}</span>
              </div>
            </div>
            <div className="mt-2 border-t border-dashed border-[#dcc8aa] pt-2">
              <div className="flex justify-between text-base font-bold text-[#2b2018]">
                <span>Total</span>
                <span>{formatINR(order.totalAmount || 0)}</span>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-xs text-[#8a775f]">
              <Clock size={12} />
              <span>
                Ordered on {formatDate(order.createdAt)}
                {formatTime(order.createdAt)} at {formatTime(order.createdAt)}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                <div className="h-2 w-2 rounded-full bg-green-600" />
              </div>
              <span className="text-xs font-medium text-green-700">
                Order Confirmed
              </span>
              <ArrowDown size={12} className="text-[#dcc8aa]" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                <div className="h-2 w-2 rounded-full bg-gray-300" />
              </div>
              <span className="text-xs text-[#8a775f]">Shipped</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase();
    return orders.filter(
      (o) =>
        o._id?.toLowerCase().includes(q) ||
        o.items?.some((item) => item.title?.toLowerCase().includes(q)) ||
        o.status?.toLowerCase().includes(q),
    );
  }, [orders, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fff7ee]">
        <div className="text-[#8a6038]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <div className="relative flex min-h-screen w-full flex-col">
        <Navbar />

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8a6038]/10">
                <Package size={24} className="text-[#8a6038]" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#2b2018]">
                  My Orders
                </h1>
                <p className="text-sm text-[#8a775f]">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}{" "}
                  placed
                </p>
              </div>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="mb-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b8a692]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID, product name, or status..."
                className="w-full rounded-xl border border-[#dcc8aa] bg-white py-3 pl-10 pr-4 text-sm text-[#2b2018] outline-none transition placeholder:text-[#b8a692] focus:border-[#8a6038] focus:ring-1 focus:ring-[#8a6038]/30"
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-8">
                <Package
                  className="text-[#d3b48f]"
                  size={80}
                  strokeWidth={1.2}
                />
              </div>
              {searchQuery ? (
                <>
                  <h2 className="mb-2 text-xl font-bold">No matching orders</h2>
                  <p className="mb-6 max-w-xs text-sm text-[#6e5947]">
                    Try a different search term or clear the filter.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="rounded-xl bg-[#8a6038] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a522f]"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <h2 className="mb-2 text-xl font-bold">No orders yet</h2>
                  <p className="mb-6 max-w-xs text-sm text-[#6e5947]">
                    Your orders will appear here once you make a purchase.
                  </p>
                  <button
                    onClick={() => navigate("/categories")}
                    className="rounded-xl bg-[#8a6038] px-8 py-3 font-semibold text-white shadow-[0_8px_24px_rgba(138,96,56,0.22)] transition hover:bg-[#7a522f]"
                  >
                    Start Shopping
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
