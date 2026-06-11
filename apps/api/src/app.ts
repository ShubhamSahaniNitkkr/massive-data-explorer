import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { simulateLatency } from './middleware/simulateLatency.js';
import { validateListQuery } from './middleware/validateQuery.js';
import { router } from './routes/index.js';

import type { Express } from 'express';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use('/api/v1', simulateLatency);
  app.use('/api/v1', router);
  app.use(errorHandler);

  return app;
}
