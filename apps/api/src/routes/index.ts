import type { HealthResponse } from '@mde/shared';
import { Router, type IRouter } from 'express';

import { fieldsHandler, getByIdHandler, listHandler, statsHandler } from '../controllers/entity.controller.js';
import { validateListQuery } from '../middleware/validateQuery.js';
import { getRecordCounts } from '../services/dataStore.js';

export const router: IRouter = Router();

router.get('/health', (_req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    recordCounts: getRecordCounts(),
  };
  res.json(response);
});

router.get('/meta/fields/:entity', fieldsHandler);

router.get('/:entity/stats', statsHandler);
router.get('/:entity/:id', getByIdHandler);
router.get('/:entity', validateListQuery, listHandler);
