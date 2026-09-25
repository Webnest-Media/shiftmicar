import { Router } from "express";
import * as tagController from "../controllers/tag.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/error-handler.js";
import { tagSchema } from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/", tagController.list);
router.post("/", validateBody(tagSchema), tagController.create);
router.put("/:id", validateBody(tagSchema.partial()), tagController.update);
router.delete("/:id", tagController.remove);

export default router;
