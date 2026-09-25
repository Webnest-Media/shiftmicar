import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validateBody } from "../middleware/error-handler.js";
import { loginSchema, profileSchema } from "../utils/validators.js";
import rateLimit from "express-rate-limit";

const router = Router();

const limiterFn = (typeof rateLimit === "function" ? rateLimit : (rateLimit as any)?.default || rateLimit) as any;

const loginLimiter = limiterFn({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
});

router.post("/login", loginLimiter, validateBody(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);
router.patch("/me", authenticate, validateBody(profileSchema), authController.updateMe);

export default router;
