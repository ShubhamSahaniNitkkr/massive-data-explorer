import { describe, expect, it } from 'vitest';

import sortingReducer, { clearSort, toggleSortColumn } from './sortingUiSlice';

describe('sortingUiSlice', () => {
  it('toggles single column sort asc -> desc -> clear', () => {
    let state = sortingReducer(undefined, toggleSortColumn({ field: 'name', multi: false }));
    expect(state.sortColumns).toEqual([{ field: 'name', direction: 'asc' }]);

    state = sortingReducer(state, toggleSortColumn({ field: 'name', multi: false }));
    expect(state.sortColumns).toEqual([{ field: 'name', direction: 'desc' }]);

    state = sortingReducer(state, toggleSortColumn({ field: 'name', multi: false }));
    expect(state.sortColumns).toEqual([]);
  });

  it('supports multi-column sort with shift', () => {
    let state = sortingReducer(undefined, toggleSortColumn({ field: 'name', multi: false }));
    state = sortingReducer(state, toggleSortColumn({ field: 'email', multi: true }));
    expect(state.sortColumns).toHaveLength(2);
  });

  it('clears all sort columns', () => {
    let state = sortingReducer(undefined, toggleSortColumn({ field: 'name', multi: false }));
    state = sortingReducer(state, clearSort());
    expect(state.sortColumns).toEqual([]);
  });
});
