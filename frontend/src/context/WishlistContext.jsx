/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
const getWishlistStorageKey = (userId) =>
  userId
    ? `actshiine_wishlist_${userId}`
    : "actshiine_guest_wishlist";
const WishlistContext = createContext(null);

function getStoredWishlist(userId) {
  try {
    const raw = localStorage.getItem(
  getWishlistStorageKey(userId)
);
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
  const { user } = useAuth();

const [items, setItems] =
  useState([]);
  useEffect(() => {
  const userId =
    user?._id || user?.id;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  setItems(
    getStoredWishlist(userId)
  );
}, [user]);

  useEffect(() => {
  const userId =
    user?._id || user?.id;

  localStorage.setItem(
    getWishlistStorageKey(userId),
    JSON.stringify(items)
  );
}, [items, user]);

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

  const value = {
    items,
    wishlistItems: items,
    wishlistCount: items.length,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider.");
  }
  return context;
}
