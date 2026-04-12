import { request } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const fetchPageOverrides = async (page) => {
  const payload = await request(`/public/site-overrides?page=${encodeURIComponent(page)}`, {
    method: "GET",
  });

  return payload.overrides || [];
};

export const savePageOverride = async ({ page, key, kind, value }) => {
  const payload = await request("/admin/site-overrides", {
    method: "PUT",
    body: JSON.stringify({ page, key, kind, value }),
  });

  return payload.override;
};

export const uploadPageOverrideImage = async (file) => {
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
