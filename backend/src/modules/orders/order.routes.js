import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { placeOrder } from "./order.controller.js";

export const orderRouter = Router();

orderRouter.post("/orders", requireAuth, placeOrder);