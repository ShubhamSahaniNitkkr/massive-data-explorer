import type { SortColumn } from '@mde/shared';
import { ActionIcon, Checkbox, Group, Text } from '@mantine/core';
import { useCallback } from 'react';

interface ColumnHeader {
  key: string;
  label: string;
  width: number;
  sortable: boolean;
}

interface DataTableHeaderUnmemoizedProps {
  columns: ColumnHeader[];
  sortColumns: SortColumn[];
  onSort: (field: string, multi: boolean) => void;
  onResize: (key: string, width: number) => void;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: () => void;
}

export function DataTableHeaderUnmemoized({
  columns,
  sortColumns,
  onSort,
  onResize,
  allSelected,
  someSelected,
  onSelectAll,
}: DataTableHeaderUnmemoizedProps) {
  const getSortDirection = useCallback(
    (field: string) => sortColumns.find((c) => c.field === field)?.direction,
    [sortColumns],
  );

  const handleSort = useCallback(
    (field: string, event: React.MouseEvent) => {
      onSort(field, event.shiftKey);
    },
    [onSort],
  );

  const handleResizeStart = useCallback(
    (key: string, startX: number, startWidth: number) => {
      const onMouseMove = (e: MouseEvent) => {
        onResize(key, Math.max(80, startWidth + (e.clientX - startX)));
      };
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [onResize],
  );

  const gridTemplateColumns = `48px ${columns.map((c) => `${c.width}px`).join(' ')}`;

  return (
    <div
      role="row"
      style={{
        display: 'grid',
        gridTemplateColumns,
        alignItems: 'center',
        padding: '8px',
        borderBottom: '2px solid var(--mantine-color-gray-4)',
        background: 'var(--mantine-color-body)',
      }}
    >
      <div role="columnheader">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={onSelectAll}
          aria-label="Select all rows on current page"
        />
      </div>
      {columns.map((col) => {
        const direction = getSortDirection(col.key);
        return (
          <div
            key={col.key}
            role="columnheader"
            aria-sort={
              direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'
            }
            style={{ position: 'relative' }}
          >
            <Group gap={4} wrap="nowrap" justify="space-between">
              {col.sortable ? (
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={(e) => handleSort(col.key, e)}
                  aria-label={`Sort by ${col.label}${direction ? `, currently ${direction}` : ''}`}
                  style={{ flex: 1, width: 'auto', height: 'auto' }}
                >
                  <Text size="sm" fw={600}>
                    {col.label}
                    {direction === 'asc' && ' ↑'}
                    {direction === 'desc' && ' ↓'}
                  </Text>
                </ActionIcon>
              ) : (
                <Text size="sm" fw={600}>
                  {col.label}
                </Text>
              )}
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label={`Resize ${col.label} column`}
                style={{
                  width: 4,
                  cursor: 'col-resize',
                  height: 20,
                  background: 'var(--mantine-color-gray-4)',
                }}
                onMouseDown={(e) => handleResizeStart(col.key, e.clientX, col.width)}
              />
            </Group>
          </div>
        );
      })}
    </div>
  );
}
