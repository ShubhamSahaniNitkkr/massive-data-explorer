import type { EntityRecord, EntityType } from '@mde/shared';
import { Alert, Box, Button, Checkbox, Group, Text } from '@mantine/core';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useTransition,
} from 'react';

import { incrementRenderCount } from '@/features/concepts/store/conceptControlsSlice';
import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';
import { touchConceptActivity } from '@/features/concepts/utils/conceptActivity';
import { setColumnWidth } from '@/features/explorer/store/explorerUiSlice';
import { AdaptiveSearchHighlight } from '@/features/search/components/AdaptiveSearchHighlight';
import { toggleSortColumn } from '@/features/sorting/store/sortingUiSlice';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { LoadingOverlay } from '@/shared/components/ui/LoadingOverlay';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';
import { formatCurrency, formatDateTime, formatNumber } from '@/shared/utils/format';

function loadProgressPercent(loaded: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((loaded / total) * 100));
}
import { throttle } from '@/shared/utils/throttle';

import { useIntersectionLoadMore } from '../../hooks/useIntersectionLoadMore';
import { useRowSelection } from '../../hooks/useRowSelection';
import { useTableColumns } from '../../hooks/useTableColumns';
import { BulkActionsBar } from './BulkActionsBar';
import { AdaptiveDataTableHeader } from './AdaptiveDataTableHeader';
import { DataTableToolbar } from './DataTableToolbar';

const ROW_HEIGHT = 44;

function formatCellValue(value: unknown, type?: string, key?: string): string {
  if (value === null || value === undefined) return '—';
  if (type === 'date') return formatDateTime(String(value));
  if (type === 'number') {
    if (key === 'total' || key === 'amount') return formatCurrency(Number(value));
    return formatNumber(Number(value));
  }
  return String(value);
}

