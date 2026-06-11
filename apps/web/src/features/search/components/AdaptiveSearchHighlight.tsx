import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';

import { SearchHighlight } from './SearchHighlight';
import { SearchHighlightUnmemoized } from './SearchHighlightUnmemoized';

interface AdaptiveSearchHighlightProps {
  text: string;
  query: string;
}

export function AdaptiveSearchHighlight({ text, query }: AdaptiveSearchHighlightProps) {
  const memoEnabled = useConceptEnabled('reactMemo');
  const Component = memoEnabled ? SearchHighlight : SearchHighlightUnmemoized;
  return <Component text={text} query={query} />;
}
