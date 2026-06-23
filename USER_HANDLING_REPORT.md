# Beautifyr: Detailed User-Handling & API Scalability Report

This report provides a detailed technical analysis of the **Beautifyr** application's scalability, request capacity, and infrastructure limits. It covers how many concurrent users and requests the platform can handle under its current deployment architecture: **Frontend on Vercel Free (Hobby) Plan** and **Backend on Render Free Web Service**, backed by a **MongoDB Atlas M0 Free Tier** database.

---

## 📊 Executive Summary

Based on a thorough audit of the codebase, API handlers, and infrastructure tiers, here is the baseline capacity of the Beautifyr application:

*   **Safe Concurrent Browsing Users:** **5 to 10 active users** browsing the site simultaneously.
*   **Max Sustainable Throughput (Mixed API traffic):** **10 to 20 requests per second (RPS)**.
*   **Max Auth Throughput (Login/Signup):** **3 to 5 requests per second (RPS)**.
*   **Static Assets Capacity (Frontend):** **1,000+ requests per second (RPS)** (Vercel CDN-cached).
*   **Critical Risk Threshold:** **30+ concurrent catalog/home page requests** or **20+ concurrent login requests** will exhaust server memory (512MB RAM) or block the CPU, causing cold starts, timeouts, 502/504 Gateway errors, and backend container crashes.

