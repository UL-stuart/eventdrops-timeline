export function computeTimeRange(events) {
  const times = events.map(e => e.datetime.getTime());
  const start = new Date(Math.min(...times));
  const end = new Date(Math.max(...times));
  return { start, end };
}