interface DataTableProps {
  entity: EntityType;
  data: EntityRecord[];
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

function TableRowInner({
  record,
  rowIndex,
  gridTemplateColumns,
  searchQuery,
  selected,
  onToggle,
  visibleColumns,
}: {
  record: EntityRecord;
  rowIndex: number;
  gridTemplateColumns: string;
  searchQuery: string;
  selected: boolean;
  onToggle: (id: string) => void;
  visibleColumns: ReturnType<typeof useTableColumns>['visibleColumns'];
}) {
  const recordData = record as unknown as Record<string, unknown>;
  const zebra = rowIndex % 2 === 1;

  return (
    <div
      role="row"
      aria-rowindex={rowIndex + 2}
      aria-selected={selected}
      className={[
        'data-table-row',
        zebra ? 'data-table-row--zebra' : '',
        selected ? 'table-row-selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        display: 'grid',
        gridTemplateColumns,
        minHeight: ROW_HEIGHT,
      }}
    >
      <div role="gridcell">
        <Checkbox
          checked={selected}
          onChange={() => onToggle(record.id)}
          aria-label={`Select row ${record.id}`}
        />
      </div>
      {visibleColumns.map((col) => {
        const rawValue = recordData[col.key];
        const display = formatCellValue(rawValue, col.meta?.type, col.key);
        const isSearchable = typeof rawValue === 'string' && searchQuery;

        return (
          <div key={col.key} role="gridcell" className="data-table-cell">
            <Text size="sm" className="data-table-cell__text">
              {isSearchable ? (
                <AdaptiveSearchHighlight text={display} query={searchQuery} />
              ) : (
                display
              )}
            </Text>
          </div>
        );
      })}
    </div>
  );
}

const TableRowMemo = memo(TableRowInner);

export function DataTable({
  entity,
  data,
  total,
  isLoading,
  isFetching,
  isError,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  refetch,
}: DataTableProps) {
  const dispatch = useAppDispatch();
  const parentRef = useRef<HTMLDivElement>(null);
  const headerStripRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useAppSelector((state) => state.searchUi.debouncedQuery);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const sortColumns = useAppSelector((state) => state.sortingUi.sortColumns);
  const { visibleColumns } = useTableColumns(entity);
  const { selectedRowIds, toggle, selectAll, clear, isSelected, selectedCount } = useRowSelection();
  const virtualizationEnabled = useConceptEnabled('virtualization');
  const infiniteScrollEnabled = useConceptEnabled('infiniteScroll');
  const intersectionObserverEnabled = useConceptEnabled('intersectionObserver');
  const reactMemoEnabled = useConceptEnabled('reactMemo');
  const useCallbackEnabled = useConceptEnabled('useCallback');
  const useMemoEnabled = useConceptEnabled('useMemo');
  const useTransitionEnabled = useConceptEnabled('useTransition');
  const useDeferredValueEnabled = useConceptEnabled('useDeferredValue');
  const throttlingEnabled = useConceptEnabled('throttling');
  const [, startTransition] = useTransition();

  const searchQuery = useDeferredValueEnabled ? deferredQuery : debouncedQuery;

  useEffect(() => {
    if (useDeferredValueEnabled && debouncedQuery !== deferredQuery) {
      touchConceptActivity(dispatch, 'useDeferredValue');
    }
  }, [useDeferredValueEnabled, debouncedQuery, deferredQuery, dispatch]);

  const RowComponent = reactMemoEnabled ? TableRowMemo : TableRowInner;

  useEffect(() => {
    dispatch(incrementRenderCount());
  });

  const handleSortStable = useCallback(
    (field: string, multi: boolean) => {
      const action = () => dispatch(toggleSortColumn({ field, multi }));
      if (useTransitionEnabled) {
        touchConceptActivity(dispatch, 'useTransition');
        startTransition(action);
      } else action();
    },
    [dispatch, useTransitionEnabled, startTransition],
  );

  const handleSortUnstable = (field: string, multi: boolean) => {
    const action = () => dispatch(toggleSortColumn({ field, multi }));
    if (useTransitionEnabled) {
      touchConceptActivity(dispatch, 'useTransition');
      startTransition(action);
    } else action();
  };
  const handleSort = useCallbackEnabled ? handleSortStable : handleSortUnstable;

  const handleResizeStable = useCallback(
    (key: string, width: number) => {
      dispatch(setColumnWidth({ entity, key, width }));
    },
    [dispatch, entity],
  );

  const handleResizeUnstable = (key: string, width: number) => {
    dispatch(setColumnWidth({ entity, key, width }));
  };
  const handleResize = useCallbackEnabled ? handleResizeStable : handleResizeUnstable;

  const handleLoadMoreStable = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLoadMoreUnstable = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };
  const handleLoadMore = useCallbackEnabled ? handleLoadMoreStable : handleLoadMoreUnstable;

  const handleLoadMoreWithActivity = useCallback(() => {
    if (intersectionObserverEnabled && infiniteScrollEnabled) {
      touchConceptActivity(dispatch, 'intersectionObserver');
    }
    handleLoadMore();
  }, [intersectionObserverEnabled, infiniteScrollEnabled, dispatch, handleLoadMore]);

  const sentinelRef = useIntersectionLoadMore({
    onLoadMore: handleLoadMoreWithActivity,
    hasMore: !!hasNextPage,
    isLoading: isFetchingNextPage,
    enabled: infiniteScrollEnabled,
    useIntersectionObserver: intersectionObserverEnabled,
    scrollRootRef: parentRef,
  });

  const headerColumnsMemo = useMemo(
    () =>
      visibleColumns.map((col) => ({
        key: col.key,
        label: col.meta?.label ?? col.key,
        width: col.width,
        sortable: col.meta?.sortable ?? false,
      })),
    [visibleColumns],
  );

  const headerColumns = useMemoEnabled
    ? headerColumnsMemo
    : visibleColumns.map((col) => ({
        key: col.key,
        label: col.meta?.label ?? col.key,
        width: col.width,
        sortable: col.meta?.sortable ?? false,
      }));

