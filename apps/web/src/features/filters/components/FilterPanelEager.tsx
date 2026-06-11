import type { EntityType } from '@mde/shared';

import { FilterPanel } from './FilterPanel';

interface FilterPanelEagerProps {
  entity: EntityType;
}

export function FilterPanelEager({ entity }: FilterPanelEagerProps) {
  return <FilterPanel entity={entity} />;
}
