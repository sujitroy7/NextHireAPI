import { Router } from "express";
import { createUserHandler, getAllUsersHandler } from "./user.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createUserSchema } from "./user.schema.js";

const router = Router();

router.get("/", getAllUsersHandler);
router.post("/", validateRequest(createUserSchema), createUserHandler);

// todo: update user password API
// router.post('/password', validateRequest(updateUserPasswordSchema), updateUserPasswordHandler)

export default router;
