import { Router } from "express";
import * as serviceController from "../controllers/service.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/error-handler.js";
import { serviceSchema, serviceUpdateSchema } from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/", serviceController.listAdmin);
router.get("/:id", serviceController.getById);
router.post("/", validateBody(serviceSchema), serviceController.create);
router.put("/:id", validateBody(serviceUpdateSchema), serviceController.update);
router.delete("/:id", serviceController.remove);

export default router;
