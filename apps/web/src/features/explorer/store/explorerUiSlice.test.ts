import { describe, expect, it } from 'vitest';

import explorerReducer, {
  clearRowSelection,
  setActiveEntity,
  toggleRowSelection,
} from './explorerUiSlice';

describe('explorerUiSlice', () => {
  it('switches active entity and clears selection', () => {
    let state = explorerReducer(undefined, toggleRowSelection('usr_001'));
    expect(state.selectedRowIds).toEqual(['usr_001']);

    state = explorerReducer(state, setActiveEntity('orders'));
    expect(state.activeEntity).toBe('orders');
    expect(state.selectedRowIds).toEqual([]);
  });

  it('clears row selection', () => {
    let state = explorerReducer(undefined, toggleRowSelection('usr_001'));
    state = explorerReducer(state, clearRowSelection());
    expect(state.selectedRowIds).toEqual([]);
  });
});
