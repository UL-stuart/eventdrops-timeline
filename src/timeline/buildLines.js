export function buildLines(events) {
  const byPlayer = new Map();

  events.forEach(e => {
    if (!byPlayer.has(e.player)) {
      byPlayer.set(e.player, []);
    }
    byPlayer.get(e.player).push({ date: e.datetime, ...e });
  });

  return Array.from(byPlayer.entries()).map(([name, data]) => ({
    name,
    data
  }));
}
