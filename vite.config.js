import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

const contentIndex = JSON.parse(
  fs.readFileSync(path.resolve("./content/index.json"), "utf-8")
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  ssgOptions: {
    dirStyle: "nested",
    includedRoutes() {
      const notesPaths = (contentIndex.notes || []).map((n) => `/notes/${n.slug}`);
      const articlesPaths = (contentIndex.articles || []).map((a) => `/articles/${a.slug}`);
      return ["/", "/read-with-me", "/404", ...notesPaths, ...articlesPaths];
    },
  },
});
