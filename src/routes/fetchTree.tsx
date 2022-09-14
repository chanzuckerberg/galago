import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { getUrlToFetch } from "../utils/fetchData";
import LandingPageRoute from "./landingPageRoute";
import { ACTION_TYPES } from "../reducers/actionTypes";
import {
  ingestNextstrain,
  validateNextstrainJson,
} from "../utils/nextstrainAdapter";

/**
 * Handles fetching external tree JSON and loading it into app.
 *
 * Necessary to have this as a separate function because `async`. Since the
 * result of network call happens async and we need to `await` that, we must
 * do it in this separate async function to enable us to block on the `await`.
 *
 * If there's an issue with fetching the external data, it kicks off an error
 * action to redux so we can display an error to the user. Sadly, we can't
 * really display very concrete stuff on why there was an error. For example,
 * CORS errors are totally opaque to us
 *   (see https://github.com/axios/axios/issues/838)
 * so we pretty much just need to tell the user something generic and leave
 * it up to them to troubleshoot. Hopefully over time we'll get a better
 * sense of what trips up our users and we can write a useful help guide.
 *
 * NOTE: if we eventually handle anything other than nextstrain tree json, we
 * need a way to know which json type we're trying to ingest. Maybe we could
 * determine it from structure of json and auto-choose?
 */
async function handleDataFetch(targetUrl: string, dispatch: Function) {
  let response; // Here because of `try` block scope.
  try {
    response = await axios.get(targetUrl);
  } catch {
    const errorMessage = `We weren't able to import your tree data. Please confirm this URL is correct and publicly accessible: ${targetUrl}`;
    dispatch({
      type: ACTION_TYPES.FETCH_TREE_DATA_FAILED,
      errorMessage,
    });
    return; // Can't progress since fetch failed.
  }

  try {
    validateNextstrainJson(response.data);
    const ingestedNextstrain = ingestNextstrain(response.data);
    dispatch({
      type: ACTION_TYPES.FETCH_TREE_DATA_SUCCEEDED,
      data: ingestedNextstrain,
    });
  } catch {
    dispatch({ type: ACTION_TYPES.SHOW_TREE_FORMAT_ERROR });
  }
}

/**
 * FetchTree glues on the JSON fetching process to our standard landing page.
 *
 * It renders the standard landing page, but also kicks off a process to fetch
 * external JSON, parse it as tree, and open Upload Modal for the next step.
 * These aspects get passed to landing page via redux state changes.
 */
const FetchTree = () => {
  const dispatch = useDispatch();

  // Fires off when page mounts to handle process of fetching external JSON.
  useEffect(() => {
    const targetUrl = getUrlToFetch();
    if (targetUrl) {
      dispatch({
        type: ACTION_TYPES.FETCH_TREE_DATA_STARTED,
        targetUrl,
      });
      // If successful, will load data into tree and open modal for next step
      handleDataFetch(targetUrl, dispatch);
    } else {
      // Showed up at /fetch, but no URL given after that. Can't do anything.
      const errorMessage =
        "We didn't receive a URL to fetch your tree json from. Please check your URL or upload your file directly below.";
      dispatch({
        type: ACTION_TYPES.FETCH_TREE_NO_URL_SPECIFIED,
        errorMessage,
      });
    }
  }, []);
  return <LandingPageRoute />;
};

export default FetchTree;
