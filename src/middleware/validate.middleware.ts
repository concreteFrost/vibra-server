// src/middleware/validate.middleware.ts

import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError, prettifyError } from "zod";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: prettifyError(error),
        });
      }

      return res.status(500).json({
        message: "Validation error",
      });
    }
  };
