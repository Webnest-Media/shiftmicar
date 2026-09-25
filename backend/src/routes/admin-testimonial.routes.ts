import { Router } from "express";
import * as testimonialController from "../controllers/testimonial.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/error-handler.js";
import { testimonialSchema, testimonialUpdateSchema } from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/", testimonialController.listAdmin);
router.get("/:id", testimonialController.getById);
router.post("/", validateBody(testimonialSchema), testimonialController.create);
router.put("/:id", validateBody(testimonialUpdateSchema), testimonialController.update);
router.delete("/:id", testimonialController.remove);

export default router;
