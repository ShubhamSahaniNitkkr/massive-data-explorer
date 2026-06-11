import { Alert, Box } from '@mantine/core';
import { useEffect } from 'react';

import { ConceptControlBento } from '@/features/concepts/components/ConceptControlBento';
import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';
import { FilterPanelSlot } from '@/features/filters/components/FilterPanelSlot';
import { recordVisitedPage } from '@/services/indexeddb/visitedPagesRepo';
import { FeatureErrorBoundary } from '@/shared/components/ui/FeatureErrorBoundary';
import { useAppSelector } from '@/shared/hooks/useAppDispatch';

import { useInfiniteData } from '../hooks/useInfiniteData';
import { DataTable } from './DataTable/DataTable';
export function ExplorerPage() {
  const activeEntity = useAppSelector((state) => state.explorerUi.activeEntity);
  const indexedDBEnabled = useConceptEnabled('indexedDB');
  const errorBoundaryEnabled = useConceptEnabled('errorBoundary');
  const {
    data,
    total,
    isLoading,
    isFetching,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    showingStaleData,
  } = useInfiniteData(activeEntity);

  useEffect(() => {
    if (indexedDBEnabled) {
      recordVisitedPage('/', 'Data Explorer');
    }
  }, [indexedDBEnabled]);

  return (
    <Box className="explorer-layout">
      <div className="explorer-bento-grid">
        <div className="explorer-table-pane">
          {showingStaleData && (
            <Alert color="violet" variant="light" mb="sm" title="Showing previous results">
              Keep Previous Data is holding the last rows while the new query loads.
            </Alert>
          )}
          {errorBoundaryEnabled ? (
            <FeatureErrorBoundary featureName="Data table">
              <DataTable
                entity={activeEntity}
                data={data}
                total={total}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}
                error={error}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                refetch={refetch}
              />
            </FeatureErrorBoundary>
          ) : (
            <DataTable
              entity={activeEntity}
              data={data}
              total={total}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
              error={error}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              refetch={refetch}
            />
          )}
        </div>

        <aside
          className="explorer-control-pane explorer-control-pane--premium"
          aria-label="iOS mirror control center"
        >
          <ConceptControlBento />
        </aside>
      </div>

      <FilterPanelSlot entity={activeEntity} />
    </Box>
  );
}
