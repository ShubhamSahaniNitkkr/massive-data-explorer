import { Stack, Text, ThemeIcon } from '@mantine/core';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <Stack align="center" justify="center" py="xl" gap="sm" role="status">
      {icon && (
        <ThemeIcon size="xl" variant="light" color="gray" aria-hidden="true">
          {icon}
        </ThemeIcon>
      )}
      <Text fw={600} size="lg">
        {title}
      </Text>
      {description && (
        <Text c="dimmed" size="sm" maw={400} ta="center">
          {description}
        </Text>
      )}
    </Stack>
  );
}
