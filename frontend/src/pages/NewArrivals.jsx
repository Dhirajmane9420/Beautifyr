import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  createCatalogProduct,
  deleteCatalogProduct,
  fetchCatalogProducts,
  updateCatalogProduct,
  uploadCatalogProductImage,
} from "../lib/catalogApi";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
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
  return (
    <motion.article
      variants={fadeUp}
      className="group cursor-pointer flex flex-col items-center text-center"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-50 to-slate-100 mb-8 transition-all duration-700 ease-out group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] group-hover:-translate-y-2">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:scale-105 opacity-90 mix-blend-multiply"
        />

        <div className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100" />

        <div className="absolute top-6 right-6">
          <span className="bg-white/80 backdrop-blur-md text-slate-800 text-[9px] font-semibold tracking-[0.2em] uppercase px-4 py-2 rounded-full shadow-sm">
            New
          </span>
        </div>

        <div className="absolute inset-x-6 bottom-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]">
          <button className="w-full py-4 bg-white/90 backdrop-blur-xl text-slate-900 text-xs font-semibold tracking-[0.15em] uppercase rounded-2xl hover:bg-white transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            Add to Cart — Rs {item.price}
          </button>
        </div>
      </div>

      <div className="flex flex-col px-4 w-full text-left">
        <h3 className="text-xl font-light tracking-tight text-slate-900">{item.title}</h3>
        <p className="mt-2 text-sm text-slate-500 font-light leading-relaxed line-clamp-2">{item.description}</p>
        <p className="mt-3 text-base font-semibold text-slate-800">Rs {item.price}</p>
        <p className={`mt-1 text-xs font-semibold ${item.inStock ? "text-green-700" : "text-red-600"}`}>
          {item.inStock ? "In Stock" : "Out of Stock"}
        </p>

        {isAdmin ? (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onEdit?.(item)}
              className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete?.(item._id)}
              className="flex-1 rounded-xl border border-red-300 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-red-700"
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
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroImage = useMemo(() => {
    return arrivals[0]?.imageUrl || "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=900&q=80";
  }, [arrivals]);

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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-100 selection:text-slate-900">
      <Navbar />

      <section className="relative w-full h-[85svh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-50 blur-[120px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-50 blur-[120px] opacity-70" />
        <div className="absolute top-[20%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-amber-50 blur-[100px] opacity-60" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-4xl flex flex-col items-center justify-center text-center px-6"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-slate-400 font-medium border-b border-slate-200 pb-2">
              Spring / Summer Collection
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-slate-900 leading-[1.1]">
            Meet the <span className="italic font-serif text-slate-400">Future</span> of <br />Your Skin.
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-8 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg font-light">
            Weightless textures. Uncompromising clinical efficacy. Discover the new arrivals formulated to let your natural barrier breathe and thrive.
          </motion.p>

          <motion.button variants={fadeUp} className="mt-12 px-8 py-4 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-slate-900/20">
            Explore the Drop
          </motion.button>
        </motion.div>

        <img src={heroImage} alt="New arrival hero" className="absolute inset-0 h-full w-full object-cover opacity-10" />
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

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900">
            Freshly <span className="font-serif italic text-slate-400">Formulated</span>
          </h2>
          <div className="h-px w-12 bg-slate-200 mt-6" />
        </motion.div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center text-slate-600">
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
    </div>
  );
}
