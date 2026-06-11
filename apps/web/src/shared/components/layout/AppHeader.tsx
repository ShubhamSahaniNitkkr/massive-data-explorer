import { Anchor, Box, Group, Text } from '@mantine/core';

import { EntityTabs } from '@/features/explorer/components/EntityTabs';
import { ThemeToggle } from '@/features/settings/components/ThemeToggle';
import { GlobalSearchBar } from '@/features/search/components/GlobalSearchBar';
import { useAppSelector } from '@/shared/hooks/useAppDispatch';

interface AppHeaderProps {
  showSearch?: boolean;
  showEntityTabs?: boolean;
}

export function AppHeader({ showSearch = true, showEntityTabs = true }: AppHeaderProps) {
  const activeEntity = useAppSelector((state) => state.explorerUi.activeEntity);

  return (
    <Box component="header" className="app-header app-header--premium">
      <div className="app-header__top">
        <Group gap="md" wrap="nowrap" className="app-header__brand-block">
          <Anchor href="/" underline="never" className="app-header__brand">
            <Text fw={800} size="sm" className="app-header__logo-text">
              MDE
            </Text>
          </Anchor>
          <div className="app-header__titles">
            <Text fw={700} size="sm" className="app-header__app-name">
              Massive Dataset Explorer
            </Text>
            <Text size="xs" className="app-header__tagline">
              10 lakh records · toggle concepts in the panel →
            </Text>
          </div>
        </Group>
        <ThemeToggle />
      </div>

      {(showEntityTabs || showSearch) && (
        <div className="app-header__tools">
          {showEntityTabs && (
            <Box className="app-header__tabs">
              <EntityTabs />
            </Box>
          )}
          {showSearch && (
            <Box className="app-header__search-wrap">
              <GlobalSearchBar entity={activeEntity} />
            </Box>
          )}
        </div>
      )}
    </Box>
  );
}
