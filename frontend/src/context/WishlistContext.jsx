/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WISHLIST_STORAGE_KEY = "beautifyr_wishlist_v1";
const WishlistContext = createContext(null);

function getStoredWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeProduct(product) {
  const id = String(product?._id ?? product?.id ?? product?.slug ?? product?.title ?? "");
  return {
    id,
    name: product?.name || product?.title || "Product",
    desc: product?.desc || product?.description || "",
    price: Number(product?.price) || 0,
    image: product?.image || product?.imageUrl || product?.heroImage || "",
    category: product?.category || "",
    inStock: Boolean(product?.inStock),
    originalPrice: Number(product?.originalPrice) || 0,
  };
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => getStoredWishlist());

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isInWishlist = (id) => items.some((item) => item.id === String(id));

  const addToWishlist = (product) => {
    const normalized = normalizeProduct(product);
    if (!normalized.id) return;

    setItems((current) => {
      if (current.some((item) => item.id === normalized.id)) {
        return current;
      }
      return [normalized, ...current];
    });
  };

  const removeFromWishlist = (id) => {
    const targetId = String(id);
    setItems((current) => current.filter((item) => item.id !== targetId));
  };

  const toggleWishlist = (product) => {
    const normalized = normalizeProduct(product);
    if (!normalized.id) return;

    setItems((current) => {
      const exists = current.some((item) => item.id === normalized.id);
      if (exists) {
        return current.filter((item) => item.id !== normalized.id);
      }
      return [normalized, ...current];
    });
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const value = useMemo(
    () => ({
      items,
      wishlistItems: items,
      wishlistCount: items.length,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider.");
  }
  return context;
}
