import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/error-handler.js";
import { categorySchema } from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/", categoryController.list);
router.post("/", validateBody(categorySchema), categoryController.create);
router.put("/:id", validateBody(categorySchema.partial()), categoryController.update);
router.delete("/:id", categoryController.remove);

export default router;
