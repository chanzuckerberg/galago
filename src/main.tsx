import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./reducers/store";
import SampleSelectionRoute from "./routes/sampleSelection";
import ReportRoute from "./routes/report";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="galago/" element={<App />} />
          <Route path="galago/clustering" element={<SampleSelectionRoute />} />
          <Route path="galago/report" element={<ReportRoute />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
