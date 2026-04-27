import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

import { AppError } from "../errors/AppError.js";

type RequestSchemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export function validateRequest(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as Request["query"];
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.reduce<Record<string, string>>((result, issue) => {
          const field = issue.path.join(".");

          if (field && !result[field]) {
            result[field] = issue.message;
          }

          return result;
        }, {});

        next(new AppError("Form alanlarını kontrol ediniz.", 400, errors));
        return;
      }

      next(error);
    }
  };
}
