/**
 * Things related to fetching external tree data.
 */
import { ROUTES } from "../routes";

/**
 * If passed string does not have an http(s) schema already, prefix with https.
 *
 * We allow user to specify the URL they want a tree JSON fetched from, but we
 * always want an absolute URL with the schema for making the data request.
 * User can give us `example.com/somejson` or `https://example.com/somejson`,
 * and it should work the same either way. If schema already present, leave
 * it alone, otherwise we tack on default assumption that they meant https.
 */
const DEFAULT_SCHEMA = "https://";
const SCHEMA_CHECK_REGEX = /^https?:/; // String starts `http:` or `https:`
function schemifyUrl(rawUrl: string): string {
  let result = rawUrl; // Default to assuming schema already present.
  if (!SCHEMA_CHECK_REGEX.test(rawUrl)) {
    // rawUrl is missing the expected schema, add it on
    result = DEFAULT_SCHEMA + rawUrl;
  }
  return result;
}

/**
 * Gets the URL for external JSON tree from browser's current location.
 *
 * To fetch an external JSON source -- so a user can skip directly uploading
 * the tree JSON they want and instead have a publicly accessible tree be what
 * gets used -- the app has a "fetch data" path. It works like this:
 *   galago.com/fetch/https://example.com/somejson
 *   ^^^ Above points to external data at `https://example.com/somejson`
 *
 * We need to capture **everything** that comes after the /fetch/ part of the
 * path and use that for our data fetch. This is kind of annoying: a lot of
 * path helpers (i.e., what we get from react-router) will ignore certain
 * things, like search params. This is reasonable in most cases, but because
 * of our specific use-case, we want to exactly use what we were given: we do
 * not know how the server we'll be fetching data from expects the URL to be
 * formatted, so we really can't mess with it. We need to use everything.
 *
 * We could get around this with a search param for `fetch` and URI encoding/
 * decoding, but (a) the above `/fetch/` path approach is what Nextstrain is
 * already using and (b) it's harder to explain URI encoding/decoding.
 *
 * We do use search params in our app as well for specifying certain things.
 * This could be a problem due to naming collisions: if the server we need to
 * fetch data depends on a query param with the same name as a query param our
 * app uses, things will get messy. But this is probably very rare, so it's
 * unlikely to be worth addressing.
 *
 * Finally, note that this function might not play nicely with testing or SSR
 * since it depends on the existence of `window`. Since we don't currently
 * have either of those going, it's not a big deal. If you need to write a
 * test where this would get called as part of it, look into "mocking window"
 * for javascript testing.
 */
export function getUrlToFetch(): string {
  const href = window.location.href; // Entire browser URL
  const fetchDeclarationIdx = href.indexOf(ROUTES.FETCH_DATA);
  if (fetchDeclarationIdx === -1) {
    // Fetch path not found
    return "";
  }
  // Above tells us where fetch path starts in href. To get the URL, we need to
  // skip to its end and then also go 1 farther to pass by the trailing `/`.
  const fetchUrlIdx = fetchDeclarationIdx + ROUTES.FETCH_DATA.length + 1;
  const fetchUrl = href.slice(fetchUrlIdx);
  if (fetchUrl === "") {
    // Fetch path found, but nothing given for data URL
    return "";
  }
  return schemifyUrl(fetchUrl);
}
