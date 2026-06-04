import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.jpg";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toProductSlug } from "../lib/productUtils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import {
  createCatalogProduct,
  deleteCatalogProduct,
  fetchCatalogProducts,
  updateCatalogProduct,
  uploadCatalogProductImage,
} from "../lib/catalogApi";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0, 1] } },
};

const categoryOptions = ["Essence", "Cleanser", "Mist", "Oil", "Cream", "Serum", "Sunscreen", "Gel"];

const buildInitialForm = () => ({
  title: "",
  description: "",
  price: "",
  inStock: true,
  section: "New Arrivals",
  category: "Essence",
  imageUrl: "",
});

const ProductCard = ({ item, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const numericPrice = Number(item.price) || 0;
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(item._id);

  return (
    <motion.article
      layout
      variants={fadeUp}
      onClick={() =>
        navigate(`/product/${toProductSlug(item.title)}`, {
          state: { product: item },
        })
      }
      className="group flex cursor-pointer flex-col"
    >
      <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#F7F4F0] shadow-lg shadow-black/5 transition-all duration-700 hover:shadow-2xl hover:shadow-black/10 group-hover:-translate-y-2">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <img
          src={heroImage}
          alt={item.title}
          className="h-full w-full object-cover transition-all duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.08]"
        />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleWishlist({
              _id: item._id,
              title: item.title,
              name: item.title,
              description: item.description,
              price: item.price,
              image: item.imageUrl || heroImage,
              category: item.category,
              inStock: item.inStock,
            });
          }}
          aria-label={wishlisted ? `Remove ${item.title} from wishlist` : `Add ${item.title} to wishlist`}
          aria-pressed={wishlisted}
          className={`absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition ${
            wishlisted
              ? "border-rose-200 bg-rose-500 text-white"
              : "border-white/70 bg-white/85 text-[#7f674d] hover:bg-white"
          }`}
        >
          <Heart size={16} className={wishlisted ? "fill-current" : ""} />
        </button>

        <div className="absolute top-4 left-4 z-20 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-[#7f674d] shadow-sm backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.18em]">New</span>
        </div>

        <div className="absolute inset-x-4 bottom-4 z-20 translate-y-8 opacity-0 transition-all duration-500 ease-[0.16,1,0.3,1] group-hover:translate-y-0 group-hover:opacity-100">
          <button className="w-full rounded-2xl border border-[#D4B896]/30 bg-white/90 py-3.5 text-sm font-medium uppercase tracking-widest text-[#2A2520] shadow-lg backdrop-blur-xl transition-all hover:bg-white hover:shadow-xl">
            Add to Cart — Rs {numericPrice}
          </button>
        </div>
      </div>

      <div className="flex flex-col px-1 text-left">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-light leading-snug text-[#2A2520]">{item.title}</h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#9A8C80]">
          <span className="rounded-full bg-[#C8A97E]/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#7f674d]">
            {item.category}
          </span>
          <span>•</span>
          <span>{item.inStock ? "In Stock" : "Out of Stock"}</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2.5">
          <span className="text-lg font-semibold text-[#2A2520]">Rs {numericPrice}</span>
          <span className="text-sm font-normal text-[#B0A398] line-through">Rs {Math.round(numericPrice * 1.25)}</span>
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
            {numericPrice > 0 ? `${Math.max(5, Math.round((1 - numericPrice / Math.round(numericPrice * 1.25)) * 100))}% OFF` : "New"}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-[#7A6E62] line-clamp-2">{item.description}</p>

        {isAdmin ? (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="flex-1 rounded-xl bg-[#C8A97E] px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-sm transition hover:bg-[#B8976E]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(item._id)}
              className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-rose-600 transition hover:bg-rose-100"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </motion.article>
  );
};

export default function NewArrivals() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [arrivals, setArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const [newForm, setNewForm] = useState(buildInitialForm());
  const [newFile, setNewFile] = useState(null);

  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState(buildInitialForm());
  const [editFile, setEditFile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const allProducts = await fetchCatalogProducts();
        if (!isMounted) return;

        setArrivals(allProducts.filter((item) => item.section === "New Arrivals"));
      } catch {
        if (!isMounted) return;
        setArrivals([]);
      }
      if (!isMounted) return;
      setIsLoading(false);
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const toPayload = (form, imageUrl) => ({
    title: form.title.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    inStock: Boolean(form.inStock),
    section: "New Arrivals",
    category: form.category.trim() || "Essence",
    imageUrl,
  });

  const handleAdd = async () => {
    try {
      setIsSaving(true);
      setNotice("");

      let imageUrl = newForm.imageUrl.trim();
      if (newFile) {
        imageUrl = await uploadCatalogProductImage(newFile);
      }

      const created = await createCatalogProduct(toPayload(newForm, imageUrl));
      setArrivals((current) => [created, ...current]);
      setNewForm(buildInitialForm());
      setNewFile(null);
      setNotice("New arrival added.");
    } catch (error) {
      setNotice(error.message || "Failed to add product.");
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (product) => {
    setEditingProductId(product._id);
    setEditForm({
      title: product.title || "",
      description: product.description || "",
      price: String(product.price || ""),
      inStock: Boolean(product.inStock),
      section: "New Arrivals",
      category: product.category || "Essence",
      imageUrl: product.imageUrl || "",
    });
    setEditFile(null);
  };

  const handleUpdate = async () => {
    if (!editingProductId) return;

    try {
      setIsSaving(true);
      setNotice("");

      let imageUrl = editForm.imageUrl.trim();
      if (editFile) {
        imageUrl = await uploadCatalogProductImage(editFile);
      }

      const updated = await updateCatalogProduct(editingProductId, toPayload(editForm, imageUrl));
      setArrivals((current) => current.map((item) => (item._id === editingProductId ? updated : item)));
      setEditingProductId(null);
      setEditFile(null);
      setNotice("New arrival updated.");
    } catch (error) {
      setNotice(error.message || "Failed to update product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this new arrival product?");
    if (!confirmed) return;

    try {
      setIsSaving(true);
      setNotice("");
      await deleteCatalogProduct(id);
      setArrivals((current) => current.filter((item) => item._id !== id));
      setNotice("New arrival deleted.");
    } catch (error) {
      setNotice(error.message || "Failed to delete product.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f1ec] text-[#2A2520] font-sans selection:bg-[#C8A97E] selection:text-white">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFAF8] via-white to-[#FAFAF8]">
        <div className="absolute -top-[120px] right-[-120px] h-[400px] w-[400px] rounded-full bg-[#C8A97E]/5 blur-3xl" />
        <div className="absolute -bottom-[80px] left-[-80px] h-[300px] w-[300px] rounded-full bg-[#D4B896]/5 blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-6 pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div initial="hidden" animate="show" variants={staggerContainer} className="text-center md:text-left">
              <motion.span
                variants={fadeUp}
                className="mb-6 inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#C8A97E]"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="h-px w-6 bg-[#C8A97E]" />
                  Fresh Additions
                </span>
              </motion.span>

              <motion.h1 variants={fadeUp} className="mb-6 text-4xl font-serif font-light leading-[1.1] text-[#2A2520] md:text-6xl lg:text-7xl">
                Shop the <span className="text-[#C8A97E]">Latest</span> <br />New Arrivals.
              </motion.h1>

              <motion.p variants={fadeUp} className="mx-auto mb-8 max-w-lg text-base leading-relaxed font-light text-stone-500 md:mx-0 md:text-lg">
                Weightless textures, fresh formulas, and the newest pieces in the collection. Designed to match the refined feel of our category and best seller pages.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 md:justify-start">
                <span className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="h-4 w-4 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Clinically Tested
                </span>
                <span className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="h-4 w-4 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Clean Ingredients
                </span>
                <span className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="h-4 w-4 text-[#C8A97E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fresh Weekly Drops
                </span>
              </motion.div>
            </motion.div>

            <motion.div variants={scaleIn} initial="hidden" animate="show" className="group relative">
              <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2.5rem] shadow-2xl">
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#2A2520]/30 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-[#C8A97E]/10 via-transparent to-[#D4B896]/10" />
                <img src={heroImage} alt="New arrivals" className="h-full w-full object-cover transition-transform duration-700 ease-[0.25,0.1,0,1] group-hover:scale-105" />
                <div className="pointer-events-none absolute -top-3 -right-3 z-20 h-16 w-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl" />
                <div className="pointer-events-none absolute -bottom-3 -left-3 z-20 h-16 w-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {isAdmin ? (
        <section className="mx-auto max-w-7xl px-6 pt-10 md:px-12 lg:px-24">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700">Admin New Arrivals Manager</h3>
              {notice ? <p className="text-xs font-medium text-slate-700">{notice}</p> : null}
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input
                value={newForm.title}
                onChange={(event) => setNewForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Product title"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={newForm.price}
                onChange={(event) => setNewForm((current) => ({ ...current, price: event.target.value }))}
                type="number"
                min="0"
                placeholder="Price"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <select
                value={newForm.category}
                onChange={(event) => setNewForm((current) => ({ ...current, category: event.target.value }))}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <textarea
              value={newForm.description}
              onChange={(event) => setNewForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              placeholder="Product note/description"
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={newForm.imageUrl}
                onChange={(event) => setNewForm((current) => ({ ...current, imageUrl: event.target.value }))}
                placeholder="Image URL (optional if uploading file)"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) {
                    setNotice("Image must be 10MB or smaller.");
                    return;
                  }
                  setNewFile(file);
                }}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={newForm.inStock}
                  onChange={(event) => setNewForm((current) => ({ ...current, inStock: event.target.checked }))}
                />
                In stock
              </label>
              <button
                type="button"
                onClick={handleAdd}
                disabled={isSaving}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Add New Arrival"}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:px-16 lg:px-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <h2 className="text-3xl font-light tracking-tight text-[#2A2520] md:text-4xl">
            Freshly <span className="font-serif italic text-[#C8A97E]">Formulated</span>
          </h2>
          <div className="mt-6 h-px w-12 bg-[#D4B896]/50" />
        </motion.div>

        {isLoading ? (
          <div className="rounded-2xl border border-[#D4B896]/30 bg-white/50 px-5 py-10 text-center text-[#7A6E62] backdrop-blur-sm">
            Loading new arrivals...
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-x-8 gap-y-20 sm:grid-cols-2 lg:grid-cols-3"
          >
            {arrivals.map((item) => (
              <ProductCard key={item._id} item={item} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </motion.div>
        )}
      </section>

      {editingProductId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Edit New Arrival</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setEditFile(null);
                }}
                className="text-sm text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                value={editForm.title}
                onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Product title"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={editForm.price}
                onChange={(event) => setEditForm((current) => ({ ...current, price: event.target.value }))}
                type="number"
                min="0"
                placeholder="Price"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />

              <select
                value={editForm.category}
                onChange={(event) => setEditForm((current) => ({ ...current, category: event.target.value }))}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <input
                value={editForm.imageUrl}
                onChange={(event) => setEditForm((current) => ({ ...current, imageUrl: event.target.value }))}
                placeholder="Image URL"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <textarea
              value={editForm.description}
              onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
              rows={3}
              placeholder="Description"
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (file.size > 10 * 1024 * 1024) {
                    setNotice("Image must be 10MB or smaller.");
                    return;
                  }
                  setEditFile(file);
                }}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={editForm.inStock}
                  onChange={(event) => setEditForm((current) => ({ ...current, inStock: event.target.checked }))}
                />
                In stock
              </label>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingProductId(null);
                  setEditFile(null);
                }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                disabled={isSaving}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </div>
  );
}
