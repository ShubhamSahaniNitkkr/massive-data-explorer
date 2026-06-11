import { ExplorerPage } from '@/features/explorer/components/ExplorerPage';
import { AppShell } from '@/app/components/AppShell';

export function ExplorerApp() {
  return (
    <AppShell showSearch showEntityTabs>
      <ExplorerPage />
    </AppShell>
  );
}
