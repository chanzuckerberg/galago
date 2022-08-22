import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const STAGING_KEYWORD = "staging"; // Running in galago-labs

/**
 * Generate config for vite. Docs -- https://vitejs.dev/config/
 *
 * Unlike most code where you can access the build env vars via magic string
 * like `import.meta.env.MODE`, you can't inside the config. Instead, you need
 * to have the config accept a function that takes `mode` (and other args if
 * desired) and returns the config after any logic is done.
 *
 * This is necessary because our staging and prod versions of the app get
 * served from different URLs so we inject that here. We are relying on the
 * fact that we explicitly know the names of the Prod and Staging repos. If
 * we needed to truly generalize, would want to set from some kind of real
 * env var that GitHub Action passes by introspecting the repo name. But
 * also possible that having custom domain names will make all this unneeded.
 */
export default defineConfig(({mode}) => {
  let basePath = "/galago/";
  if (mode.toLowerCase() === STAGING_KEYWORD) {
    basePath = "/galago-labs/";
  }
  return {
    plugins: [react()],
    base: basePath,
  };
});
