import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function CategoryViewAll() {
  const location = useLocation();
  const title = location.state?.title || "Category";
  const products = location.state?.products || [];

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-28">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{title} - All Products</h1>
            <p className="mt-2 text-sm text-[#6e5947]">Showing {products.length} products</p>
          </div>
          <Link
            to="/categories"
            className="rounded-full border border-[#d3b48f] bg-white px-4 py-2 text-xs font-semibold text-[#8a6038] transition hover:bg-[#8a6038] hover:text-white"
          >
            Back to Categories
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d8cec4] bg-[#f6f1eb] px-5 py-10 text-center text-sm text-[#6f6258]">
            No products to display. Please go back and select a category section again.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard
                key={`${product.title}-${index}`}
                title={product.title}
                price={`Rs ${product.price}`}
                image="https://via.placeholder.com/600x500"
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
