# Deployment Guide - Beautifyr

This guide walk you through deploying the **Beautifyr** application, with the **Backend** hosted on **Render** and the **Frontend** hosted on **Vercel**.

---

## Prerequisites
1. A **GitHub repository** containing the project (both `frontend` and `backend` folders).
2. A **MongoDB Atlas** database URI.
3. A **Cloudinary** account (for image uploads).
4. A **Razorpay** account (for payments).
5. Accounts on [Render](https://render.com) and [Vercel](https://vercel.com).

---

## Phase 1: Deploy the Backend on Render

Render will host the Node.js Express server. Since the project is set up as a monorepo, we must configure Render to look specifically at the `backend` subdirectory.

### Step-by-Step Setup
1. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the Web Service settings:
   - **Name**: `beautifyr-backend` (or your choice)
   - **Environment / Runtime**: `Node`
   - **Region**: Choose the region closest to your users
   - **Branch**: `main` (or your active branch)
   - **Root Directory**: `backend` *(CRITICAL: This tells Render where the backend package.json resides)*
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js` or `npm start`
   - **Instance Type**: `Free` (or custom tier)

### Environment Variables
Under the **Environment** tab on Render, add the following key-value pairs:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode and secure cross-site cookies |
| `CLIENT_URL` | `https://your-frontend.vercel.app` | **Your Vercel deployment URL** (Update this once you deploy the frontend in Phase 2) |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your_secure_random_jwt_secret` | A secure random string for signing JSON Web Tokens |
| `ADMIN_EMAIL` | `admin@example.com` | Email address for the default admin account |
| `ADMIN_PASSWORD` | `secure_admin_password_here` | Password for the default admin account (Min 6 chars) |
| `CLOUDINARY_CLOUD_NAME` | `your_cloud_name` | Cloudinary settings |
| `CLOUDINARY_API_KEY` | `your_api_key` | Cloudinary settings |
| `CLOUDINARY_API_SECRET` | `your_api_secret` | Cloudinary settings |
| `RAZORPAY_KEY_ID` | `your_razorpay_key_id` | Razorpay settings |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_key_secret` | Razorpay settings |
| `GOOGLE_CLIENT_ID` | `your_google_client_id` | *(Optional)* Google OAuth Client ID for social login |

4. Click **Create Web Service**. 
5. Note the deployment URL once compilation completes (e.g., `https://beautifyr-backend.onrender.com`).

---

## Phase 2: Deploy the Frontend on Vercel

Vercel will build and serve the React Single Page Application (SPA). Vercel also reads the `vercel.json` file in the frontend folder to ensure that client-side routes (like `/best-sellers` or `/login`) route correctly on reload.

### Step-by-Step Setup
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Configure the Project settings:
   - **Framework Preset**: `Vite` (Vercel automatically detects this)
   - **Root Directory**: Click *Edit* and select the `frontend` folder. *(CRITICAL: This tells Vercel where the frontend package.json resides)*
   - **Build & Development Settings**: Keep defaults (Build command: `vite build`, Output directory: `dist`).

### Environment Variables
Expand the **Environment Variables** section and add the following keys:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` | **The URL of your Render backend** followed by `/api` |
| `VITE_RAZORPAY_KEY_ID` | `rzp_test_...` or `rzp_live_...` | Razorpay Public Key ID |
| `VITE_GOOGLE_CLIENT_ID` | `your_google_client_id` | *(Optional)* Google OAuth Client ID |

4. Click **Deploy**.
5. Once deployment is complete, copy your production URL (e.g., `https://beautifyr.vercel.app`).

---

## Phase 3: Linking the Deployments (Crucial Step)

Since the frontend and backend need to know about each other:
1. Go back to your **Render Web Service** dashboard -> **Settings** -> **Environment**.
2. Find the `CLIENT_URL` key and update it to the live Vercel URL: `https://your-frontend.vercel.app` (without a trailing slash).
3. Save changes. Render will automatically redeploy the backend.

---

## Post-Deployment Verification

### 1. Check Backend Health
Visit `https://your-backend.onrender.com/api/health` in your browser. You should receive:
```json
{ "status": "ok", "message": "Backend running" }
```

### 2. Verify Client Routing
Visit `https://your-frontend.vercel.app/best-sellers` directly or reload the page on that route. Thanks to the `vercel.json` configuration, it should display the best sellers page instead of a Vercel 404 error page.

### 3. Check Authentication & Cookie Transmission
1. Go to `https://your-frontend.vercel.app/login` and authenticate.
2. Open Browser Developer Tools (`F12`), go to **Application** -> **Cookies** (or Storage).
3. Verify that the `token` cookie is present, and has attributes:
   - `Secure: True`
   - `SameSite: None`
4. Attempt navigating through the dashboard, creating/updating items to verify that the cookie is transmitted correctly with the `credentials: "include"` fetch requests.
