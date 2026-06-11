import type { EntityType } from '@mde/shared';
import { ENTITY_LABELS } from '@mde/shared';
import { Badge, Button, Group, Text } from '@mantine/core';

import { setPanelOpen } from '@/features/filters/store/filtersUiSlice';
import { clearSort } from '@/features/sorting/store/sortingUiSlice';
import { formatNumber } from '@/shared/utils/format';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

import { ColumnVisibilityMenu } from './ColumnVisibilityMenu';

interface DataTableToolbarProps {
  entity: EntityType;
  total: number;
  loadedCount: number;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onRefresh: () => void;
}

export function DataTableToolbar({
  entity,
  total,
  loadedCount,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  onRefresh,
}: DataTableToolbarProps) {
  const dispatch = useAppDispatch();
  const sortColumns = useAppSelector((state) => state.sortingUi.sortColumns);
  const activeFilter = useAppSelector((state) => state.filtersUi.activeFilter);
  const loadPercent = total > 0 ? Math.min(100, Math.round((loadedCount / total) * 100)) : 0;

  return (
    <Group justify="space-between" p="md" wrap="wrap" className="data-table-toolbar">
      <Group gap="sm" className="data-table-toolbar__meta">
        <Text fw={700} className="data-table-toolbar__title">
          {ENTITY_LABELS[entity]}
        </Text>
        <Badge variant="light" color="violet" className="data-table-toolbar__count">
          {formatNumber(loadedCount)} loaded
        </Badge>
        <Text size="xs" c="dimmed" className="data-table-toolbar__total">
          of {formatNumber(total)} total rows ({loadPercent}%)
        </Text>
        {(isFetching || isFetchingNextPage) && (
          <Text size="xs" c="violet" aria-live="polite" className="data-table-toolbar__status">
            {isFetchingNextPage ? 'Loading more rows…' : 'Refreshing…'}
          </Text>
        )}
        {hasNextPage && !isFetchingNextPage && (
          <Text size="xs" c="dimmed" className="data-table-toolbar__hint">
            Scroll — {formatNumber(total - loadedCount)} more rows on server
          </Text>
        )}
      </Group>
      <Group gap="xs" className="data-table-toolbar__actions">
        {sortColumns.length > 0 && (
          <Button size="compact-sm" variant="subtle" onClick={() => dispatch(clearSort())}>
            Clear sort
          </Button>
        )}
        <Button
          size="compact-sm"
          variant={activeFilter ? 'filled' : 'light'}
          onClick={() => dispatch(setPanelOpen(true))}
          aria-label="Open filters panel"
        >
          Filters{activeFilter ? ` (${activeFilter.conditions.length})` : ''}
        </Button>
        <ColumnVisibilityMenu entity={entity} />
        <Button size="compact-sm" variant="default" onClick={onRefresh} loading={isFetching}>
          Refresh
        </Button>
      </Group>
    </Group>
  );
}
