import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Generate config for vite. Docs -- https://vitejs.dev/config/
 *
 * Unlike most code where you can access the build env vars via magic string
 * like `import.meta.env.MODE`, you can't inside the config. Instead, you need
 * to have the config accept a function that takes `mode` (and other args if
 * desired) and returns the config after any logic is done.
 *
 * Currently, this is not needed for us and we're fine with a static config.
 * However, when we were serving the app via GitHub Pages but /not/ using a
 * custom domain, it was necessary to dynamically configure the `base` path
 * part of the URL. If we ever have to go back to this approach, look at
 * commit SHA `0c4f251c` for this file, `src/routes/index.ts`, and the GitHub
 * workflow itself `.github/workflows/build-deployment.yml`.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
