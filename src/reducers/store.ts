import { createStore } from "redux";
import reducers from "./index";

export const store: any = createStore(reducers, {});
