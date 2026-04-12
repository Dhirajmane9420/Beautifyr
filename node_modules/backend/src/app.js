import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.routes.js";

export const createApp = ({ clientUrl }) => {
  const app = express();

  app.use(cors({ origin: clientUrl, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", message: "Backend running" });
  });

  app.use("/api/auth", authRouter);

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