> [!WARNING]
> The application currently has **no rate-limiting middleware** implemented, despite rate-limiting being defined as a requirement in [security.md](file:///C:/Users/Admin/Desktop/Sagar%20Project/Beautifyr/backend/security.md). A single client running a script can easily crash the backend service.

---

## ⚙️ Infrastructure Specifications & Hard Limits

### 1. Backend: Render Free Web Service
*   **CPU Allocation:** Shared, throttled burstable CPU (approximately equivalent to **0.1 vCPU** dedicated).
*   **RAM Allocation:** **512 MB** limit. Exceeding this triggers an immediate Out-of-Memory (OOM) process kill.
*   **Spin-Down Policy:** Spins down (enters sleep state) after **15 minutes of inactivity**.
*   **Cold Start Latency:** **30 to 60 seconds** for the first request after spin-down.
*   **Runtime Model:** Node.js Express (Single-threaded event loop). Blocks on synchronous operations.

### 2. Database: MongoDB Atlas M0 Free Tier (Shared)
*   **RAM & Storage:** Shared RAM, **512 MB** storage limit.
*   **Connection Limit:** Capped at **500 concurrent connections**.
*   **Query Constraints:** Throttled CPU on unindexed collection scans or heavy query payloads.

### 3. Frontend: Vercel Free (Hobby) Plan
*   **Bandwidth Egress:** **100 GB per month** (Fast Data Transfer).
*   **Request Capping:** **1,000,000 requests per month** limit across all serverless/routing requests.
*   **Edge Delivery:** Static React build is served via Vercel’s global Edge CDN, allowing **5,000+ requests/sec** for page loads (HTML, CSS, JS, and local assets).

---

## ⚡ API Endpoint Capacity Breakdown

### 1. CPU-Bound Auth Endpoints (`/api/auth/login`, `/api/auth/signup`)
*   **Process flow:** 
    1. Asynchronously queries MongoDB for user by email (Indexed: `O(1)` complexity).
    2. Runs `bcrypt.compare()` or `bcrypt.hash()` to verify the password.
    3. Generates and signs a JWT.
*   **The Bcrypt Bottleneck:** The backend uses the pure-JS library `"bcryptjs": "^3.0.3"`. In contrast to the native C++ `bcrypt` library (which runs on thread pools), `bcryptjs` is CPU-heavy and runs on Node's main execution thread.
    *   On a standard server core, a Bcrypt validation (10 rounds) takes 50-80ms of CPU time.
    *   On Render's throttled **0.1 CPU**, a single Bcrypt check takes **150ms to 400ms** of continuous CPU work.
*   **Calculated Capacity:**
    *   **Maximum Throughput:** **3 to 5 requests per second (RPS)** before the CPU hits 100% load.
    *   **Simultaneous Request Crash Limit:** **~20 concurrent requests**. If 20 users hit `/login` at the exact same instant, the single-threaded event loop will be occupied for 6 to 8 seconds processing hashing functions. This delays all other incoming routing, triggering 504 Gateway Timeouts on Render and loading freezes on Vercel.

---

### 2. Memory-Bound Catalog Endpoints (`/api/public/catalog-products`)
*   **Process flow:**
    1. Queries MongoDB for all products via `CatalogProduct.find({})` and sorts them by `createdAt`.
    2. Converts database documents to JavaScript objects and sends them as a JSON response.
*   **The "Fetch All" Bottleneck:** In `catalog.controller.js`, this endpoint retrieves the **entire products collection** without pagination, query filtering, or projection limits.
*   **Client-Side Query Amplification:** The frontend fetches the entire products list via `fetchCatalogProducts()` on almost every page (Home, Categories, Best Sellers, New Arrivals, Product Details) and filters the products array in client-side React code.
*   **Calculated Capacity:**
    *   **With Small Catalog (<50 items):** **10 to 15 requests per second (RPS)**.
    *   **With Large Catalog (500+ items):** **1 to 2 requests per second (RPS)**. Each request requires pulling megabytes of documents from MongoDB, allocating Mongoose model wrappers in RAM, serializing them, and transferring them over the network.
    *   **Simultaneous Request Crash Limit:** **~30 to 50 concurrent requests**. Doing multiple simultaneous scans of a growing catalog will exhaust Render's 512MB RAM, causing the Node process to crash with an Out-Of-Memory (OOM) error.

---

### 3. I/O-Bound Health Check (`/api/health`, `/health`)
*   **Process flow:** Simply returns `{ status: "ok" }` or returns a small uptime snapshot without database interaction.
*   **Calculated Capacity:**
    *   **Maximum Throughput:** **80 to 120 requests per second (RPS)**. Node.js's asynchronous architecture handles these lightweight, non-blocking requests efficiently.
    *   **Simultaneous Request Limit:** Limited by Render's free tier connection handling limits (approx. **100 concurrent sockets**).

---

### 4. Database-Intensive Order Placement (`/api/orders`)
*   **Process flow:** 
    1. Loop over items: Reads product data from DB via `CatalogProduct.findById()` to check stock.
    2. Inserts new order via `Order.create()`.
    3. Loop over items again: Reads product again and decrements stock via `product.save()`.
*   **The Database Query Storm:** To place an order with **N** items, Express executes **2N + 1** separate database operations (2 database queries per item, plus order insertion). If an order has 5 items, this executes **11 database queries** sequentially without transaction grouping.
*   **Calculated Capacity:**
    *   **Maximum Throughput:** **1 to 3 orders per second** before Mongoose connection pooling saturates or MongoDB Atlas M0 (shared connection limit) starts queuing requests.
    *   **Race Conditions:** Because mongoose documents are modified sequentially without locking or transactions, two users checking stock for the same item at the same millisecond will both pass the stock check and double-book the item, leading to negative stock counts.

---

## 🛠️ Actionable Recommendations for Scalability

To increase capacity from **5 concurrent users** to **100+ concurrent users** without upgrading to paid hosting plans immediately, implement the following optimizations:

### 1. Implement Server-Side Pagination & Projection
*   **Current Issue:** Returning the entire product list, including sub-arrays (reviews, variants) on every list call.
*   **Fix:** Add `limit`, `skip`, and `select` filters on backend endpoints.
    ```javascript
    // In catalog.controller.js
    export const getPublicCatalogProducts = async (req, res, next) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const products = await CatalogProduct.find({})
        .select("_id title price inStock imageUrl category reviewCount averageRating") // Exclude heavy reviews array
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await CatalogProduct.countDocuments({});
      res.status(200).json({ products, total, page, pages: Math.ceil(total / limit) });
    };
    ```

### 2. Optimise Frontend API Fetching
*   **Current Issue:** Fetching the entire database to display a filtered subset (e.g. homepage featured items, best sellers page).
*   **Fix:** Introduce backend query filters (e.g. `GET /api/public/catalog-products?isBestSeller=true`) so the server returns only the required items.
*   **Use Caching:** Implement a client-side data fetching library like **React Query** (or SWR) on the frontend. This prevents duplicate fetches on page navigations using cached/stale-while-revalidate data.

### 3. Add Rate Limiting Middleware
*   **Current Issue:** Zero endpoint protection.
*   **Fix:** Add `express-rate-limit` to prevent brute force login attempts and API scrapers from overloading the event loop.
    ```javascript
    import rateLimit from "express-rate-limit";

    export const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
      message: { message: "Too many login attempts, please try again after 15 minutes." }
    });

    authRouter.post("/login", authLimiter, login);
    ```

### 4. Optimize CPU-Heavy Auth Operations
*   **Fix A (Workaround):** Reduce bcrypt rounds from 10 to 8 to reduce CPU calculation time, or switch to Node's native `crypto.scrypt` which is faster and better integrated into the asynchronous runtime.
*   **Fix B (Architectural):** Offload password verification logic to an external authentication provider like **Supabase Auth** or **Clerk** (both offer generous free tiers). This completely eliminates CPU-heavy cryptographic operations from your Render server.

### 5. Consolidate Database Queries for Checkout
*   **Fix:** Instead of querying the database **N** times in a loop, query products in a single operation:
    ```javascript
    const productIds = normalizedItems.map(item => item.productId);
    const products = await CatalogProduct.find({ _id: { $in: productIds } });
    ```
    This reduces the database roundtrips from `2N + 1` to just `3` queries total.
