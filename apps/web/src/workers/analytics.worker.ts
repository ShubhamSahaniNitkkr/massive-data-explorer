export interface AnalyticsWorkerInput {
  type: 'compute';
  payload: {
    records: Record<string, unknown>[];
    numericFields: string[];
    groupField?: string;
  };
}

export interface AnalyticsWorkerOutput {
  type: 'analytics';
  payload: {
    count: number;
    sums: Record<string, number>;
    averages: Record<string, number>;
    groups: Record<string, number>;
  };
}

self.onmessage = (event: MessageEvent<AnalyticsWorkerInput>) => {
  const { records, numericFields, groupField } = event.data.payload;
  const sums: Record<string, number> = {};
  const groups: Record<string, number> = {};

  for (const field of numericFields) {
    sums[field] = 0;
  }

  for (const record of records) {
    if (groupField) {
      const groupKey = String(record[groupField] ?? 'unknown');
      groups[groupKey] = (groups[groupKey] ?? 0) + 1;
    }

    for (const field of numericFields) {
      const value = Number(record[field]);
      if (!Number.isNaN(value)) {
        sums[field] += value;
      }
    }
  }

  const count = records.length;
  const averages: Record<string, number> = {};
  for (const field of numericFields) {
    averages[field] = count > 0 ? sums[field] / count : 0;
  }

  const output: AnalyticsWorkerOutput = {
    type: 'analytics',
    payload: { count, sums, averages, groups },
  };
  self.postMessage(output);
};
