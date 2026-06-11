import { splitHighlight } from '@/shared/utils/highlight';

interface SearchHighlightUnmemoizedProps {
  text: string;
  query: string;
}

export function SearchHighlightUnmemoized({ text, query }: SearchHighlightUnmemoizedProps) {
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
}
