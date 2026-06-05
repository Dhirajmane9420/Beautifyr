import { request } from "./api";

export const placeOrder = async (input) => {
  const payload = await request("/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return payload.order;
};

export const fetchDeliveryDetails = async () => {
  const payload = await request("/admin/delivery-details", {
    method: "GET",
  });

  return payload;
};