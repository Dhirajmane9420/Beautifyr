import { request } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const fetchCatalogProducts = async () => {
  const payload = await request("/public/catalog-products", { method: "GET" });
  return payload.products || [];
};

export const fetchCatalogCategories = async () => {
  const payload = await request("/public/catalog-categories", { method: "GET" });
  return payload.categories || [];
};

export const createCatalogProduct = async (input) => {
  const payload = await request("/admin/catalog-products", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return payload.product;
};

export const updateCatalogProduct = async (id, input) => {
  const payload = await request(`/admin/catalog-products/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });

  return payload.product;
};

export const deleteCatalogProduct = async (id) => {
  await request(`/admin/catalog-products/${id}`, { method: "DELETE" });
};

export const createCatalogCategory = async (name) => {
  const payload = await request("/admin/catalog-categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  return payload.category;
};

export const deleteCatalogCategory = async (id) => {
  await request(`/admin/catalog-categories/${id}`, { method: "DELETE" });
};

export const uploadCatalogProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/admin/site-overrides/upload-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || "Image upload failed.");
  }

  return payload.imageUrl;
};
