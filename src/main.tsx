import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./reducers/store";
import LandingPageRoute from "./routes/landingPageRoute";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="galago/" element={<LandingPageRoute />} />
          <Route path="galago/app" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
