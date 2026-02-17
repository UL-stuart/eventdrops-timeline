import { defineConfig } from "vite";

export default defineConfig({
  base: "/eventdrops-timeline/",
  define: {
    global: "globalThis"
  }
});
