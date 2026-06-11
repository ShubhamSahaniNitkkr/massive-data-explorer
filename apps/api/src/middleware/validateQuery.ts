import { listQuerySchema } from '@mde/shared';
import type { NextFunction, Request, Response } from 'express';

export function validateListQuery(req: Request, _res: Response, next: NextFunction): void {
  req.query = listQuerySchema.parse(req.query) as unknown as Request['query'];
  next();
}
