import { ActionIcon, useMantineColorScheme } from '@mantine/core';

import { setColorScheme } from '@/features/settings/store/themeSlice';
import { savePreferences } from '@/services/indexeddb/preferencesRepo';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const { colorScheme, setColorScheme: setMantineScheme } = useMantineColorScheme();

  const toggle = async () => {
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    setMantineScheme(next);
    dispatch(setColorScheme(next));
    await savePreferences({ colorScheme: next });
  };

  return (
    <ActionIcon
      variant="subtle"
      onClick={toggle}
      aria-label={colorScheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {colorScheme === 'dark' ? '☀' : '☾'}
    </ActionIcon>
  );
}
