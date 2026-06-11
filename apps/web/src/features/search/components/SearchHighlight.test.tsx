import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SearchHighlight } from './SearchHighlight';

describe('SearchHighlight', () => {
  it('renders highlighted match', () => {
    render(<SearchHighlight text="hello world" query="world" />);
    expect(screen.getByText('world').tagName).toBe('MARK');
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });

  it('renders plain text when no query', () => {
    render(<SearchHighlight text="hello world" query="" />);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
