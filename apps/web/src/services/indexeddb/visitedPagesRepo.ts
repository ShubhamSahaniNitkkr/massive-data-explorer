import { MAX_VISITED_PAGES } from '@/shared/constants/config';

import { db } from './db';

export async function recordVisitedPage(path: string, title: string): Promise<void> {
  const existing = await db.visitedPages.where('path').equals(path).first();
  const visitedAt = new Date().toISOString();

  if (existing?.id) {
    await db.visitedPages.update(existing.id, { visitedAt, title });
  } else {
    await db.visitedPages.add({ path, title, visitedAt });
  }

  const count = await db.visitedPages.count();
  if (count > MAX_VISITED_PAGES) {
    const oldest = await db.visitedPages.orderBy('visitedAt').limit(count - MAX_VISITED_PAGES).toArray();
    await db.visitedPages.bulkDelete(oldest.map((e) => e.id!));
  }
}

export async function getVisitedPages(limit = 10) {
  return db.visitedPages.orderBy('visitedAt').reverse().limit(limit).toArray();
}