  const virtualizer = useVirtualizer({
    count: virtualizationEnabled ? data.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 16,
  });

  const virtualRows = virtualizationEnabled ? virtualizer.getVirtualItems() : [];
  const allVisibleSelected = data.length > 0 && data.every((r) => selectedRowIds.includes(r.id));

  const handleTableScroll = useCallback(() => {
    if (headerStripRef.current && parentRef.current) {
      headerStripRef.current.scrollLeft = parentRef.current.scrollLeft;
    }
    if (throttlingEnabled) touchConceptActivity(dispatch, 'throttling');
    if (virtualizationEnabled) touchConceptActivity(dispatch, 'virtualization');
    if (infiniteScrollEnabled) touchConceptActivity(dispatch, 'infiniteScroll');
    if (!intersectionObserverEnabled && infiniteScrollEnabled) {
      touchConceptActivity(dispatch, 'intersectionObserver');
    }
  }, [
    dispatch,
    throttlingEnabled,
    virtualizationEnabled,
    infiniteScrollEnabled,
    intersectionObserverEnabled,
  ]);

  const throttledScrollHandler = useMemo(
    () => (throttlingEnabled ? throttle(handleTableScroll, 200) : handleTableScroll),
    [throttlingEnabled, handleTableScroll],
  );

  useEffect(() => {
    const el = parentRef.current;
    if (!el) return;
    el.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => el.removeEventListener('scroll', throttledScrollHandler);
  }, [throttledScrollHandler, data.length]);
  const someSelected = data.some((r) => selectedRowIds.includes(r.id));

  const handleSelectAllStable = useCallback(() => {
    if (allVisibleSelected) clear();
    else selectAll(data.map((r) => r.id));
  }, [allVisibleSelected, clear, selectAll, data]);

  const handleSelectAllUnstable = () => {
    if (allVisibleSelected) clear();
    else selectAll(data.map((r) => r.id));
  };
  const handleSelectAll = useCallbackEnabled ? handleSelectAllStable : handleSelectAllUnstable;

  const toggleStable = useCallback((id: string) => toggle(id), [toggle]);
  const toggleHandler = useCallbackEnabled ? toggleStable : (id: string) => toggle(id);

  const gridTemplateColumnsMemo = useMemo(
    () => `48px ${visibleColumns.map((c) => `${c.width}px`).join(' ')}`,
    [visibleColumns],
  );

  const gridTemplateColumns = useMemoEnabled
    ? gridTemplateColumnsMemo
    : `48px ${visibleColumns.map((c) => `${c.width}px`).join(' ')}`;

  const tableMinWidth = useMemo(
    () => 48 + visibleColumns.reduce((sum, col) => sum + col.width, 0),
    [visibleColumns],
  );

  const blockingError = isError && data.length === 0 && !isLoading;
  const loadMoreError = isError && data.length > 0;

  if (blockingError) {
    return (
      <Alert color="red" title="Failed to load data" role="alert">
        {(error as { data?: { error?: { message?: string } } })?.data?.error?.message ??
          'An error occurred while fetching data.'}
        <Box mt="sm">
          <Button size="xs" variant="light" color="red" onClick={() => refetch()}>
            Retry
          </Button>
        </Box>
      </Alert>
    );
  }

