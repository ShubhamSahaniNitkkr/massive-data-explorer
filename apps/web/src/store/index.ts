import { configureStore } from '@reduxjs/toolkit';

import conceptControlsReducer from '@/features/concepts/store/conceptControlsSlice';
import explorerUiReducer from '@/features/explorer/store/explorerUiSlice';
import filtersUiReducer from '@/features/filters/store/filtersUiSlice';
import preferencesReducer from '@/features/settings/store/preferencesSlice';
import themeReducer from '@/features/settings/store/themeSlice';
import searchUiReducer from '@/features/search/store/searchUiSlice';
import sortingUiReducer from '@/features/sorting/store/sortingUiSlice';

import { baseApi } from './api/baseApi';
import './api/dataApi';
import { performanceMiddleware } from './middleware/performanceMiddleware';
import { sentryMiddleware } from './middleware/sentryMiddleware';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    conceptControls: conceptControlsReducer,
    preferences: preferencesReducer,
    explorerUi: explorerUiReducer,
    searchUi: searchUiReducer,
    filtersUi: filtersUiReducer,
    sortingUi: sortingUiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
      .concat(baseApi.middleware)
      .concat(performanceMiddleware)
      .concat(sentryMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
