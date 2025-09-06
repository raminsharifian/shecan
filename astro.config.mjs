// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://raminsharifian.github.io",
  base: "/shecan",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [svelte()],
});
