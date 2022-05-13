import { createStore, applyMiddleware } from "redux";
import reducers from "./index";

export const store: any = createStore(reducers, {});
