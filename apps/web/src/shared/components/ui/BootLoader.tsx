import { Box, Loader, Stack, Text } from '@mantine/core';

export function BootLoader() {
  return (
    <Box className="boot-loader">
      <div className="boot-loader__mesh" aria-hidden="true" />
      <Stack align="center" gap="lg" className="boot-loader__content">
        <div className="boot-loader__logo">MDE</div>
        <Loader color="indigo" size="sm" type="dots" />
        <Text size="sm" c="dimmed">
          Initializing dataset engine…
        </Text>
      </Stack>
    </Box>
  );
}
