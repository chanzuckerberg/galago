import { combineReducers } from "redux";
import location from "./location";
import division from "./division";
import samplesOfInterestNames from "./samplesOfInterestNames";
import tree from "./tree";

const reducers: any = combineReducers({
  location,
  division,
  tree,
  samplesOfInterestNames,
});

export default reducers;
