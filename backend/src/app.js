import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { orderRouter } from "./modules/orders/order.routes.js";
import { catalogRouter } from "./modules/catalog/catalog.route.js";
import paymentRouter from "./modules/payment/payment.route.js";
export const createApp = ({ clientUrl }) => {
  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        const allowedOrigins = clientUrl.split(",").map((url) => url.trim());
        const isAllowedClient = allowedOrigins.includes(origin);
        const isLocalhostDev =
          process.env.NODE_ENV !== "production" &&
          /^http:\/\/localhost:\d+$/.test(origin);

        if (isAllowedClient || isLocalhostDev) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", message: "Backend running" });
  });


  app.use("/api/auth", authRouter);
  app.use("/api", adminRouter);
  app.use("/api", orderRouter);
  app.use("/api", catalogRouter);
  app.use("/api", paymentRouter);
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Backend is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
  });


  app.use((error, _req, res, _next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message || "Internal Server Error",
    });
  });

  return app;
};
