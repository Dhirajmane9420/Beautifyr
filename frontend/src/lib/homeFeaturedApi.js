import { request } from "./api";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const fetchHomeFeatured = async () => {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 15000; // 15 s per attempt

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timerId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const payload = await request("/public/home-featured", {
        signal: controller.signal,
      });

      clearTimeout(timerId);
      return payload.products ?? [];
    } catch (err) {
      const isLast = attempt === MAX_RETRIES - 1;
      if (isLast) throw err;

      // Exponential back-off: 1 s, 2 s, …
      await wait(1000 * (attempt + 1));
    }
  }

  return []; // fallback – should never reach here
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
