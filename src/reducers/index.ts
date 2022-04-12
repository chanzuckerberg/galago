import { combineReducers } from "redux";
import location from "./location";
import division from "./division";
import samplesOfInterest from "./samplesOfInterest";
import samplesOfInterestNames from "./samplesOfInterestNames";
import tree from "./tree";

const reducers: any = combineReducers({
  location,
  division,
  samplesOfInterest,
  tree,
  samplesOfInterestNames,
});

export default reducers;
