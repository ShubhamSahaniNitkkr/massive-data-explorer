import type { EntityType } from '@mde/shared';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ColumnConfig {
  key: string;
  visible: boolean;
  width: number;
  order: number;
}

interface ExplorerUiState {
  activeEntity: EntityType;
  columns: Record<EntityType, ColumnConfig[]>;
  selectedRowIds: string[];
  bulkActionMode: boolean;
}

const initialState: ExplorerUiState = {
  activeEntity: 'users',
  columns: {
    users: [],
    orders: [],
    transactions: [],
  },
  selectedRowIds: [],
  bulkActionMode: false,
};

const explorerUiSlice = createSlice({
  name: 'explorerUi',
  initialState,
  reducers: {
    setActiveEntity(state, action: PayloadAction<EntityType>) {
      state.activeEntity = action.payload;
      state.selectedRowIds = [];
      state.bulkActionMode = false;
    },
    setColumns(state, action: PayloadAction<{ entity: EntityType; columns: ColumnConfig[] }>) {
      state.columns[action.payload.entity] = action.payload.columns;
    },
    toggleColumnVisibility(state, action: PayloadAction<{ entity: EntityType; key: string }>) {
      const columns = state.columns[action.payload.entity];
      const col = columns.find((c) => c.key === action.payload.key);
      if (col) col.visible = !col.visible;
    },
    setColumnWidth(
      state,
      action: PayloadAction<{ entity: EntityType; key: string; width: number }>,
    ) {
      const col = state.columns[action.payload.entity].find((c) => c.key === action.payload.key);
      if (col) col.width = action.payload.width;
    },
    toggleRowSelection(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.selectedRowIds.indexOf(id);
      if (index === -1) {
        state.selectedRowIds.push(id);
      } else {
        state.selectedRowIds.splice(index, 1);
      }
    },
    selectAllRows(state, action: PayloadAction<string[]>) {
      state.selectedRowIds = action.payload;
    },
    clearRowSelection(state) {
      state.selectedRowIds = [];
      state.bulkActionMode = false;
    },
    setBulkActionMode(state, action: PayloadAction<boolean>) {
      state.bulkActionMode = action.payload;
    },
  },
});

export const {
  setActiveEntity,
  setColumns,
  toggleColumnVisibility,
  setColumnWidth,
  toggleRowSelection,
  selectAllRows,
  clearRowSelection,
  setBulkActionMode,
} = explorerUiSlice.actions;
export default explorerUiSlice.reducer;
