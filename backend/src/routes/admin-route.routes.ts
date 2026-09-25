import { Router } from "express";
import * as routeController from "../controllers/route.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateBody } from "../middleware/error-handler.js";
import { routeSchema, routeUpdateSchema } from "../utils/validators.js";

const router = Router();

router.use(authenticate, authorize("ADMIN", "EDITOR"));

router.get("/", routeController.listAdmin);
router.get("/:id", routeController.getById);
router.post("/", validateBody(routeSchema), routeController.create);
router.put("/:id", validateBody(routeUpdateSchema), routeController.update);
router.delete("/:id", routeController.remove);

export default router;
