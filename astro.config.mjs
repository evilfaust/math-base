import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { markdownConfig } from "./src/lib/markdown.mjs";
import { blogAdmin } from "./src/admin/integration.mjs";

export default defineConfig({
  site: "https://oipav.ru",
  trailingSlash: "never",
  build: {
    format: "directory",
  },
  markdown: markdownConfig,
  integrations: [blogAdmin()],
  vite: {
    plugins: [tailwindcss()],
  },
});
