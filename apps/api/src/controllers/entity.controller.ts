import { ENTITY_FIELD_META } from '@mde/shared';
import type { EntityType } from '@mde/shared';
import type { Request, Response } from 'express';

import { AppError } from '../middleware/errorHandler.js';
import { getEntityById, getEntityStats, listEntities } from '../services/listService.js';

export async function listHandler(req: Request, res: Response): Promise<void> {
  const entity = req.params.entity as EntityType;
  if (!['users', 'orders', 'transactions'].includes(entity)) {
    throw new AppError(404, 'NOT_FOUND', `Entity '${entity}' not found`);
  }

  const result = await listEntities({
    entity,
    cursor: req.query.cursor as string | undefined,
    limit: Number(req.query.limit) || 50,
    sort: req.query.sort as string | undefined,
    search: req.query.search as string | undefined,
    filter: req.query.filter as string | undefined,
    simulateLatency: req.query.simulateLatency
      ? Number(req.query.simulateLatency)
      : undefined,
  });

  res.setHeader('Cache-Control', 'no-store');
  res.json(result);
}

export async function getByIdHandler(req: Request, res: Response): Promise<void> {
  const entity = req.params.entity as EntityType;
  if (!['users', 'orders', 'transactions'].includes(entity)) {
    throw new AppError(404, 'NOT_FOUND', `Entity '${entity}' not found`);
  }

  const id = String(req.params.id);
  const record = getEntityById(entity, id);
  if (!record) {
    throw new AppError(404, 'NOT_FOUND', `${entity} record not found`);
  }

  res.json({ data: record });
}

export async function statsHandler(req: Request, res: Response): Promise<void> {
  const entity = req.params.entity as EntityType;
  if (!['users', 'orders', 'transactions'].includes(entity)) {
    throw new AppError(404, 'NOT_FOUND', `Entity '${entity}' not found`);
  }

  res.json({ data: getEntityStats(entity) });
}

export async function fieldsHandler(req: Request, res: Response): Promise<void> {
  const entity = req.params.entity as EntityType;
  const meta = ENTITY_FIELD_META[entity];
  if (!meta) {
    throw new AppError(404, 'NOT_FOUND', `Entity '${entity}' not found`);
  }

  res.json({ data: meta });
}
