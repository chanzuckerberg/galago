/**
 * Canonical listing of all redux action types used in the app.
 *
 * TODO: Convert bare string action types in dispatch and matching reducer
 * location to instead live here and be imported from here.
 */
export enum ACTION_TYPES {
  FETCH_TREE_DATA_STARTED = "fetch tree data started",
  FETCH_TREE_DATA_SUCCEEDED = "fetch tree data succeeded",
  FETCH_TREE_DATA_FAILED = "fetch tree data failed",
  FETCH_TREE_NO_URL_SPECIFIED = "fetch tree no url specified",
}
