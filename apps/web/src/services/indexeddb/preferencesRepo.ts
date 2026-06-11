import type { EntityType } from '@mde/shared';
import { DEFAULT_PAGE_SIZE } from '@mde/shared';

import type { TableDensity } from '@/features/settings/store/preferencesSlice';
import type { ColorScheme } from '@/features/settings/store/themeSlice';

import { db, type UserPreferencesDoc } from './db';

const PREFERENCES_ID = 1;

export async function loadPreferences(): Promise<UserPreferencesDoc | null> {
  const prefs = await db.preferences.get(PREFERENCES_ID);
  return prefs ?? null;
}

export async function savePreferences(prefs: Partial<Omit<UserPreferencesDoc, 'id'>>): Promise<void> {
  const existing = await db.preferences.get(PREFERENCES_ID);
  const doc: UserPreferencesDoc = {
    id: PREFERENCES_ID,
    colorScheme: prefs.colorScheme ?? existing?.colorScheme ?? 'light',
    defaultPageSize: prefs.defaultPageSize ?? existing?.defaultPageSize ?? DEFAULT_PAGE_SIZE,
    defaultEntity: prefs.defaultEntity ?? existing?.defaultEntity ?? 'users',
    density: prefs.density ?? existing?.density ?? 'comfortable',
    sidebarCollapsed: prefs.sidebarCollapsed ?? existing?.sidebarCollapsed ?? false,
  };
  await db.preferences.put(doc);
}

export async function getDefaultPreferences(): Promise<UserPreferencesDoc> {
  return {
    id: PREFERENCES_ID,
    colorScheme: 'light' as ColorScheme,
    defaultPageSize: DEFAULT_PAGE_SIZE,
    defaultEntity: 'users' as EntityType,
    density: 'comfortable' as TableDensity,
    sidebarCollapsed: false,
  };
}
