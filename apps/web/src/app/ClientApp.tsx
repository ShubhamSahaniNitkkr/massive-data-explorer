import { ExplorerApp } from '@/app/pages/ExplorerApp';
import { AppProviders } from '@/app/providers/AppProviders';

export function ClientApp() {
  return (
    <AppProviders>
      <ExplorerApp />
    </AppProviders>
  );
}
