export function setupCsvDropzone({
  dropzoneEl,
  fileInputEl,
  onCsvText,
  onStatus
}) {
  if (!dropzoneEl) throw new Error("Missing dropzoneEl");
  if (!fileInputEl) throw new Error("Missing fileInputEl");

  const setStatus = (msg) => onStatus && onStatus(msg);

  async function handleFile(file) {
    if (!file) return;

    const isCsv =
      file.type === "text/csv" ||
      file.name.toLowerCase().endsWith(".csv") ||
      file.type === "" /* some browsers */;

    if (!isCsv) {
      setStatus(`Not a CSV file: ${file.name}`);
      return;
    }

    const text = await file.text();
    setStatus(`Loaded: ${file.name} (${Math.round(text.length / 1024)} KB)`);
    onCsvText(text, file);
  }

  // Click to open picker
  dropzoneEl.addEventListener("click", () => fileInputEl.click());

  // Keyboard open (Enter/Space)
  dropzoneEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputEl.click();
    }
  });

  // File picker change
  fileInputEl.addEventListener("change", async () => {
    const file = fileInputEl.files?.[0];
    await handleFile(file);
    fileInputEl.value = ""; // allow selecting same file again
  });

  // Drag & drop
  const prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  ["dragenter", "dragover"].forEach((evt) => {
    dropzoneEl.addEventListener(evt, (e) => {
      prevent(e);
      dropzoneEl.classList.add("isDragOver");
    });
  });

  ["dragleave", "drop"].forEach((evt) => {
    dropzoneEl.addEventListener(evt, (e) => {
      prevent(e);
      dropzoneEl.classList.remove("isDragOver");
    });
  });

  dropzoneEl.addEventListener("drop", async (e) => {
    const file = e.dataTransfer?.files?.[0];
    await handleFile(file);
  });
}
