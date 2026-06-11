export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function createDebouncedAbortable<T>(
  fn: (signal: AbortSignal, ...args: unknown[]) => Promise<T>,
  delay: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let controller: AbortController | null = null;

  return (...args: unknown[]): Promise<T> => {
    if (timeoutId) clearTimeout(timeoutId);
    if (controller) controller.abort();

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        controller = new AbortController();
        try {
          const result = await fn(controller.signal, ...args);
          resolve(result);
        } catch (err) {
          if ((err as Error).name !== 'AbortError') reject(err);
        }
      }, delay);
    });
  };
}