  return (
    <Box className="data-table-shell">
      <DataTableToolbar
        entity={entity}
        total={total}
        loadedCount={data.length}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onRefresh={refetch}
      />
      {loadMoreError && (
        <Alert color="red" variant="light" title="Could not load more rows" role="alert" mb="xs">
          {(error as { data?: { error?: { message?: string } } })?.data?.error?.message ??
            'A page request failed. Your loaded rows are still visible.'}
          <Box mt="xs">
            <Button size="xs" variant="light" color="red" onClick={() => refetch()}>
              Retry
            </Button>
          </Box>
        </Alert>
      )}
      <BulkActionsBar selectedCount={selectedCount} />

      {!virtualizationEnabled && data.length > 100 && (
        <Alert color="red" variant="light" mb="sm" title="Virtualization disabled">
          Rendering {data.length} DOM rows — scroll may freeze. Enable virtualization in the
          control panel.
        </Alert>
      )}

      {isLoading ? (
        <LoadingOverlay visible message="Loading dataset..." />
      ) : data.length === 0 ? (
        <EmptyState
          title="No records found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="data-table-frame data-table-premium">
          <div
            ref={headerStripRef}
            className="table-column-header-strip hide-scrollbar"
            aria-hidden={false}
          >
            <div style={{ minWidth: tableMinWidth }}>
              <AdaptiveDataTableHeader
                columns={headerColumns}
                sortColumns={sortColumns}
                onSort={handleSort}
                onResize={handleResize}
                allSelected={allVisibleSelected}
                someSelected={someSelected}
                onSelectAll={handleSelectAll}
              />
            </div>
          </div>

          <div
            ref={parentRef}
            className="table-scroll-container table-scroll-container--body"
            role="grid"
            aria-label={`${entity} data table`}
            aria-rowcount={total + 1}
            aria-colcount={visibleColumns.length + 1}
            aria-busy={isFetching}
          >
          {virtualizationEnabled ? (
            <div
              style={{
                height: virtualizer.getTotalSize(),
                position: 'relative',
                minWidth: tableMinWidth,
                width: tableMinWidth,
              }}
            >
              {virtualRows.map((virtualRow) => {
                const record = data[virtualRow.index];
                return (
                  <div
                    key={record.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: tableMinWidth,
                      minWidth: tableMinWidth,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <RowComponent
                      record={record}
                      rowIndex={virtualRow.index}
                      gridTemplateColumns={gridTemplateColumns}
                      searchQuery={searchQuery}
                      selected={isSelected(record.id)}
                      onToggle={toggleHandler}
                      visibleColumns={visibleColumns}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ minWidth: tableMinWidth, width: tableMinWidth }}>
              {data.map((record, index) => (
                <RowComponent
                  key={record.id}
                  record={record}
                  rowIndex={index}
                  gridTemplateColumns={gridTemplateColumns}
                  searchQuery={searchQuery}
                  selected={isSelected(record.id)}
                  onToggle={toggleHandler}
                  visibleColumns={visibleColumns}
                />
              ))}
            </div>
          )}

          {infiniteScrollEnabled ? (
            <div ref={sentinelRef} className="table-load-sentinel" aria-hidden="true" />
          ) : (
            hasNextPage && (
              <Group justify="center" py="md">
                <Button onClick={handleLoadMore} loading={isFetchingNextPage} variant="light">
                  Load more records
                </Button>
              </Group>
            )
          )}

          </div>

          <div className="data-table-footer" role="status" aria-live="polite">
            <div className="data-table-footer__stats">
              <Text size="sm" fw={600} className="data-table-footer__loaded">
                {formatNumber(data.length)} rows loaded
              </Text>
              <Text size="xs" c="dimmed">
                {formatNumber(total)} total in database
              </Text>
            </div>
            <div className="data-table-footer__progress-wrap">
              <div className="data-table-footer__progress-track">
                <div
                  className="data-table-footer__progress-fill"
                  style={{ width: `${loadProgressPercent(data.length, total)}%` }}
                />
              </div>
              <Text size="xs" c="dimmed" className="data-table-footer__percent">
                {loadProgressPercent(data.length, total)}% loaded
              </Text>
            </div>
            <Text size="xs" c="dimmed" className="data-table-footer__hint">
              {isFetchingNextPage
                ? 'Fetching next page…'
                : hasNextPage
                  ? `Only ${formatNumber(data.length)} of ${formatNumber(total)} rows in memory — keep scrolling (10 lakh dataset, loads in batches)`
                  : data.length >= total
                    ? `All ${formatNumber(total)} matching rows are loaded`
                    : `${formatNumber(data.length)} rows loaded — end of current result set`}
            </Text>
          </div>
        </div>
      )}
    </Box>
  );
}
