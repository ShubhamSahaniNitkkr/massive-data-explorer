import { Center, Loader, Text } from '@mantine/core';

interface LoadingOverlayProps {
  message?: string;
  visible: boolean;
}

export function LoadingOverlay({ message = 'Loading...', visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <Center py="xl" role="status" aria-busy="true" aria-label={message}>
      <Loader size="md" mr="sm" />
      <Text size="sm" c="dimmed">
        {message}
      </Text>
    </Center>
  );
}
