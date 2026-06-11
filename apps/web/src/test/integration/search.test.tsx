import { MantineProvider } from '@mantine/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it } from 'vitest';

import { GlobalSearchBar } from '@/features/search/components/GlobalSearchBar';
import { store } from '@/store';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={store}>
      <MantineProvider>{ui}</MantineProvider>
    </Provider>,
  );
}

describe('GlobalSearchBar integration', () => {
  it('updates search query on input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GlobalSearchBar entity="users" />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'test');

    await waitFor(() => {
      expect(input).toHaveValue('test');
    });
  });

  it('clears search when clear button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<GlobalSearchBar entity="users" />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'query');
    const clearBtn = screen.getByLabelText('Clear search');
    await user.click(clearBtn);

    expect(input).toHaveValue('');
  });
});
