/**
 * Contains all routes / paths for the application.
 *
 * For any dev writing route interactions, you can just import ROUTES then
 * refer to the needed route with, eg, `ROUTES.APP`, etc, etc. If you need
 * to add a new route, add it here first then use that import in whatever
 * routing code you're writing. You should -- unless absolutely necessary --
 * avoid directly writing a raw string of the route somewhere in code; instead
 * route strings should just be pointing at the various values in ROUTES here.
 *
 * In the past, this file required more complexity because we were serving
 * the app via GitHub Pages but /not/ using a custom domain. This made it
 * necessary to dynamically configure the `base` path part of the URL, which
 * then meant we had to abstract away building our routes out of that base
 * path plus the "real" value in ROUTES. If we ever have to go back to that
 * approach, look at commit SHA `0c4f251c` for this file, `vite.config.ts` and
 * the GitHub workflow itself `.github/workflows/build-deployment.yml`.
 */
export enum ROUTES {
  HOMEPAGE = "/",
  // Intent of FETCH_DATA is to provide wildcard catch for subpath after it.
  // For instance, `galago.com/fetch/https://example.com/somejson` is pointing
  // to the URL `https://example.com/somejson` as what needs to be fetched.
  // This is accomplished by using a nested "*" wildcard path in our router.
  FETCH_DATA = "/fetch",
  APP = "/app",
}
