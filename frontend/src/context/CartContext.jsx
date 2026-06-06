/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
const getCartStorageKey = (userId) =>
  userId ? `beautifyr_cart_${userId}` : "beautifyr_guest_cart";
const CartContext = createContext(null);

function parsePrice(input) {
  if (typeof input === "number") return input;
  const numeric = Number(String(input || "").replace(/[^0-9]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function getStoredCart(userId) {
  try {
    const raw = localStorage.getItem(
      getCartStorageKey(userId)
    );

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
 const { user } = useAuth();

const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  
useEffect(() => {
  const userId = user?._id || user?.id;

  setItems(
    getStoredCart(userId)
  );
}, [user]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message) => {
    setToast({ id: Date.now(), message });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  const dismissToast = () => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(null);
  };

  const persist = (nextItems) => {
  const userId = user?._id || user?.id;

  setItems(nextItems);

  localStorage.setItem(
    getCartStorageKey(userId),
    JSON.stringify(nextItems)
  );
};

  const addToCart = (product) => {
    const normalizedPrice = parsePrice(product.price);
    const normalizedOriginalPrice = parsePrice(product.originalPrice);
    const normalizedSizeVariant = product.sizeVariant
      ? {
          label: String(product.sizeVariant.label || product.size || "").trim(),
          stock: Number(product.sizeVariant.stock) || 0,
          price: normalizedPrice,
          originalPrice: normalizedOriginalPrice > 0 ? normalizedOriginalPrice : normalizedPrice,
        }
      : null;

    const normalized = {
      id: product.id,
      name: product.name || product.title || "Product",
      price: normalizedPrice,
      originalPrice: normalizedOriginalPrice > 0 ? normalizedOriginalPrice : normalizedPrice,
      image: product.image || "https://via.placeholder.com/400x400",
      category: product.category || "Skincare",
      size: product.size ? String(product.size) : "",
      sizeVariant: normalizedSizeVariant,
      quantity: Math.max(1, Number(product.quantity) || 1),
    };

    const existingIndex = items.findIndex((item) => item.id === normalized.id);

    if (existingIndex >= 0) {
      const nextItems = [...items];
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: nextItems[existingIndex].quantity + normalized.quantity,
      };
      persist(nextItems);
      showToast(`${normalized.name} added to cart`);
      return;
    }

    persist([...items, normalized]);
    showToast(`${normalized.name} added to cart`);
  };

  const removeFromCart = (id) => {
    persist(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    persist(items.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const clearCart = () => {
    persist([]);
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const originalTotal = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
    const discount = Math.max(0, originalTotal - subtotal);
    const platformFee = subtotal > 0 ? 7 : 0;
    const totalAmount = subtotal + platformFee;

    return {
      subtotal,
      originalTotal,
      discount,
      platformFee,
      totalAmount,
      savings: discount,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items]);

  const value = {
    items,
    isEmpty: items.length === 0,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totals,
    toast,
    dismissToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }
  return context;
}
