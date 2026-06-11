import type { EntityType } from '@mde/shared';
import { DEFAULT_PAGE_SIZE } from '@mde/shared';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TableDensity = 'compact' | 'comfortable' | 'spacious';

interface PreferencesState {
  defaultPageSize: number;
  defaultEntity: EntityType;
  density: TableDensity;
  sidebarCollapsed: boolean;
}

const initialState: PreferencesState = {
  defaultPageSize: DEFAULT_PAGE_SIZE,
  defaultEntity: 'users',
  density: 'comfortable',
  sidebarCollapsed: false,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setDefaultPageSize(state, action: PayloadAction<number>) {
      state.defaultPageSize = action.payload;
    },
    setDefaultEntity(state, action: PayloadAction<EntityType>) {
      state.defaultEntity = action.payload;
    },
    setDensity(state, action: PayloadAction<TableDensity>) {
      state.density = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    hydratePreferences(state, action: PayloadAction<Partial<PreferencesState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setDefaultPageSize,
  setDefaultEntity,
  setDensity,
  toggleSidebar,
  setSidebarCollapsed,
  hydratePreferences,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
