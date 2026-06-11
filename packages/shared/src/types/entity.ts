import type { Order } from './order.js';
import type { Transaction } from './transaction.js';
import type { User } from './user.js';

export type EntityType = 'users' | 'orders' | 'transactions';

export type EntityRecord = User | Order | Transaction;

export interface FieldMeta {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'enum';
  sortable: boolean;
  filterable: boolean;
  searchable: boolean;
  enumValues?: string[];
}

export interface EntityMeta {
  entity: EntityType;
  fields: FieldMeta[];
}
