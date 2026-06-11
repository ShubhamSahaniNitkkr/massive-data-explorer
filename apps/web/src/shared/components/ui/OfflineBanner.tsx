import { Alert } from '@mantine/core';

import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <Alert
      color="orange"
      variant="filled"
      role="alert"
      aria-live="assertive"
      styles={{ root: { borderRadius: 0 } }}
    >
      You are currently offline. Data may be outdated until connection is restored.
    </Alert>
  );
}
