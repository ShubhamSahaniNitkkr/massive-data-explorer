import { Button, Stack, Text } from '@mantine/core';

interface ErrorFallbackProps {
  error: Error;
  resetError?: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <Stack align="center" justify="center" py="xl" gap="md" role="alert">
      <Text fw={600} size="lg">
        Something went wrong
      </Text>
      <Text c="dimmed" size="sm" maw={500} ta="center">
        {error.message || 'An unexpected error occurred.'}
      </Text>
      {resetError && (
        <Button onClick={resetError} variant="light">
          Try again
        </Button>
      )}
    </Stack>
  );
}
