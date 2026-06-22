import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  Package,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchDeliveryDetails } from "../lib/ordersApi";
import { fetchCatalogCategories } from "../lib/catalogApi";
import { fetchPageOverrides, savePageOverride, uploadPageOverrideImage } from "../lib/siteOverridesApi";

const normalizeCategoryName = (name = "") => {
  const trimmed = String(name || "").trim();
  const key = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (["clenser", "clensers", "cleanser", "cleansers"].includes(key)) {
    return "Cleansers";
  }

  return trimmed;
};

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

function MetricCard({ icon: Icon, label, value, hint }) {
  const MetricIcon = Icon;

  return (
    <div className="rounded-2xl border border-[#D4B896]/40 bg-white/75 p-5 shadow-lg backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7359]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-[#2A2520]">{value}</p>
        </div>
        <div className="rounded-2xl border border-[#D4B896]/30 bg-[#f8efe2] p-3 text-[#8a6038]">
          <MetricIcon className="h-5 w-5" />
        </div>
      </div>
      {hint ? <p className="mt-3 text-sm text-[#7A6E62]">{hint}</p> : null}
    </div>
  );
}

export default function AdminDeliveryDetails() {
  const [categories, setCategories] = useState([]);
  const [homepageCategories, setHomepageCategories] = useState([
    { category: "", imageUrl: "" },
    { category: "", imageUrl: "" },
    { category: "", imageUrl: "" },
    { category: "", imageUrl: "" },
  ]);
  const [isSavingCategories, setIsSavingCategories] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const viewMode = location.pathname.endsWith("/top-products")
    ? "top-products"
    : location.pathname.endsWith("/orders")
      ? "orders"
      : "dashboard";
  const isFullProductsPage = viewMode === "top-products";
  const isFullOrdersPage = viewMode === "orders";

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError("");
        const [payload, cats, overrides] = await Promise.all([
          fetchDeliveryDetails(),
          fetchCatalogCategories(),
          fetchPageOverrides("home"),
        ]);

        if (!isMounted) return;
        setData(payload);
        setCategories(cats);

        // Parse category slots from overrides
        const initialCategories = [
          { category: "", imageUrl: "" },
          { category: "", imageUrl: "" },
          { category: "", imageUrl: "" },
          { category: "", imageUrl: "" },
        ];
        overrides.forEach((override) => {
          const match = override.key.match(/^home\.category_(\d)_(name|image)$/);
          if (match) {
            const index = parseInt(match[1], 10) - 1;
            const field = match[2] === "name" ? "category" : "imageUrl";
            if (index >= 0 && index < 4) {
              initialCategories[index][field] = override.value;
            }
          }
        });
        setHomepageCategories(initialCategories);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load delivery details.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = data?.summary || {};

  const visibleProducts = useMemo(() => {
    const topProducts = data?.topProducts || [];
    return isFullProductsPage ? topProducts : topProducts.slice(0, 5);
  }, [isFullProductsPage, data]);

  const visibleOrders = useMemo(() => {
    const orders = data?.orders || [];
    return isFullOrdersPage ? orders : orders.slice(0, 4);
  }, [isFullOrdersPage, data]);

  const handleSaveHomepageCategories = async () => {
    try {
      setIsSavingCategories(true);
      for (let i = 0; i < 4; i++) {
        const slot = homepageCategories[i];
        await savePageOverride({
          page: "home",
          key: `home.category_${i + 1}_name`,
          kind: "text",
          value: slot.category || "",
        });
        await savePageOverride({
          page: "home",
          key: `home.category_${i + 1}_image`,
          kind: "image",
          value: slot.imageUrl || "",
        });
      }
      alert("Homepage categories updated successfully!");
    } catch (err) {
      alert("Failed to update homepage categories: " + err.message);
    } finally {
      setIsSavingCategories(false);
    }
  };

  const handleUploadCategoryHero = async (index, file) => {
    if (!file) return;
    try {
      const uploadedUrl = await uploadPageOverrideImage(file);
      setHomepageCategories((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], imageUrl: uploadedUrl };
        return next;
      });
    } catch (err) {
      alert("Failed to upload category hero image: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1ec] text-[#2A2520] selection:bg-[#C8A97E] selection:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:px-16 lg:px-28">
        <section className="relative overflow-hidden rounded-4xl border border-[#D4B896]/30 bg-white/75 p-6 shadow-xl backdrop-blur-xl sm:p-8">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#C8A97E]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#D4B896]/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4B896]/35 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7359] shadow-sm">
                <Truck className="h-4 w-4" /> Delivery Details
              </div>
              <h1 className="text-4xl font-light tracking-tight text-[#1d1712] sm:text-5xl lg:text-6xl">
                Admin order and delivery control
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#7A6E62] sm:text-lg">
                Track how many customers are registered, what products were
                ordered, and which products are selling best in a single
                dashboard.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                icon={Users}
                label="Users logged"
                value={summary.usersCount ?? 0}
                hint="Registered accounts visible to the platform."
              />
              <MetricCard
                icon={ShoppingBag}
                label="Orders placed"
                value={summary.ordersCount ?? 0}
                hint="Every confirmed checkout stored for admin review."
              />
              <MetricCard
                icon={Package}
                label="Items ordered"
                value={summary.requestedProductsCount ?? 0}
                hint="Total quantity of products requested across orders."
              />
              <MetricCard
                icon={BarChart3}
                label="Revenue"
                value={formatCurrency(summary.totalRevenue || 0)}
                hint="Combined order value including delivery fee."
              />
            </div>
          </div>
        </section>
        <section className="mb-8 rounded-3xl border border-[#D4B896]/30 bg-white p-6 shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[#2A2520]">
              Homepage Categories & Hero Images
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Select 4 categories to highlight on the homepage and assign a beautiful hero image for each.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {homepageCategories.map((slot, index) => (
              <div key={index} className="rounded-2xl border border-stone-200 bg-stone-50/50 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8b7359]">
                    Slot {index + 1}
                  </span>
                  {slot.imageUrl && (
                    <img
                      src={slot.imageUrl}
                      alt={`Slot ${index + 1} Preview`}
                      className="h-10 w-16 rounded border border-stone-200 object-cover"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Category Name
                  </label>
                  <select
                    value={slot.category}
                    onChange={(e) => {
                      const next = [...homepageCategories];
                      next[index].category = e.target.value;
                      setHomepageCategories(next);
                    }}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-[#C8A97E]/20 focus:border-[#C8A97E]"
                  >
                    <option value="">Select Category</option>
                    {[...new Set(categories.map(c => normalizeCategoryName(c.name)))].filter(Boolean).map((catName) => (
                      <option key={catName} value={catName}>
                        {catName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                    Hero Image
                  </label>
                  <input
                    type="text"
                    value={slot.imageUrl}
                    onChange={(e) => {
                      const next = [...homepageCategories];
                      next[index].imageUrl = e.target.value;
                      setHomepageCategories(next);
                    }}
                    placeholder="Image URL"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#C8A97E]/20 focus:border-[#C8A97E]"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadCategoryHero(index, e.target.files?.[0])}
                    className="text-xs text-stone-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#C8A97E]/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#8a6038] cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveHomepageCategories}
              disabled={isSavingCategories}
              className="px-6 py-3 rounded-xl bg-[#8b5e3c] hover:bg-[#764f32] text-white text-sm font-semibold transition shadow-md shadow-[#8b5e3c]/20 disabled:opacity-50"
            >
              {isSavingCategories ? "Saving settings..." : "Save Homepage Categories"}
            </button>
          </div>
        </section>
        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#d9c8b0] bg-white/70 px-6 py-12 text-center text-sm text-[#7A6E62] shadow-sm">
            Loading delivery data...
          </div>
        ) : (
          <div
            className={`mt-8 grid gap-8 ${viewMode === "dashboard" ? "xl:grid-cols-[1.15fr_0.85fr]" : ""}`}
          >
            {isFullOrdersPage ? null : (
              <section className="rounded-4xl border border-[#D4B896]/30 bg-white/75 p-5 shadow-xl backdrop-blur-xl sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7359]">
                      Top selling products
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-[#2A2520]">
                      {isFullProductsPage
                        ? "All products ordered from highest to lowest"
                        : "Products ordered from highest to lowest"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        isFullProductsPage
                          ? "/admin/delivery-details"
                          : "/admin/delivery-details/top-products",
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-[#f8efe2] px-4 py-2 text-xs font-semibold text-[#8a6038] transition hover:bg-[#f1e0c7]"
                  >
                    {isFullProductsPage ? (
                      <ArrowLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {isFullProductsPage ? "Back" : "Show all"}
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#ead8c0] bg-white">
                  <div className="grid grid-cols-[0.6fr_2.2fr_1fr_1fr_1fr] gap-3 border-b border-[#ead8c0] bg-[#fbf4ea] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#8b7359]">
                    <span>Rank</span>
                    <span>Product</span>
                    <span>Sold</span>
                    <span>Rating</span>
                    <span>Price</span>
                  </div>

                  <div className="divide-y divide-[#f1e5d4]">
                    {visibleProducts.length > 0 ? (
                      visibleProducts.map((product, index) => (
                        <div
                          key={`${product.productId}-${product.title}`}
                          className="grid grid-cols-[0.6fr_2.2fr_1fr_1fr_1fr] gap-3 px-4 py-4 text-sm"
                        >
                          <div className="font-semibold text-[#8a6038]">
                            #{index + 1}
                          </div>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl || "/hero.jpg"}
                              alt={product.title}
                              className="h-12 w-12 rounded-xl border border-[#ead8c0] object-cover"
                            />
                            <div>
                              <p className="font-semibold text-[#2A2520]">
                                {product.title}
                              </p>
                              <p className="text-xs text-[#7A6E62]">
                                {product.category || "Skincare"}
                              </p>
                            </div>
                          </div>
                          <div className="font-semibold text-[#2A2520]">
                            {product.soldCount}
                          </div>
                          <div className="inline-flex items-center gap-1 font-semibold text-[#8a6038]">
                            {product && product.averageRating > 0
                              ? product.averageRating
                              : "N/A"}
                          </div>
                          <div className="font-semibold text-[#2A2520]">
                            {formatCurrency(product.price)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-10 text-center text-sm text-[#7A6E62]">
                        No orders have been placed yet.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {isFullProductsPage ? null : (
              <section className="rounded-4xl border border-[#D4B896]/30 bg-white/75 p-5 shadow-xl backdrop-blur-xl sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8b7359]">
                      Order feed
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-[#2A2520]">
                      {isFullOrdersPage
                        ? "All customer orders"
                        : "Recent customer orders"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        isFullOrdersPage
                          ? "/admin/delivery-details"
                          : "/admin/delivery-details/orders",
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-[#f8efe2] px-4 py-2 text-xs font-semibold text-[#8a6038] transition hover:bg-[#f1e0c7]"
                  >
                    {isFullOrdersPage ? (
                      <ArrowLeft className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {isFullOrdersPage ? "Back" : "Show all"}
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleOrders.length > 0 ? (
                    visibleOrders.map((order) => (
                      <article
                        key={order.id}
                        className="rounded-2xl border border-[#ead8c0] bg-white p-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#2A2520]">
                              {order.customer?.name || "Guest user"}
                            </p>
                            <p className="text-xs text-[#7A6E62]">
                              {order.customer?.email || "No email provided"}
                            </p>
                          </div>
                          <div className="rounded-full bg-[#f8efe2] px-3 py-1 text-xs font-semibold text-[#8a6038]">
                            {String(order.status || "processing").toUpperCase()}
                          </div>
                        </div>

                        <div className="mt-3 space-y-2 text-sm text-[#2A2520]">

  <p className="text-xs text-[#7A6E62]">
    Placed on {formatDate(order.createdAt)}
  </p>

  <p className="font-semibold">
    Order total: {formatCurrency(order.totalAmount)} |
    Items:{" "}
    {order.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    )}
  </p>

  {/* PAYMENT METHOD */}

  <div>
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
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
  <div className="flex items-center gap-2">
  <span className="font-semibold text-[#2A2520]">
    Phone:
  </span>

  <span className="text-[#7A6E62]">
    {order.address?.phone || "N/A"}
  </span>
</div>
  <p className="text-[#7A6E62]">
    {order.address?.line1}, {order.address?.city} -{" "}
    {order.address?.pincode}
  </p>

</div>

                        <div className="mt-4 space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={`${item.productId}-${item.title}`}
                              className="flex items-center gap-3 rounded-xl bg-[#fbf4ea] px-3 py-2.5"
                            >
                              <img
                                src={item.imageUrl || "/hero.jpg"}
                                alt={item.title}
                                className="h-11 w-11 rounded-lg border border-[#ead8c0] object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#2A2520]">
                                  {item.title}
                                </p>
                                <p className="text-xs text-[#7A6E62]">
                                  Qty {item.quantity} •{" "}
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#d9c8b0] bg-[#fbf4ea] px-5 py-10 text-center text-sm text-[#7A6E62]">
                      No delivery records yet. New checkout orders will appear
                      here automatically.
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
