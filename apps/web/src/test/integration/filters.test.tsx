import { configureStore } from '@reduxjs/toolkit';
import { describe, expect, it } from 'vitest';

import filtersReducer, {
  clearFilters,
  setActiveFilter,
} from '@/features/filters/store/filtersUiSlice';

describe('Filters integration', () => {
  it('applies and clears filters through reducer', () => {
    const store = configureStore({ reducer: { filtersUi: filtersReducer } });

    store.dispatch(
      setActiveFilter({
        op: 'and',
        conditions: [{ field: 'status', op: 'eq', value: 'active' }],
      }),
    );

    expect(store.getState().filtersUi.activeFilter?.conditions).toHaveLength(1);

    store.dispatch(clearFilters());
    expect(store.getState().filtersUi.activeFilter).toBeNull();
  });
});
