import { Router } from "express";
import { getCurrentUser, googleAuth, login, logout, signup } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/google", googleAuth);
authRouter.post("/logout", logout);
authRouter.get("/me", getCurrentUser);
