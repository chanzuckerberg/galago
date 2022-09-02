import React from "react";
import ReactDOM from "react-dom";
// Using `HashRouter` b/c deployed to GitHub Pages. See overview on why here:
// https://create-react-app.dev/docs/deployment/#notes-on-client-side-routing
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./reducers/store";
import LandingPageRoute from "./routes/landingPageRoute";
import FetchTree from "./routes/fetchTree";
import { ThemeProvider } from "@emotion/react";
import { Theme } from "./theme";
import { ROUTES } from "./routes";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <HashRouter>
          <Routes>
            <Route path={ROUTES.HOMEPAGE} element={<LandingPageRoute />} />
            <Route path={ROUTES.FETCH_DATA} element={<FetchTree />}>
              <Route path="*" element={<FetchTree />} />
            </Route>
            <Route path={ROUTES.APP} element={<App />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
