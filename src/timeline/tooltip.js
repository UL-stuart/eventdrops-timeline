export function createTooltip() {
  const el = document.createElement("div");
  el.className = "tooltip";
  document.body.appendChild(el);

  function show({ x, y, content }) {
    el.innerHTML = content;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.display = "block";
  }

  function hide() {
    el.style.display = "none";
  }

  return { show, hide };
}
