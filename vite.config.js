import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Percorsi relativi negli asset: il sito funziona anche servito da una
  // sottocartella (anteprima pubblicata, staging) e non solo dalla radice.
  base: "./",

  plugins: [react(), tailwindcss()],

  build: {
    // Sito a piu pagine: ogni HTML e un ingresso a se, con il suo bundle.
    // Niente router client, quindi niente rewrite da configurare sull'hosting
    // e ogni pagina resta un file statico vero.
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        prodotti: resolve(__dirname, "i-nostri-prodotti.html"),
        contatti: resolve(__dirname, "contatti.html"),
      },
    },
  },

  css: {
    // Config PostCSS inline e vuoto: serve a impedire a Vite di risalire le
    // cartelle in cerca di un postcss.config.js. Due livelli sopra questo
    // progetto ne esiste uno estraneo che carica Tailwind v3 e fa fallire la
    // build. Qui Tailwind v4 passa dal plugin Vite, PostCSS non serve.
    postcss: {},
  },
});
