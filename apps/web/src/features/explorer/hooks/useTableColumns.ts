import type { EntityType } from '@mde/shared';
import { ENTITY_FIELD_META } from '@mde/shared';
import { useEffect, useMemo } from 'react';

import { setColumns, type ColumnConfig } from '@/features/explorer/store/explorerUiSlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

const DEFAULT_WIDTHS: Record<string, number> = {
  id: 120,
  email: 200,
  name: 180,
  orderNumber: 150,
  reference: 160,
};

function getDefaultWidth(key: string): number {
  return DEFAULT_WIDTHS[key] ?? 140;
}

export function useTableColumns(entity: EntityType) {
  const dispatch = useAppDispatch();
  const columns = useAppSelector((state) => state.explorerUi.columns[entity]);
  const fieldMeta = ENTITY_FIELD_META[entity];

  useEffect(() => {
    if (columns.length === 0) {
      const defaultColumns: ColumnConfig[] = fieldMeta.fields.map((field, index) => ({
        key: field.key,
        visible: true,
        width: getDefaultWidth(field.key),
        order: index,
      }));
      dispatch(setColumns({ entity, columns: defaultColumns }));
    }
  }, [entity, columns.length, dispatch, fieldMeta.fields]);

  const visibleColumns = useMemo(
    () =>
      [...columns]
        .filter((c) => c.visible)
        .sort((a, b) => a.order - b.order)
        .map((col) => {
          const meta = fieldMeta.fields.find((f) => f.key === col.key);
          return { ...col, meta };
        }),
    [columns, fieldMeta.fields],
  );

  return { columns, visibleColumns, fieldMeta };
}
