import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import { useEffect, useState, type ReactNode } from 'react';

import {
  hydratePreferences,
  setDefaultEntity,
} from '@/features/settings/store/preferencesSlice';
import { setColorScheme } from '@/features/settings/store/themeSlice';
import { loadPreferences } from '@/services/indexeddb/preferencesRepo';
import { initSentry } from '@/services/sentry/sentry';
import { store } from '@/store';
import { theme } from '@/styles/theme';

import { SkipLink } from '@/shared/components/layout/SkipLink';
import { BootLoader } from '@/shared/components/ui/BootLoader';

import { ErrorBoundaryRoot } from './ErrorBoundaryRoot';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@/styles/global.css';
import '@/styles/premium.css';

interface AppProvidersProps {
  children: ReactNode;
  defaultColorScheme?: 'light' | 'dark';
}

function PreferencesHydrator({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initSentry();

    loadPreferences().then((prefs) => {
      if (prefs) {
        store.dispatch(setColorScheme(prefs.colorScheme));
        store.dispatch(
          hydratePreferences({
            defaultPageSize: prefs.defaultPageSize,
            defaultEntity: prefs.defaultEntity as 'users' | 'orders' | 'transactions',
            density: prefs.density,
            sidebarCollapsed: prefs.sidebarCollapsed,
          }),
        );
        store.dispatch(setDefaultEntity(prefs.defaultEntity as 'users' | 'orders' | 'transactions'));
      }
      setReady(true);
    });
  }, []);

  if (!ready) return <BootLoader />;
  return <>{children}</>;
}

export function AppProviders({ children, defaultColorScheme = 'light' }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme} defaultColorScheme={defaultColorScheme}>
        <Notifications position="top-right" />
        <ErrorBoundaryRoot>
          <SkipLink />
          <PreferencesHydrator>
            {children}
          </PreferencesHydrator>
        </ErrorBoundaryRoot>
      </MantineProvider>
    </Provider>
  );
}
