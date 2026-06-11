import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ColorScheme = 'light' | 'dark';

interface ThemeState {
  colorScheme: ColorScheme;
  useSystemPreference: boolean;
}

const initialState: ThemeState = {
  colorScheme: 'light',
  useSystemPreference: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setColorScheme(state, action: PayloadAction<ColorScheme>) {
      state.colorScheme = action.payload;
      state.useSystemPreference = false;
    },
    toggleColorScheme(state) {
      state.colorScheme = state.colorScheme === 'light' ? 'dark' : 'light';
      state.useSystemPreference = false;
    },
    setSystemPreference(state, action: PayloadAction<boolean>) {
      state.useSystemPreference = action.payload;
    },
  },
});

export const { setColorScheme, toggleColorScheme, setSystemPreference } = themeSlice.actions;
export default themeSlice.reducer;
