import type { EntityType } from '@mde/shared';
import { lazy, Suspense, useEffect } from 'react';

import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';
import { touchConceptActivity } from '@/features/concepts/utils/conceptActivity';
import { LoadingOverlay } from '@/shared/components/ui/LoadingOverlay';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import { FilterPanelEager } from './FilterPanelEager';

const LazyFilterPanel = lazy(() =>
  import('./FilterPanel').then((m) => ({ default: m.FilterPanel })),
);

interface FilterPanelSlotProps {
  entity: EntityType;
}

function SuspenseFallback() {
  const dispatch = useAppDispatch();
  const suspenseEnabled = useConceptEnabled('suspense');

  useEffect(() => {
    if (suspenseEnabled) {
      touchConceptActivity(dispatch, 'suspense');
    }
  }, [suspenseEnabled, dispatch]);

  return suspenseEnabled ? <LoadingOverlay visible message="Loading filters..." /> : null;
}

export function FilterPanelSlot({ entity }: FilterPanelSlotProps) {
  const codeSplittingEnabled = useConceptEnabled('codeSplitting');

  if (codeSplittingEnabled) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <LazyFilterPanel entity={entity} />
      </Suspense>
    );
  }

  return <FilterPanelEager entity={entity} />;
}
