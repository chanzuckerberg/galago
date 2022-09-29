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
  FETCH_ERROR_MSG_CLEAR = "fetch error message cleared",
  SHOW_TREE_FORMAT_ERROR = "show tree format error",
  SHOW_TREE_FILE_SIZE_ERROR = "show tree file size error",
  CLEAR_TREE_ERROR = "clear tree error(s)",
  SHOW_METADATA_FILE_SIZE_ERROR = "show metadata file size error",
  CLEAR_METADATA_FILE_SIZE_ERROR = "clear metadata file size error",
}
