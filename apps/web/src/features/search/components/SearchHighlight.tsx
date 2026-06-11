import { memo } from 'react';

import { splitHighlight } from '@/shared/utils/highlight';

interface SearchHighlightProps {
  text: string;
  query: string;
}

// PERF: memo prevents re-highlighting unchanged cells during scroll (see README#react-memo)
export const SearchHighlight = memo(function SearchHighlight({ text, query }: SearchHighlightProps) {
  const segments = splitHighlight(text, query);

  return (
    <span>
      {segments.map((segment, index) =>
        segment.highlighted ? (
          <mark key={index} className="highlight-match">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </span>
  );
});
