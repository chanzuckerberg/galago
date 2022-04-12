import { combineReducers } from "redux";
import location from "./location";
import division from "./division";
import tree from "./tree";

const reducers: any = combineReducers({
  location,
  division,
  tree,
});

export default reducers;
