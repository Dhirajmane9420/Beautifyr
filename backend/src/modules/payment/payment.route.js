import { Router } from "express";

import { createOrder, verifyPayment } from "./payment.controller.js";

const router = Router();

router.post("/payment/create-order", createOrder);

router.post("/payment/verify", verifyPayment);

export default router;
