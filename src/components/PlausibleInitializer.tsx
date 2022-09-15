import { useEffect } from "react";

// The non-secret API key used to identify the app to Plausible.io
// Pulled via Vite env var: https://vitejs.dev/guide/env-and-mode.html
const PLAUSIBLE_KEY = import.meta.env.VITE_PLAUSIBLE_KEY as string | undefined;
// `id` for <script> that kicks off Plausible loading. Mostly unimportant,
// just exists as a failsafe to prevent accidentally loading it twice.
const PLAUSIBLE_ELEMENT_ID = "plausible-loader-script-element";

/**
 * Initializes Plausible.io analytics for anonymous usage statistics.
 *
 * This component does not actually do the initialization itself.
 * It adds a <script> tag to page body to do the Plausible initialization.
 *
 * Plausible provides lightweight, privacy-focused analytics. One of the major
 * benefits of using Plausible is that it's so privacy-focused, it's GDPR
 * compliant out-of-the-box and is built to avoid leaking any personal data
 * from our users: https://plausible.io/privacy-focused-web-analytics
 *
 * We use Plausible to gather very general, anonymized usage info: pageview
 * counts, country of origin, etc. We can also use Plausible to track certain
 * broad types of events -- although still anonymously -- so that we can see
 * if a certain feature or something is being used in the wild, basically a
 * simple count of "times used". We don't currently use this, but it would
 * probably be of interest to add in the future.
 *
 * IMPORTANT NOTE:
 * Plausible is looking at route changes for pageviews. For the most part,
 * none of our URLs have any kind of sensitive info in them. The one exception
 * is our `fetch` route, since that takes a user-provided URL for a publicly
 * accessible tree. While it's a public tree, we still consider that to be
 * sensitive info, so we DO NOT track anything happening on `fetch` to avoid
 * accidentally leaking sensitive info to analytics. See docs here:
 *   https://plausible.io/docs/excluding-pages
 * The provided `data-exclude` URL pattern is impacted by our choice of using
 * hash-based routing. If we ever switch away from `HashRouter` to a normal
 * browser history router, `data-exclude` will need to change to match the
 * non-hash version of the route.
 *
 * Developer NOTE:
 * For local dev, we generally do not set a PLAUSIBLE_KEY from env var, so
 * this component will do nothing. If you need to do development around
 * Plausible running, set the Vite env var in `.env` file accordingly.
 * Probably want to use Staging key to avoid polluting Prod info.
 * For ease, we keep the `local` extension to Plausible script; we could
 * remove that as well, but any localdev would then need to re-add it.
 */
const PlausibleInitializer = () => {
  // Desire is to fire this only once ever. Should load when rest of app does.
  useEffect(() => {
    // Only kick off loading Plausible if we have not already loaded it (this
    // should not happen, but failsafe because side-effects can sometimes do
    // weird things in React) and we have a Plausible API key available.
    const prevLoadedElement = document.getElementById(PLAUSIBLE_ELEMENT_ID);
    if (!prevLoadedElement && PLAUSIBLE_KEY) {
      // This is the way to do vanilla scripts on React. It's weird. ¯\_(ツ)_/¯
      // StackOverflow what: https://stackoverflow.com/a/34425083
      // StackOverflow why: https://stackoverflow.com/a/64815699
      const script = document.createElement("script");
      script.id = PLAUSIBLE_ELEMENT_ID;
      script.src = "https://plausible.io/js/script.exclusions.hash.local.js";
      script.setAttribute("data-domain", PLAUSIBLE_KEY);
      // `data-exclude` configured for a `HashRouter`. If we change, update here!
      script.setAttribute("data-exclude", "/#/fetch/**");
      document.body.appendChild(script);
    }
  }, []);
  return null;
};

export default PlausibleInitializer;
