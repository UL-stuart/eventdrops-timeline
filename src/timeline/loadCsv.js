export async function loadCsv(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load CSV");
  return await res.text();
}
