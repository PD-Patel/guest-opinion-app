import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SurveyPage from "./SurveyPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<App />} path="/" />
          <Route element={<SurveyPage />} path="/survey" />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>
);
