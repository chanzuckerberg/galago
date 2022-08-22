/**
 * Contains all routes / paths for the application.
 *
 * Generally, at the bottom of this file you can find the `PATH_` you want
 * for any app route. Right now, I think that will be enough, but there
 * might be some edge case down the road that makes us need to export
 * the ROUTES and getRoutePath for direct use in a component. If that happens,
 * not an issue to export them and generate paths dynamically.
 *
 * Because of how we currently handle deploying the same code to different
 * repos -- a forked "Staging" repo and a "Prod" repo -- we need a little bit
 * of fanciness to avoid the static site aspect of GitHub Pages breaking
 * depending on which repo we're deploying from.
 */
enum ROUTES {
  HOMEPAGE = "/",
  APP = "/app",
}

// BASE_URL from vite always includes trailing slash. Chop that off so our
// routes can have the prefixed slash to make them easier for devs to read.
// `import.meta.env.BASE_URL` is interpolated by vite, see docs:
//   https://vitejs.dev/guide/env-and-mode.html
const BASE_URL = import.meta.env.BASE_URL;
const BASE_WITHOUT_TRAILING_SLASH = BASE_URL.slice(0, -1);


/**
 * Gets the appropriate path for a given route.
 *
 * Necessary due to how GitHub Pages and base URL works. This abstracts all
 * that away so we can just set the appropriate base URL in our vite config
 * based on the GitHub repo our GH Page is connected to, then use this func
 * plus the `ROUTES` above to generate all the app routes.
 *
 * When we move to a custom domain for our GH Pages, this might get broken
 * and we can just go to directly using our ROUTES values in app.
 */
function getRoutePath(route: ROUTES) {
  return BASE_WITHOUT_TRAILING_SLASH + route;
}

export const PATH_TO_HOMEPAGE = getRoutePath(ROUTES.HOMEPAGE);
export const PATH_TO_APP = getRoutePath(ROUTES.APP);
