import { ACTION_TYPES } from "../reducers/actionTypes";

export const errorTypes: {
  [key: string]: { title: string; content: string; onClose: string };
} = {
  metadataFileTooBig: {
    title: "Uh oh. That metadata file is too big",
    content:
      "Please choose a metadata file that is <15MB. If this is a repeated issue for you, please get in touch!",
    onClose: ACTION_TYPES.CLEAR_METADATA_FILE_SIZE_ERROR,
  },
  treeFileTooBig: {
    title: "Uh oh. That tree file is too big",
    content:
      "Please choose a tree file that is <15MB. If this is a repeated issue for you, please get in touch!",
    onClose: ACTION_TYPES.CLEAR_TREE_FORMAT_ERROR,
  },
  invalidJson: {
    title: "Woops! We can't read that tree file",
    content:
      "We weren't able to parse your tree JSON file. If you believe this is in error, please get in touch so we can improve!",
    onClose: ACTION_TYPES.CLEAR_TREE_FORMAT_ERROR,
  },
  fetchInvalidFile: {
    title: "Woops! Error fetching tree file",
    content:
      "We weren't able to import your tree data. Please confirm your URL is correct and publicly accessible, or upload your JSON file directly below.",
    onClose: ACTION_TYPES.FETCH_ERROR_MSG_CLEAR,
  },
  fetchUrlMissing: {
    title: "Woops! Error fetching tree file",
    content:
      "We didn't receive a URL to fetch from. Please try fetching again with format: https://galago.czgenepi.org/#/fetch/https://your-url-here",
    onClose: ACTION_TYPES.FETCH_ERROR_MSG_CLEAR,
  },
};
