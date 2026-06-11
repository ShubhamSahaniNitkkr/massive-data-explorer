import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';

export async function simulateLatency(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const override = req.query.simulateLatency;
  const min = override !== undefined ? 0 : env.SIMULATE_LATENCY_MIN;
  const max = override !== undefined ? Number(override) : env.SIMULATE_LATENCY_MAX;

  const delay = override !== undefined
    ? Number(override)
    : Math.floor(Math.random() * (max - min + 1)) + min;

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  next();
}
