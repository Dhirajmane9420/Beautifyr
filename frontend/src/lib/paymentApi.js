import { request } from "./api";

export const createPaymentOrder = (amount) =>
  request("/payment/create-order", {
    method: "POST",
    body: JSON.stringify({
      amount,
    }),
  });

export const verifyPayment = (payload) =>
  request("/payment/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
