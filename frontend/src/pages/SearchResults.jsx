import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { findCategoryIntent, findProductIntent, searchCatalog } from "../lib/searchIndex";
import { toProductSlug } from "../lib/productUtils";
import heroImage from "../assets/hero.jpg";

const typeStyles = {
  Category: "bg-[#f3e6d3] text-[#7a522f]",
  Product: "bg-[#e7f3ea] text-[#2b6b45]",
  Page: "bg-[#e8eef8] text-[#34577f]",
};

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const results = useMemo(() => searchCatalog(query), [query]);
  const productIntent = useMemo(() => findProductIntent(query), [query]);
  const categoryIntent = useMemo(() => {
    if (productIntent) return null;
    return findCategoryIntent(query);
  }, [productIntent, query]);

  const similarProducts = useMemo(() => {
    if (!productIntent?.category || !productIntent?.state?.products) return [];
    return productIntent.state.products
      .filter((item) => item.title !== productIntent.title)
      .slice(0, 4);
  }, [productIntent]);

  return (
    <div className="min-h-screen bg-[#fff7ee] text-[#2b2018]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-28">
        <div className="rounded-2xl border border-[#e7d6be] bg-white p-5 shadow-sm md:p-7">
          <p className="text-xs tracking-[0.18em] text-[#8a6038] uppercase">Search</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Results for "{query || "..."}"</h1>
          <p className="mt-2 text-sm text-[#6e5947]">{results.length} match{results.length === 1 ? "" : "es"} found</p>
        </div>

        {query.trim() === "" ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#d8c7ae] bg-[#fcf4e8] px-5 py-12 text-center text-[#6e5947]">
            Type something in search to find categories, items, and pages.
          </div>
        ) : productIntent ? (
          <section className="mt-6 space-y-6">
            <div className="rounded-2xl border border-[#e7d6be] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-wide text-[#8a6038] uppercase">Product</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#2b2018]">{productIntent.title}</h2>
              <p className="mt-1 text-sm text-[#6e5947]">{productIntent.category} • {productIntent.inStock ? "In Stock" : "Out of Stock"}</p>
              <p className="mt-3 text-lg font-semibold text-[#7a522f]">₹{Number(productIntent.price || 0).toLocaleString("en-IN")}</p>
              <Link
                to={`/product/${toProductSlug(productIntent.title)}`}
                state={{
                  product: {
                    id: productIntent.id,
                    name: productIntent.title,
                    price: productIntent.price,
                    category: productIntent.category,
                    image: heroImage,
                  },
                }}
                className="mt-4 inline-flex rounded-full border border-[#d3b48f] px-5 py-2 text-sm font-semibold text-[#8a6038] transition hover:bg-[#8a6038] hover:text-white"
              >
                View Product
              </Link>
            </div>

            <div className="rounded-2xl border border-[#e7d6be] bg-white p-5 shadow-sm">
              <h3 className="text-xl font-semibold text-[#2b2018]">Similar recommendations</h3>
              {similarProducts.length === 0 ? (
                <p className="mt-3 text-sm text-[#6e5947]">No similar products found.</p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {similarProducts.map((item) => (
                    <Link
                      key={item.title}
                      to={`/product/${toProductSlug(item.title)}`}
                      state={{
                        product: {
                          id: `${productIntent.category}-${item.title}`,
                          name: item.title,
                          price: item.price,
                          category: productIntent.category,
                          image: heroImage,
                        },
                      }}
                      className="rounded-xl border border-[#e7d6be] bg-[#fffaf4] p-4 transition hover:border-[#d3b48f]"
                    >
                      <p className="text-base font-semibold text-[#2b2018]">{item.title}</p>
                      <p className="mt-1 text-sm text-[#6e5947]">{productIntent.category}</p>
                      <p className="mt-2 text-sm font-semibold text-[#7a522f]">₹{Number(item.price || 0).toLocaleString("en-IN")}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : categoryIntent ? (
          <section className="mt-6 rounded-2xl border border-[#e7d6be] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-[#8a6038] uppercase">Category</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#2b2018]">{categoryIntent.category}</h2>
                <p className="mt-1 text-sm text-[#6e5947]">Showing products from this category only</p>
              </div>
              <Link
                to="/categories/view-all"
                state={{ title: categoryIntent.category, products: categoryIntent.products }}
                className="rounded-full border border-[#d3b48f] px-4 py-2 text-sm font-semibold text-[#8a6038] transition hover:bg-[#8a6038] hover:text-white"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {categoryIntent.products.map((item) => (
                <Link
                  key={item.title}
                  to="/categories/view-all"
                  state={{ title: categoryIntent.category, products: categoryIntent.products }}
                  className="rounded-xl border border-[#e7d6be] bg-[#fffaf4] p-4 transition hover:border-[#d3b48f]"
                >
                  <p className="text-base font-semibold text-[#2b2018]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#6e5947]">{item.inStock ? "In Stock" : "Out of Stock"}</p>
                  <p className="mt-2 text-sm font-semibold text-[#7a522f]">₹{Number(item.price || 0).toLocaleString("en-IN")}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : results.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#d8c7ae] bg-[#fcf4e8] px-5 py-12 text-center text-[#6e5947]">
            No matches found. Try terms like serum, sunscreen, categories, wishlist, or cart.
          </div>
        ) : (
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            {results.map((item) => (
              <Link
                key={item.id}
                to={
                  item.type === "Product"
                    ? `/product/${toProductSlug(item.title)}`
                    : item.path
                }
                state={
                  item.type === "Product"
                    ? {
                        product: {
                          id: item.id,
                          name: item.title,
                          price: item.price,
                          category: item.category,
                          image: heroImage,
                        },
                      }
                    : item.state
                }
                className="group rounded-2xl border border-[#e7d6be] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#d3b48f] hover:shadow-md"
              >
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeStyles[item.type] || "bg-[#f3e6d3] text-[#7a522f]"}`}>
                  {item.type}
                </span>
                <h2 className="mt-3 text-xl font-semibold text-[#2b2018] group-hover:text-[#7a522f]">{item.title}</h2>
                <p className="mt-2 text-sm text-[#6e5947]">{item.description}</p>
                <p className="mt-3 text-xs font-semibold tracking-wide text-[#8a6038] uppercase">Open</p>
              </Link>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
