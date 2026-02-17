import "event-drops/dist/style.css";
import "./styles.css";

import { loadCsv } from "./timeline/loadCsv.js";
import { parseSlackCsv } from "./timeline/parseSlackCsv.js";
import { buildLines } from "./timeline/buildLines.js";
import { computeTimeRange } from "./timeline/timeRange.js";
import { createTooltip } from "./timeline/tooltip.js";
import { renderEventDrops } from "./timeline/renderEventDrops.js";

import { renderMessages } from "./messages/renderMessages.js";
import { setupCsvDropzone } from "./uploader/fileDrop.js";

function formatDateTime(date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(date);
}

async function main() {
  const chartContainer = document.querySelector("#chart");
  const messagesList = document.querySelector("#messagesList");
  const dropzoneEl = document.querySelector("#dropzone");
  const fileInputEl = document.querySelector("#fileInput");

  if (!chartContainer) throw new Error("Missing #chart");
  if (!messagesList) throw new Error("Missing #messagesList");
  if (!dropzoneEl) throw new Error("Missing #dropzone");
  if (!fileInputEl) throw new Error("Missing #fileInput");

  const tooltip = createTooltip();

  function setDropzoneStatus(msg) {
    // optional: show status in the dropzone subtitle
    const sub = dropzoneEl.querySelector(".dz-sub");
    if (sub && msg) sub.textContent = msg;
  }

  function renderFromCsvText(csvText) {
    const events = parseSlackCsv(csvText);

    if (!events.length) {
      chartContainer.innerHTML = "No events parsed from CSV.";
      messagesList.innerHTML = "";
      return;
    }

    const lines = buildLines(events);
    const range = computeTimeRange(events);

    const messages = renderMessages({
      container: messagesList,
      events,
      formatDateTime
    });

    renderEventDrops({
      container: chartContainer,
      lines,
      range,
      tooltip,
      onDropClick: (dropData) => messages.scrollToMessage(dropData)
    });
  }


  // 1) Initial load from public/data/discount.csv (optional default)
  const initialCsv = await loadCsv(`${import.meta.env.BASE_URL}data/discount3.csv`);

  renderFromCsvText(initialCsv);
  setDropzoneStatus("Drop a CSV to load a different session");

  // 2) Enable drag/drop + file picker reload
  setupCsvDropzone({
    dropzoneEl,
    fileInputEl,
    onStatus: setDropzoneStatus,
    onCsvText: (text) => {
      try {
        renderFromCsvText(text);
      } catch (err) {
        console.error(err);
        setDropzoneStatus(`Error parsing CSV: ${err.message}`);
      }
    }
  });
}

main().catch((err) => {
  console.error(err);
  const el = document.querySelector("#chart");
  if (el) el.textContent = `Error: ${err.message}`;
});
