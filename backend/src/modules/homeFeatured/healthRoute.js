// routes/healthRoute.js

import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;