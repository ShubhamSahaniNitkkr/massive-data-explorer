import { Button, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { clearRowSelection } from '@/features/explorer/store/explorerUiSlice';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

interface BulkActionsBarProps {
  selectedCount: number;
}

export function BulkActionsBar({ selectedCount }: BulkActionsBarProps) {
  const dispatch = useAppDispatch();

  if (selectedCount === 0) return null;

  const handleExport = () => {
    notifications.show({
      title: 'Export started',
      message: `Exporting ${selectedCount} selected records`,
      color: 'blue',
    });
  };

  const handleArchive = () => {
    notifications.show({
      title: 'Archive complete',
      message: `${selectedCount} records archived (simulated)`,
      color: 'green',
    });
    dispatch(clearRowSelection());
  };

  return (
    <Group
      p="sm"
      bg="var(--mantine-color-blue-0)"
      justify="space-between"
      role="toolbar"
      aria-label="Bulk actions"
    >
      <Text size="sm" fw={500} aria-live="polite">
        {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
      </Text>
      <Group gap="sm">
        <Button size="xs" variant="light" onClick={handleExport}>
          Export
        </Button>
        <Button size="xs" variant="light" color="orange" onClick={handleArchive}>
          Archive
        </Button>
        <Button size="xs" variant="subtle" onClick={() => dispatch(clearRowSelection())}>
          Clear selection
        </Button>
      </Group>
    </Group>
  );
}
