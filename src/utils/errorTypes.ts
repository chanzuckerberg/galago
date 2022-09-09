import { ACTION_TYPES } from "../reducers/actionTypes";

export const errorTypes: {
  [key: string]: { title: string; content: string; onClose: string };
} = {
  fileTooBig: {
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
  fetchUrlMissing: {
    title: "",
    content:
      "We weren't able to import your tree data. Please confirm your URL is correct and publicly accessible.",
    onClose: ACTION_TYPES.FETCH_ERROR_MSG_CLEAR,
  },
  fetchInvalidFile: {
    title: "Woops! Error fetching data",
    content:
      "We didn't receive a URL to fetch your tree json from. Please check your URL or upload your file directly below.",
    onClose: ACTION_TYPES.FETCH_ERROR_MSG_CLEAR,
  },
};
