import type { SortColumn } from '@mde/shared';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SortingUiState {
  sortColumns: SortColumn[];
}

const initialState: SortingUiState = {
  sortColumns: [],
};

const sortingUiSlice = createSlice({
  name: 'sortingUi',
  initialState,
  reducers: {
    setSortColumns(state, action: PayloadAction<SortColumn[]>) {
      state.sortColumns = action.payload;
    },
    toggleSortColumn(state, action: PayloadAction<{ field: string; multi: boolean }>) {
      const { field, multi } = action.payload;
      const existing = state.sortColumns.find((c) => c.field === field);

      if (!multi) {
        if (!existing) {
          state.sortColumns = [{ field, direction: 'asc' }];
        } else if (existing.direction === 'asc') {
          existing.direction = 'desc';
        } else {
          state.sortColumns = [];
        }
        return;
      }

      if (!existing) {
        state.sortColumns.push({ field, direction: 'asc' });
      } else if (existing.direction === 'asc') {
        existing.direction = 'desc';
      } else {
        state.sortColumns = state.sortColumns.filter((c) => c.field !== field);
      }
    },
    clearSort(state) {
      state.sortColumns = [];
    },
  },
});

export const { setSortColumns, toggleSortColumn, clearSort } = sortingUiSlice.actions;
export default sortingUiSlice.reducer;
