import type { EntityType } from '@mde/shared';
import { ActionIcon, Group, Menu, Text } from '@mantine/core';
import { useLiveQuery } from 'dexie-react-hooks';

import { setActiveFilter } from '@/features/filters/store/filtersUiSlice';
import { db } from '@/services/indexeddb/db';
import { deleteSavedFilterFromDb } from '@/services/indexeddb/savedFiltersRepo';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

interface SavedFiltersMenuProps {
  entity: EntityType;
}

export function SavedFiltersMenu({ entity }: SavedFiltersMenuProps) {
  const dispatch = useAppDispatch();
  const savedFilters = useLiveQuery(
    () => db.savedFilters.where('entity').equals(entity).reverse().sortBy('createdAt'),
    [entity],
  );

  if (!savedFilters?.length) {
    return (
      <Text size="sm" c="dimmed">
        No saved filters
      </Text>
    );
  }

  return (
    <Menu>
      <Menu.Target>
        <Text size="sm" style={{ cursor: 'pointer' }} c="blue" tabIndex={0} role="button">
          Saved Filters ({savedFilters.length})
        </Text>
      </Menu.Target>
      <Menu.Dropdown>
        {savedFilters.map((filter) => (
          <Menu.Item key={filter.id}>
            <Group justify="space-between" wrap="nowrap">
              <Text
                size="sm"
                style={{ cursor: 'pointer', flex: 1 }}
                onClick={() => dispatch(setActiveFilter(filter.filter))}
              >
                {filter.name}
              </Text>
              <ActionIcon
                size="xs"
                variant="subtle"
                color="red"
                aria-label={`Delete saved filter ${filter.name}`}
                onClick={() => filter.id && deleteSavedFilterFromDb(filter.id)}
              >
                ×
              </ActionIcon>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
