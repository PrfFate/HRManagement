import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import { jwtService } from "../../modules/auth/jwt.service.js";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError("Oturum bilgisi bulunamadı.", 401));
    return;
  }

  try {
    const token = header.replace("Bearer ", "");
    req.user = jwtService.verify(token);
    next();
  } catch {
    next(new AppError("Oturum bilgisi geçersiz.", 401));
  }
}
