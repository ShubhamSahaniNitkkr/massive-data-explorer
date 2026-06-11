import { useEffect, useRef, type RefObject } from 'react';

interface UseIntersectionLoadMoreOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  rootMargin?: string;
  enabled?: boolean;
  /** When false, falls back to scroll-position checks instead of IntersectionObserver */
  useIntersectionObserver?: boolean;
  scrollRootRef?: RefObject<HTMLElement | null>;
}

export function useIntersectionLoadMore({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '200px',
  enabled = true,
  useIntersectionObserver = true,
  scrollRootRef,
}: UseIntersectionLoadMoreOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || !enabled) return;

    if (useIntersectionObserver) {
      const scrollRoot = scrollRootRef?.current ?? null;
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && !isLoading) {
            onLoadMore();
          }
        },
        {
          root: scrollRoot,
          rootMargin,
          threshold: 0,
        },
      );

      observer.observe(sentinel);
      return () => observer.disconnect();
    }

    const root = scrollRootRef?.current;
    if (!root) return;

    const margin = Number.parseInt(rootMargin, 10) || 200;

    const handleScroll = () => {
      if (isLoading) return;
      const rootRect = root.getBoundingClientRect();
      const sentinelRect = sentinel.getBoundingClientRect();
      if (sentinelRect.top <= rootRect.bottom + margin) {
        onLoadMore();
      }
    };

    root.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => root.removeEventListener('scroll', handleScroll);
  }, [
    onLoadMore,
    hasMore,
    isLoading,
    rootMargin,
    enabled,
    useIntersectionObserver,
    scrollRootRef,
  ]);

  return sentinelRef;
}
