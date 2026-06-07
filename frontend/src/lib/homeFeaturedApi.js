import { request } from "./api";

export const fetchHomeFeatured = async () => {
  const payload = await request("/public/home-featured");

  return payload.products;
};

export const saveHomeFeatured = async (productIds) => {
  const payload = await request("/admin/home-featured", {
    method: "PUT",
    body: JSON.stringify({
      productIds,
    }),
  });

  return payload.products;
};
