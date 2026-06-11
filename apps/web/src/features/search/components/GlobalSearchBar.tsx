import { ActionIcon, TextInput } from '@mantine/core';
import { useState } from 'react';

import { clearSearch } from '@/features/search/store/searchUiSlice';
import { useDebouncedSearch } from '@/features/search/hooks/useDebouncedSearch';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import { SearchHistoryDropdown } from './SearchHistoryDropdown';

interface GlobalSearchBarProps {
  entity: string;
}

export function GlobalSearchBar({ entity }: GlobalSearchBarProps) {
  const dispatch = useAppDispatch();
  const { query, setQuery } = useDebouncedSearch(entity);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <TextInput
        className="app-header__search-input"
        placeholder="Search records..."
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        onFocus={() => setHistoryOpen(true)}
        onBlur={() => setTimeout(() => setHistoryOpen(false), 200)}
        aria-label="Global search"
        role="searchbox"
        rightSection={
          query ? (
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={() => dispatch(clearSearch())}
              aria-label="Clear search"
            >
              ×
            </ActionIcon>
          ) : null
        }
      />
      <SearchHistoryDropdown
        opened={historyOpen && !query}
        onSelect={setQuery}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
