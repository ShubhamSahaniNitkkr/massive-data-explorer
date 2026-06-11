export interface SearchWorkerInput {
  type: 'processSearch';
  payload: {
    records: Record<string, unknown>[];
    query: string;
    fields: string[];
  };
}

export interface SearchWorkerOutput {
  type: 'searchResults';
  payload: {
    indices: number[];
    highlightTerms: string[];
  };
}

export interface HighlightWorkerInput {
  type: 'extractTerms';
  payload: { query: string };
}

export interface HighlightWorkerOutput {
  type: 'terms';
  payload: { terms: string[] };
}

type WorkerInput = SearchWorkerInput | HighlightWorkerInput;
type WorkerOutput = SearchWorkerOutput | HighlightWorkerOutput;

self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { type, payload } = event.data;

  if (type === 'extractTerms') {
    const terms = payload.query
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0);
    const output: HighlightWorkerOutput = { type: 'terms', payload: { terms } };
    self.postMessage(output);
    return;
  }

  if (type === 'processSearch') {
    const { records, query, fields } = payload;
    const lowerQuery = query.toLowerCase().trim();
    const terms = lowerQuery.split(/\s+/).filter(Boolean);
    const indices: number[] = [];

    records.forEach((record, index) => {
      const matches = terms.every((term) =>
        fields.some((field) => {
          const value = record[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(term);
        }),
      );
      if (matches) indices.push(index);
    });

    const output: SearchWorkerOutput = {
      type: 'searchResults',
      payload: { indices, highlightTerms: terms },
    };
    self.postMessage(output);
  }
};
