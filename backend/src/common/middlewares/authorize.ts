import type { NextFunction, Request, Response } from "express";

import type { RoleId } from "../constants/roles.js";
import { AppError } from "../errors/AppError.js";
import { userRepository } from "../../modules/users/user.repository.js";

type AuthorizeOptions = {
  roles: RoleId[];
  requireActive?: boolean;
};

export function authorize(options: AuthorizeOptions) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        next(new AppError("Oturum bilgisi bulunamadı.", 401));
        return;
      }

      const user = await userRepository.findById(req.user.userId);

      if (!user) {
        next(new AppError("Kullanıcı bulunamadı.", 404));
        return;
      }

      if (!options.roles.includes(user.roleId as RoleId)) {
        next(new AppError("Bu işlem için yetkiniz yok.", 403));
        return;
      }

      if (options.requireActive && !user.isActive) {
        next(new AppError("Hesabınız henüz aktif değil.", 403));
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
