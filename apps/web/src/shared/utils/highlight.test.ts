import { describe, expect, it } from 'vitest';

import { splitHighlight } from './highlight';

describe('splitHighlight', () => {
  it('returns single segment when no match', () => {
    expect(splitHighlight('hello world', 'xyz')).toEqual([
      { text: 'hello world', highlighted: false },
    ]);
  });

  it('highlights matching substring', () => {
    expect(splitHighlight('hello world', 'world')).toEqual([
      { text: 'hello ', highlighted: false },
      { text: 'world', highlighted: true },
    ]);
  });

  it('is case insensitive', () => {
    expect(splitHighlight('Hello World', 'hello')).toEqual([
      { text: 'Hello', highlighted: true },
      { text: ' World', highlighted: false },
    ]);
  });
});
