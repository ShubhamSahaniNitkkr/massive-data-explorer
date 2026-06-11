import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchUiState {
  query: string;
  debouncedQuery: string;
  highlightTerms: string[];
  isSearching: boolean;
}

const initialState: SearchUiState = {
  query: '',
  debouncedQuery: '',
  highlightTerms: [],
  isSearching: false,
};

const searchUiSlice = createSlice({
  name: 'searchUi',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.isSearching = action.payload.length > 0;
    },
    setDebouncedQuery(state, action: PayloadAction<string>) {
      state.debouncedQuery = action.payload;
      state.highlightTerms = action.payload.trim() ? action.payload.trim().split(/\s+/) : [];
      state.isSearching = false;
    },
    clearSearch(state) {
      state.query = '';
      state.debouncedQuery = '';
      state.highlightTerms = [];
      state.isSearching = false;
    },
  },
});

export const { setSearchQuery, setDebouncedQuery, clearSearch } = searchUiSlice.actions;
export default searchUiSlice.reducer;
