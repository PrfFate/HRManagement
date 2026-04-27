import { Router } from "express";

import { RoleIds } from "../../common/constants/roles.js";
import { authenticate } from "../../common/middlewares/authenticate.js";
import { authorize } from "../../common/middlewares/authorize.js";
import { validateRequest } from "../../common/middlewares/validateRequest.js";
import { leaveRequestController } from "./leave-request.controller.js";
import {
  createLeaveRequestSchema,
  leaveRequestIdParamsSchema,
  listLeaveRequestsQuerySchema,
  updateLeaveRequestStatusSchema,
} from "./leave-request.validation.js";

export const leaveRequestRoutes = Router();

const employeeOnly = [
  authenticate,
  authorize({ roles: [RoleIds.Employee], requireActive: true }),
];
const managerOnly = [authenticate, authorize({ roles: [RoleIds.Manager], requireActive: true })];

leaveRequestRoutes.post(
  "/",
  employeeOnly,
  validateRequest({ body: createLeaveRequestSchema }),
  leaveRequestController.create,
);
leaveRequestRoutes.get(
  "/my",
  employeeOnly,
  validateRequest({ query: listLeaveRequestsQuerySchema }),
  leaveRequestController.listMine,
);
leaveRequestRoutes.get(
  "/",
  managerOnly,
  validateRequest({ query: listLeaveRequestsQuerySchema }),
  leaveRequestController.listAll,
);
leaveRequestRoutes.put(
  "/:id/status",
  managerOnly,
  validateRequest({
    params: leaveRequestIdParamsSchema,
    body: updateLeaveRequestStatusSchema,
  }),
  leaveRequestController.updateStatus,
);
