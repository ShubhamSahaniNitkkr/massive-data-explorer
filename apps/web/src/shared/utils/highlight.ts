export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export function splitHighlight(text: string, query: string): HighlightSegment[] {
  if (!query.trim()) return [{ text, highlighted: false }];

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  const segments: HighlightSegment[] = [];
  let start = 0;
  let index = lowerText.indexOf(lowerQuery);

  while (index !== -1) {
    if (index > start) {
      segments.push({ text: text.slice(start, index), highlighted: false });
    }
    segments.push({
      text: text.slice(index, index + lowerQuery.length),
      highlighted: true,
    });
    start = index + lowerQuery.length;
    index = lowerText.indexOf(lowerQuery, start);
  }

  if (start < text.length) {
    segments.push({ text: text.slice(start), highlighted: false });
  }

  return segments.length > 0 ? segments : [{ text, highlighted: false }];
}
