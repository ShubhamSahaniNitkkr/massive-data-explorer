import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';

import { DataTableHeader } from './DataTableHeader';
import { DataTableHeaderUnmemoized } from './DataTableHeaderUnmemoized';

type HeaderProps = React.ComponentProps<typeof DataTableHeader>;

export function AdaptiveDataTableHeader(props: HeaderProps) {
  const memoEnabled = useConceptEnabled('reactMemo');
  const Component = memoEnabled ? DataTableHeader : DataTableHeaderUnmemoized;
  return <Component {...props} />;
}
