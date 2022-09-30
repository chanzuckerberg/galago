/**
 * Things related to fetching external tree data.
 */
import { ROUTES } from "../routes";

/**
 * Galago supports various, optional search (AKA query) params for fetch.
 *
 * In addition to specifying a URL for tree data being fetched, the fetch
 * route supports optional search params to give additional info about the
 * tree being loaded. For example, `galagoPathogen` can be specified to
 * set the `pathogen` the tree is dealing with. See `ALL_GALAGO_PARAMS` below
 * for a list of all the kinds of search params the fetch route supports.
 *
 * NOTE: Each parameter has an internal name (eg, `pathogen`) and the name
 * actually used for its search param (eg, `galagoPathogen`). Every param
 * listed below is exposed as a search param that will be prefixed with
 * `galago` and then camel-cased (ex: `fooBar` => `galagoFooBar`). This is
 * done to prevent any accidental name collisions with other search params
 * that the targetUrl might rely on, and the galago params will be removed
 * from the resulting targetUrl search params before we try to fetch data.
 *
 * Dev Note: Below would be easier to understand as a lookup dict from internal
 * to external search params, but TypeScript gets pretty ornery when you try to
 * rely on the structure of a constant object, so this is the best I could do
 * for readability while keeping TypeScript happy.
 */
const SEARCH_PARAM_PREFIX = "galago";
const ALL_GALAGO_PARAMS = [
  // corresponding URL search param: `galagoPathogen`
  // Must be a key from src/utils/pathogenParameters `pathogenParameters`
  "pathogen",
  // corresponding URL search param: `galagoMrca`
  // TODO Implement usage of the param downstream in app.
  "mrca",
] as const;
type AllGalagoParams = typeof ALL_GALAGO_PARAMS[number];
// For actual usage downstream in app, we provide an object with the params as
// keys, with the string value it had or `undefined` if not represented in URL.
export type GalagoParams = Partial<Record<AllGalagoParams, string>>;
// Helper to do internal name to URL search param: `fooBar` => `galagoFooBar`
const internalToSearchParam = (param: string): string => {
  return SEARCH_PARAM_PREFIX + param.charAt(0).toUpperCase() + param.slice(1);
};

interface ExtractedSearchParams {
  galagoParams: GalagoParams;
  remainingSearchString: string;
}
/**
 * Extract search params used by Galago. Returns them and any unused params.
 *
 * See above for all the search (AKA, query) params that Galago supports.
 * This function pulls all the Galago params out, returns them as an object,
 * and also returns whatever portion of the URL search string was unused so
 * it can go back into being used as part of the fetch targetUrl.
 */
function extractSearchParams(
  searchString: string | undefined
): ExtractedSearchParams {
  const galagoParams: ExtractedSearchParams["galagoParams"] = {};
  if (!searchString) {
    // There was no search portion. Just return defaults.
    return {
      galagoParams,
      remainingSearchString: "",
    };
  }
  // Fetch did have search params, handle them now.
  const searchParams = new URLSearchParams(searchString);
  ALL_GALAGO_PARAMS.forEach((internalParam) => {
    const searchParamName = internalToSearchParam(internalParam);
    const paramValue = searchParams.get(searchParamName);
    if (paramValue !== null) {
      galagoParams[internalParam] = paramValue;
      searchParams.delete(searchParamName);
    }
  });
  // At this point, whatever remains in `searchParams` was not for Galago's use
  // If we used all of the search params, this will be an empty string.
  const remainingSearchString = searchParams.toString();
  return {
    galagoParams,
    remainingSearchString,
  };
}

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

interface TargetUrlAndParams {
  targetUrl: string; // Full URL for where we should go get JSON data
  galagoParams: GalagoParams; // Set of (optional) query params about tree
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
 * of our specific use-case, we want to know exactly what we were given.
 *
 * We could get around this with a search param for `fetch` and URI encoding/
 * decoding, but (a) the above `/fetch/` path approach is what Nextstrain is
 * already using and (b) it's harder to explain URI encoding/decoding.
 *
 * We use search params in the app for specifying certain things. See above
 * for more information on what params are available and how to use them.
 * All search params used by Galago are prefixed by `galago`, so we can be
 * very confident there will be no name collisions against where we fetch the
 * data from. As such, we remove all the params used by Galago from the target
 * URL we will fetch. If any params were not used by Galago, we leave them in
 * the resulting targetUrl since we expect the server we will be fetching
 * data from needs those other search params.
 *
 * Finally, note that this function might not play nicely with testing or SSR
 * since it depends on the existence of `window`. Since we don't currently
 * have either of those going, it's not a big deal. If you need to write a
 * test where this would get called as part of it, look into "mocking window"
 * for javascript testing.
 */
export function getTargetUrlAndParams(): TargetUrlAndParams {
  // Return value for this func when fetch path was accessed incorrectly.
  const MALFORMED_FETCH_RETURN_VAL: TargetUrlAndParams = {
    targetUrl: "",
    galagoParams: {},
  };

  // First, verify we're on the happy path for usage and get the fetch URL part
  const href = window.location.href; // Entire browser URL
  const fetchDeclarationIdx = href.indexOf(ROUTES.FETCH_DATA);
  if (fetchDeclarationIdx === -1) {
    // Fetch path not found
    return MALFORMED_FETCH_RETURN_VAL;
  }
  // Above tells us where fetch path starts in href. To get the URL, we need to
  // skip to its end and then also go 1 farther to pass by the trailing `/`.
  const fetchHrefIdx = fetchDeclarationIdx + ROUTES.FETCH_DATA.length + 1;
  const fetchTarget = href.slice(fetchHrefIdx);
  if (fetchTarget === "") {
    // Fetch path found, but nothing given for data URL
    return MALFORMED_FETCH_RETURN_VAL;
  }

  // Separate and handle any search params at end from rest of the fetch URL.
  // We must handle the `?` splitting manually as `location.search` won't work
  // due to majority of URL being behind `#` (b/c HashRouter for GitHub Pages).
  const [preSearchUrl, searchString] = fetchTarget.split("?");
  const { galagoParams, remainingSearchString } =
    extractSearchParams(searchString);
  let targetUrl = preSearchUrl;
  if (remainingSearchString) {
    targetUrl = preSearchUrl + "?" + remainingSearchString;
  }
  targetUrl = schemifyUrl(targetUrl); // Ensure the URL we'll fetch has a schme

  return {
    targetUrl,
    galagoParams,
  };
}
