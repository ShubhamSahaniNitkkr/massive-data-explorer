import { Combobox, Text, useCombobox } from '@mantine/core';
import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect } from 'react';

import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';
import { db } from '@/services/indexeddb/db';

interface SearchHistoryDropdownProps {
  opened: boolean;
  onSelect: (query: string) => void;
  onClose: () => void;
}

export function SearchHistoryDropdown({ opened, onSelect, onClose }: SearchHistoryDropdownProps) {
  const combobox = useCombobox();
  const indexedDBEnabled = useConceptEnabled('indexedDB');
  const history = useLiveQuery(
    () => (indexedDBEnabled ? db.searchHistory.orderBy('timestamp').reverse().limit(8).toArray() : []),
    [indexedDBEnabled],
  );

  useEffect(() => {
    if (opened) combobox.openDropdown();
    else combobox.closeDropdown();
  }, [opened, combobox]);

  if (!history?.length) return null;

  return (
    <Combobox store={combobox} onOptionSubmit={(value) => { onSelect(value); onClose(); }}>
      <Combobox.Dropdown>
        <Combobox.Options>
          {history.map((entry) => (
            <Combobox.Option key={entry.id} value={entry.query}>
              <Text size="sm">{entry.query}</Text>
              <Text size="xs" c="dimmed">
                {entry.entity}
              </Text>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
