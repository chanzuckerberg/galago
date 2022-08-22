import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./reducers/store";
import LandingPageRoute from "./routes/landingPageRoute";
import { ThemeProvider } from "@emotion/react";
import { Theme } from "./theme";
import { PATH_TO_HOMEPAGE, PATH_TO_APP } from "./routes";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={Theme}>
        <BrowserRouter>
          <Routes>
            <Route path={PATH_TO_HOMEPAGE} element={<LandingPageRoute />} />
            <Route path={PATH_TO_APP} element={<App />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
