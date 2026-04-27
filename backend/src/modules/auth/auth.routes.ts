import { Router } from "express";

import { authenticate } from "../../common/middlewares/authenticate.js";
import { validateRequest } from "../../common/middlewares/validateRequest.js";
import { authController } from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

export const authRoutes = Router();

authRoutes.post("/register", validateRequest({ body: registerSchema }), authController.register);
authRoutes.post("/login", validateRequest({ body: loginSchema }), authController.login);
authRoutes.get("/me", authenticate, authController.me);
