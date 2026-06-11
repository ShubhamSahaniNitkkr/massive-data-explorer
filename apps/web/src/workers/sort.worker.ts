export interface SortWorkerInput {
  type: 'sort';
  payload: {
    records: Record<string, unknown>[];
    sortColumns: { field: string; direction: 'asc' | 'desc' }[];
  };
}

export interface SortWorkerOutput {
  type: 'sorted';
  payload: {
    indices: number[];
  };
}

function compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  const multiplier = direction === 'asc' ? 1 : -1;
  if (a === null || a === undefined) return multiplier;
  if (b === null || b === undefined) return -multiplier;

  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * multiplier;
  }

  const aStr = String(a);
  const bStr = String(b);
  const aDate = Date.parse(aStr);
  const bDate = Date.parse(bStr);

  if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
    return (aDate - bDate) * multiplier;
  }

  return aStr.localeCompare(bStr) * multiplier;
}

self.onmessage = (event: MessageEvent<SortWorkerInput>) => {
  const { payload } = event.data;
  const { records, sortColumns } = payload;

  const indices = records
    .map((_, index) => index)
    .sort((aIndex, bIndex) => {
      const a = records[aIndex];
      const b = records[bIndex];
      for (const column of sortColumns) {
        const aVal = a[column.field];
        const bVal = b[column.field];
        const result = compareValues(aVal, bVal, column.direction);
        if (result !== 0) return result;
      }
      return 0;
    });

  const output: SortWorkerOutput = { type: 'sorted', payload: { indices } };
  self.postMessage(output);
};
