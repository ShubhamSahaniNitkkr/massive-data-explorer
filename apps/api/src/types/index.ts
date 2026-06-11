import type { EntityRecord, EntityType } from '@mde/shared';
import type { ListQueryParams } from '@mde/shared';

export interface DataStore {
  users: import('@mde/shared').User[];
  orders: import('@mde/shared').Order[];
  transactions: import('@mde/shared').Transaction[];
}

export interface ListOptions extends ListQueryParams {
  entity: EntityType;
}

export type { EntityRecord, EntityType, ListQueryParams };
