import { Badge, CloseButton, Group } from '@mantine/core';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <Badge variant="light" size="lg" radius="sm">
      <Group gap={4} wrap="nowrap">
        {label}
        <CloseButton
          size="xs"
          onClick={onRemove}
          aria-label={`Remove filter: ${label}`}
        />
      </Group>
    </Badge>
  );
}
