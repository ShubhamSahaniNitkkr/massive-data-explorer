export function extractSearchTerms(query: string): string[] {
  return query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

/** Simulates main-thread blocking when Web Workers are disabled */
export function extractTermsWithMainThreadBlock(query: string): string[] {
  const start = performance.now();
  let terms = extractSearchTerms(query);
  while (performance.now() - start < 8) {
    terms = extractSearchTerms(query + terms.join(''));
  }
  return extractSearchTerms(query);
}
