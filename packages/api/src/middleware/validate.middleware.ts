import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.errors?.map((e: any) => ({ field: e.path.join('.'), message: e.message })),
    });
  }
};
