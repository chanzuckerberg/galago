import React from "react";
import ReactDOM from "react-dom";
// Using `HashRouter` b/c deployed to GitHub Pages. See overview on why here:
// https://create-react-app.dev/docs/deployment/#notes-on-client-side-routing
// Note that choosing `HashRouter` impacts how we set up Plausible. If we ever
// change back to browser history, update the `PlausibleInitializer` component.
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
import PlausibleInitializer from "./components/PlausibleInitializer";
import MethodsRoute from "./routes/methodsRoute";
import FaqRoute from "./routes/faqRoute";

ReactDOM.render(
  <React.StrictMode>
    <PlausibleInitializer />
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <HashRouter>
          <Routes>
            <Route path={ROUTES.HOMEPAGE} element={<LandingPageRoute />} />
            <Route path={ROUTES.FETCH_DATA} element={<FetchTree />}>
              <Route path="*" element={<FetchTree />} />
            </Route>
            <Route path={ROUTES.APP} element={<App />} />
            <Route path={ROUTES.METHODS} element={<MethodsRoute />} />
            <Route path={ROUTES.FAQ} element={<FaqRoute />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
