import { useCallback, useReducer } from 'react';

import {
  clearRowSelection,
  selectAllRows,
  toggleRowSelection,
} from '@/features/explorer/store/explorerUiSlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

type SelectionAction =
  | { type: 'TOGGLE'; id: string }
  | { type: 'SELECT_ALL'; ids: string[] }
  | { type: 'CLEAR' }
  | { type: 'BULK_START' }
  | { type: 'BULK_COMPLETE' };

interface SelectionState {
  mode: 'idle' | 'selecting' | 'bulk-action-pending';
}

function selectionReducer(state: SelectionState, action: SelectionAction): SelectionState {
  switch (action.type) {
    case 'TOGGLE':
    case 'SELECT_ALL':
      return { ...state, mode: 'selecting' };
    case 'CLEAR':
      return { mode: 'idle' };
    case 'BULK_START':
      return { mode: 'bulk-action-pending' };
    case 'BULK_COMPLETE':
      return { mode: 'idle' };
    default:
      return state;
  }
}

export function useRowSelection() {
  const dispatch = useAppDispatch();
  const selectedRowIds = useAppSelector((state) => state.explorerUi.selectedRowIds);
  const [localState, localDispatch] = useReducer(selectionReducer, { mode: 'idle' });

  const toggle = useCallback(
    (id: string) => {
      dispatch(toggleRowSelection(id));
      localDispatch({ type: 'TOGGLE', id });
    },
    [dispatch],
  );

  const selectAll = useCallback(
    (ids: string[]) => {
      dispatch(selectAllRows(ids));
      localDispatch({ type: 'SELECT_ALL', ids });
    },
    [dispatch],
  );

  const clear = useCallback(() => {
    dispatch(clearRowSelection());
    localDispatch({ type: 'CLEAR' });
  }, [dispatch]);

  const isSelected = useCallback(
    (id: string) => selectedRowIds.includes(id),
    [selectedRowIds],
  );

  return {
    selectedRowIds,
    selectionMode: localState.mode,
    toggle,
    selectAll,
    clear,
    isSelected,
    selectedCount: selectedRowIds.length,
  };
}
