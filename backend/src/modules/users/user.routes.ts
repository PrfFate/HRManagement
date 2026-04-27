import { Router } from "express";

import { RoleIds } from "../../common/constants/roles.js";
import { authenticate } from "../../common/middlewares/authenticate.js";
import { authorize } from "../../common/middlewares/authorize.js";
import { validateRequest } from "../../common/middlewares/validateRequest.js";
import { userController } from "./user.controller.js";
import {
  listPendingUsersQuerySchema,
  listUsersQuerySchema,
  updateUserRoleSchema,
  userIdParamsSchema,
} from "./user.validation.js";

export const userRoutes = Router();

const managerOnly = [authenticate, authorize({ roles: [RoleIds.Manager], requireActive: true })];

userRoutes.get("/", managerOnly, validateRequest({ query: listUsersQuerySchema }), userController.list);
userRoutes.get(
  "/pending",
  managerOnly,
  validateRequest({ query: listPendingUsersQuerySchema }),
  userController.listPending,
);
userRoutes.put(
  "/:id/approve",
  managerOnly,
  validateRequest({ params: userIdParamsSchema }),
  userController.approve,
);
userRoutes.put(
  "/:id/reject",
  managerOnly,
  validateRequest({ params: userIdParamsSchema }),
  userController.reject,
);
userRoutes.put(
  "/:id/role",
  managerOnly,
  validateRequest({ params: userIdParamsSchema, body: updateUserRoleSchema }),
  userController.updateRole,
);
