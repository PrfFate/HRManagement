import type { RoleId } from "../common/constants/roles.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        roleId: RoleId;
      };
    }
  }
}

export {};
