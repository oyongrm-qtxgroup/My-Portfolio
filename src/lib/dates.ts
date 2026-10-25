// Site dates for a span of work: "2026 – now", "2024 – 25", "2018 – 19". The CV keeps
// its month format ("January 2026 – Present"); this is the short form for lists.
const year = (monthYear: string) => {
  const y = monthYear.match(/\b(\d{4})\b/)?.[1];
  if (!y) throw new Error(`No year in "${monthYear}"`);
  return y;
};

export function yearSpan(start: string, end?: string): string {
  const from = year(start);
  if (!end) return `${from} – now`;
  const to = year(end);
  if (to === from) return from;
  return `${from} – ${to.slice(0, 2) === from.slice(0, 2) ? to.slice(2) : to}`;
}
