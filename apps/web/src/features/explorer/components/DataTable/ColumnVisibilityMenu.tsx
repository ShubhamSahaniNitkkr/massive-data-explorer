import { Button, Checkbox, Menu, Stack } from '@mantine/core';
import type { EntityType } from '@mde/shared';

import { toggleColumnVisibility } from '@/features/explorer/store/explorerUiSlice';
import { useTableColumns } from '@/features/explorer/hooks/useTableColumns';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

interface ColumnVisibilityMenuProps {
  entity: EntityType;
}

export function ColumnVisibilityMenu({ entity }: ColumnVisibilityMenuProps) {
  const dispatch = useAppDispatch();
  const { columns } = useTableColumns(entity);

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <Button variant="default" size="sm" aria-label="Toggle column visibility">
          Columns
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack gap="xs" p="xs">
          {columns.map((col) => (
            <Checkbox
              key={col.key}
              label={col.key}
              checked={col.visible}
              onChange={() => dispatch(toggleColumnVisibility({ entity, key: col.key }))}
            />
          ))}
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
