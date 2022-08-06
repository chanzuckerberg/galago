import { createStore } from "redux";
import { devToolsEnhancer } from "@redux-devtools/extension";
import reducers from "./index";

export const store: any = createStore(reducers, {}, devToolsEnhancer());
