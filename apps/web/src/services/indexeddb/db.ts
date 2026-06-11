import type { FilterAst } from '@mde/shared';
import Dexie, { type EntityTable } from 'dexie';

import type { ColorScheme } from '@/features/settings/store/themeSlice';
import type { TableDensity } from '@/features/settings/store/preferencesSlice';

export interface SearchHistoryEntry {
  id?: number;
  query: string;
  timestamp: string;
  entity: string;
}

export interface VisitedPageEntry {
  id?: number;
  path: string;
  title: string;
  visitedAt: string;
}

export interface UserPreferencesDoc {
  id: number;
  colorScheme: ColorScheme;
  defaultPageSize: number;
  defaultEntity: string;
  density: TableDensity;
  sidebarCollapsed: boolean;
}

export interface SavedFilterDoc {
  id?: number;
  name: string;
  filter: FilterAst;
  entity: string;
  createdAt: string;
}

export class AppDatabase extends Dexie {
  searchHistory!: EntityTable<SearchHistoryEntry, 'id'>;
  visitedPages!: EntityTable<VisitedPageEntry, 'id'>;
  preferences!: EntityTable<UserPreferencesDoc, 'id'>;
  savedFilters!: EntityTable<SavedFilterDoc, 'id'>;

  constructor() {
    super('MassiveDatasetExplorer');

    this.version(1).stores({
      searchHistory: '++id, query, timestamp, entity',
      visitedPages: '++id, path, visitedAt',
      preferences: 'id',
      savedFilters: '++id, name, entity, createdAt',
    });
  }
}

export const db = new AppDatabase();
