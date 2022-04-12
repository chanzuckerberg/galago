import { combineReducers } from "redux";
import report from "./report";
import tree from "./tree";

const reducers: any = combineReducers({
  report,
  tree,
});

export default reducers;
