import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function CategoryViewAll() {
  const location = useLocation();
  const title = location.state?.title || "Category";
  const products = location.state?.products || [];

  const maxPrice = Math.max(...products.map((product) => product.price || 0), 0);
  const priceRanges = [
    { key: "all", label: "All Prices", min: 0, max: maxPrice },
    { key: "100-500", label: "Rs100 - Rs500", min: 100, max: 500 },
    { key: "501-1000", label: "Rs501 - Rs1000", min: 501, max: 1000 },
    { key: "1001-1500", label: "Rs1001 - Rs1500", min: 1001, max: 1500 },
    { key: "1501-plus", label: "Rs1501 and above", min: 1501, max: maxPrice || 999999 },
  ];

  const [draftInStockOnly, setDraftInStockOnly] = useState(false);
  const [draftPriceRange, setDraftPriceRange] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  const activePriceRange =
    priceRanges.find((range) => range.key === selectedPriceRange) || priceRanges[0];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const stockMatch = !inStockOnly || product.inStock;
      const priceMatch =
        (product.price || 0) >= activePriceRange.min && (product.price || 0) <= activePriceRange.max;
      return stockMatch && priceMatch;
    });
  }, [products, inStockOnly, activePriceRange.min, activePriceRange.max]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const applyFilters = () => {
    setInStockOnly(draftInStockOnly);
    setSelectedPriceRange(draftPriceRange);
    setHasAppliedFilters(true);
  };

  const resetFilters = () => {
    setDraftInStockOnly(false);
    setDraftPriceRange("all");
    setInStockOnly(false);
    setSelectedPriceRange("all");
    setHasAppliedFilters(false);
  };

  const hasPendingChanges =
    draftInStockOnly !== inStockOnly || draftPriceRange !== selectedPriceRange;

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-28">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{title} - All Products</h1>
            <p className="mt-2 text-sm text-[#6e5947]">Showing {filteredProducts.length} products</p>
          </div>
          <Link
            to="/categories"
            className="rounded-full border border-[#d3b48f] bg-white px-4 py-2 text-xs font-semibold text-[#8a6038] transition hover:bg-[#8a6038] hover:text-white"
          >
            Back to Categories
          </Link>
        </div>

        <section className="mb-8 rounded-2xl border border-[#edd8bc] bg-white/90 p-4 sm:p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide">Filters</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-[#8a6038] hover:underline"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                disabled={!hasPendingChanges}
                className="rounded-full bg-[#8a6038] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#b67d4a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <p className="text-xs font-semibold mb-2">Availability</p>
              <div className="flex items-center justify-between rounded-lg border border-[#edd8bc] bg-[#f9efe2] px-3 py-2 text-xs">
                <span>In Stock Only</span>
                <button
                  type="button"
                  onClick={() => setDraftInStockOnly((current) => !current)}
                  aria-pressed={draftInStockOnly}
                  className={`relative h-6 w-11 rounded-full transition ${
                    draftInStockOnly ? "bg-[#8a6038]" : "bg-[#e9d8c5]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      draftInStockOnly ? "left-5" : "left-0.5"
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold mb-2">Price Range</p>
              <select
                value={draftPriceRange}
                onChange={(event) => setDraftPriceRange(event.target.value)}
                className="w-full rounded-lg border border-[#edd8bc] bg-white px-3 py-2 text-xs text-[#6e5947] outline-none"
              >
                {priceRanges.map((range) => (
                  <option key={range.key} value={range.key}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {hasAppliedFilters && (
              <div className="rounded-lg bg-[#f9efe2] px-3 py-2 text-xs text-[#6e5947] border border-[#edd8bc]">
                Showing {filteredProducts.length} of {products.length} | {inStockOnly ? "In Stock" : "All"} | {activePriceRange.label}
              </div>
            )}
          </div>
        </section>

        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d8cec4] bg-[#f6f1eb] px-5 py-10 text-center text-sm text-[#6f6258]">
            No products to display. Please go back and select a category section again.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product._id || `${product.title}-${index}`}
                title={product.title}
                price={`Rs ${product.price}`}
                image={product.imageUrl}
                inStock={product.inStock}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ title, price, image, inStock }) {
  const numericPrice = Number(String(price).replace(/[^0-9]/g, "")) || 0;
  const discountPct = Math.max(4, numericPrice % 37);

  return (
    <div className="rounded-xl border border-[#edd8bc] bg-white p-4 transition hover:shadow-xl">
      <div className="relative overflow-hidden rounded-md bg-white">
        <span className="absolute right-3 top-3 rounded-full bg-[#b67d4a] px-3 py-1 text-[11px] font-semibold text-white">
          {discountPct}% OFF
        </span>
        <img src={image} alt={title} className="h-64 w-full object-cover" />
      </div>

      <p className={`mt-3 text-xs font-semibold ${inStock ? "text-green-700" : "text-red-600"}`}>
        {inStock ? "In Stock" : "Out of Stock"}
      </p>
      <h3 className="mt-3 text-sm font-bold text-[#2b2018]">{title}</h3>
      <p className="font-bold text-[#8a6038]">
        {price} <span className="text-[#8f8f8f] line-through">Rs {Math.round(numericPrice * 1.3)}</span>
      </p>

      <button className="mt-4 w-full rounded-lg bg-[#8a6038] py-2 text-sm text-white transition hover:bg-[#b67d4a]">
        Add to Cart
      </button>
    </div>
  );
}

export default CategoryViewAll;
