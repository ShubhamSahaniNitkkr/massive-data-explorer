import type { FilterAst } from '@mde/shared';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SavedFilter {
  id: string;
  name: string;
  filter: FilterAst;
  createdAt: string;
}

interface FiltersUiState {
  activeFilter: FilterAst | null;
  filterJson: string;
  savedFilters: SavedFilter[];
  isPanelOpen: boolean;
}

const initialState: FiltersUiState = {
  activeFilter: null,
  filterJson: '',
  savedFilters: [],
  isPanelOpen: false,
};

const filtersUiSlice = createSlice({
  name: 'filtersUi',
  initialState,
  reducers: {
    setActiveFilter(state, action: PayloadAction<FilterAst | null>) {
      state.activeFilter = action.payload;
      state.filterJson = action.payload ? JSON.stringify(action.payload) : '';
    },
    setFilterJson(state, action: PayloadAction<string>) {
      state.filterJson = action.payload;
    },
    clearFilters(state) {
      state.activeFilter = null;
      state.filterJson = '';
    },
    setPanelOpen(state, action: PayloadAction<boolean>) {
      state.isPanelOpen = action.payload;
    },
    addSavedFilter(state, action: PayloadAction<SavedFilter>) {
      state.savedFilters.unshift(action.payload);
      if (state.savedFilters.length > 20) {
        state.savedFilters = state.savedFilters.slice(0, 20);
      }
    },
    removeSavedFilter(state, action: PayloadAction<string>) {
      state.savedFilters = state.savedFilters.filter((f) => f.id !== action.payload);
    },
    hydrateSavedFilters(state, action: PayloadAction<SavedFilter[]>) {
      state.savedFilters = action.payload;
    },
    applySavedFilter(state, action: PayloadAction<string>) {
      const saved = state.savedFilters.find((f) => f.id === action.payload);
      if (saved) {
        state.activeFilter = saved.filter;
        state.filterJson = JSON.stringify(saved.filter);
      }
    },
  },
});

export const {
  setActiveFilter,
  setFilterJson,
  clearFilters,
  setPanelOpen,
  addSavedFilter,
  removeSavedFilter,
  hydrateSavedFilters,
  applySavedFilter,
} = filtersUiSlice.actions;
export default filtersUiSlice.reducer;
