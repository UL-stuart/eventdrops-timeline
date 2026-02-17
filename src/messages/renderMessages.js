export function renderMessages({ container, events, formatDateTime }) {
  container.innerHTML = "";

  // Map: messageKey -> DOM element (for scrolling)
  const elByKey = new Map();

  for (const e of events) {
    // Use a stable key. Prefer CSV `index` if it’s unique.
    const key = messageKey(e);

    const row = document.createElement("div");
    row.className = "msgRow";
    row.dataset.key = key;

    row.innerHTML = `
      <div class="msgCell">${escapeHtml(formatDateTime(e.datetime))}</div>
      <div class="msgCell">${escapeHtml(e.player)}</div>
      <div class="msgCell">#${escapeHtml(e.channel)}</div>
      <div class="msgText">${escapeHtml(e.message || "")}</div>
    `;

    container.appendChild(row);
    elByKey.set(key, row);
  }

  function scrollToMessage(eventLike) {
    const key = messageKey(eventLike);
    const el = elByKey.get(key);
    if (!el) return;

    // remove previous selection
    container.querySelectorAll(".msgRow.isSelected").forEach((n) => n.classList.remove("isSelected"));

    el.classList.add("isSelected");

    // scroll within the messagesList container
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return { scrollToMessage };
}

function messageKey(e) {
  // Prefer numeric index if present; fallback to datetime+player+channel
  if (e.index !== null && e.index !== undefined && e.index !== "") return `idx:${e.index}`;
  return `dt:${e.datetime?.getTime?.() ?? "x"}|p:${e.player}|c:${e.channel}`;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
