import type { EntityType } from '@mde/shared';
import { ENTITY_LABELS, ENTITY_TYPES } from '@mde/shared';
import { Group, Text, UnstyledButton } from '@mantine/core';

import { setActiveEntity } from '@/features/explorer/store/explorerUiSlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

export function EntityTabs() {
  const dispatch = useAppDispatch();
  const activeEntity = useAppSelector((state) => state.explorerUi.activeEntity);

  return (
    <Group gap={6} className="entity-tabs" role="tablist" aria-label="Dataset selection">
      {ENTITY_TYPES.map((entity) => {
        const active = activeEntity === entity;
        return (
          <UnstyledButton
            key={entity}
            role="tab"
            aria-selected={active}
            className={`entity-tab ${active ? 'entity-tab--active' : ''}`}
            onClick={() => dispatch(setActiveEntity(entity))}
          >
            <Text size="sm" fw={active ? 600 : 500}>
              {ENTITY_LABELS[entity]}
            </Text>
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
