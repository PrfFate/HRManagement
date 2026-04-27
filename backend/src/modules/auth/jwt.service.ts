import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import type { RoleId } from "../../common/constants/roles.js";

export type JwtPayload = {
  userId: string;
  email: string;
  roleId: RoleId;
};

export const jwtService = {
  sign(payload: JwtPayload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    });
  },

  verify(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  },
};
