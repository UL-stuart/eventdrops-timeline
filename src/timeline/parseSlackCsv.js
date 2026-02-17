import * as d3 from "d3";

export function parseSlackCsv(csvText) {
  const rows = d3.csvParse(csvText);
  return rows.map(r => ({
    index: Number(r.index),
    datetime: parseDate(r.datetime),
    player: normalizePlayer(r.player),
    channel: r.channel,
    message: r.message
  })).sort((a, b) => a.datetime - b.datetime);
}

const parseNoSeconds = d3.timeParse("%d/%m/%Y %H:%M");
const parseWithSeconds = d3.timeParse("%d/%m/%Y %H:%M:%S");

function parseDate(s) {
  if (!s) return null;
  const txt = String(s).trim();
  return parseWithSeconds(txt) || parseNoSeconds(txt) || new Date(txt);
}

function normalizePlayer(name) {
  const s = String(name ?? "").trim();
  if (!s) return "unknown";
  const at = s.indexOf("@");
  return (at >= 0 ? s.slice(0, at) : s).trim() || "unknown";
}

