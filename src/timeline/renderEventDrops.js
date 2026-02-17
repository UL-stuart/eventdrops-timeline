import * as d3 from "d3";
import eventDrops from "event-drops";

export function renderEventDrops({ container, lines, range, tooltip, onDropClick, labelFontSize = 14 }) {
  container.innerHTML = "";

  const chart = eventDrops({
    d3,
    range,
    label: {
      text: (row) => row.name,
      width: 100   // try 60–120; smaller = more timeline width
    },
    metaballs: {
      blurDeviation: 10 // default is 10; try 15–30
    },
    line: {
      color: (_, i) => d3.schemeCategory10[i % 10]
    },
    drop: {
      date: d => d.date,
      radius: 5 ,
      onMouseOver: d => {
        const ev = d3.event;
        tooltip.show({
          x: (ev && ev.clientX) || 0,
          y: (ev && ev.clientY) || 0,
          content: `<strong>${d.player}</strong><br/>${d.message}`
        });
      },
      onMouseOut: () => tooltip.hide(),
      onClick: (d) => {
        console.log("herererere");
        if (typeof onDropClick === "function") onDropClick(d);
      }
    }
  });

  const sel = d3.select(container).data([lines]).call(chart);

// Try common label group/class patterns used by EventDrops builds:
sel.selectAll(".drop-line .line-label, .bound-start text")
  .attr("font-size", labelFontSize);

sel.selectAll(".bound text")
  .attr("font-size", labelFontSize);


console.log(
  "SVG groups/classes:",
  sel.selectAll("g").nodes().map(n => n.getAttribute("class")).filter(Boolean)
);

}
