import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";

import { AppError } from "../errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        message: "Bu kayıt zaten mevcut.",
      });
      return;
    }

    if (error.code === "P2003") {
      res.status(400).json({
        success: false,
        message: "İlişkili kayıt bulunamadı.",
      });
      return;
    }
  }

  const isKnownError = error instanceof AppError;
  const statusCode = isKnownError ? error.statusCode : 500;
  const message = isKnownError ? error.message : "Beklenmeyen bir hata oluştu.";

  res.status(statusCode).json({
    success: false,
    message,
    ...(error instanceof AppError && error.errors ? { errors: error.errors } : {}),
  });
};
