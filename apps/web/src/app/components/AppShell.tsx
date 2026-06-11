import { AppShell as MantineAppShell, Box } from '@mantine/core';
import type { ReactNode } from 'react';

import { AppHeader } from '@/shared/components/layout/AppHeader';
import { OfflineBanner } from '@/shared/components/ui/OfflineBanner';

interface AppShellProps {
  children: ReactNode;
  showSearch?: boolean;
  showEntityTabs?: boolean;
}

export function AppShell({ children, showSearch = true, showEntityTabs = true }: AppShellProps) {
  return (
    <Box className="app-shell app-shell--no-sidebar">
      <div className="app-shell__bg" aria-hidden="true" />
      <OfflineBanner />
      <MantineAppShell
        header={{ height: 132 }}
        padding={0}
        classNames={{ main: 'app-shell__main app-shell__main--full' }}
      >
        <MantineAppShell.Header className="app-shell__header app-shell__header--with-search">
          <AppHeader showSearch={showSearch} showEntityTabs={showEntityTabs} />
        </MantineAppShell.Header>

        <MantineAppShell.Main id="main-content" tabIndex={-1}>
          {children}
        </MantineAppShell.Main>
      </MantineAppShell>
    </Box>
  );
}
