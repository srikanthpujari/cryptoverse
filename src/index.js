import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CoinsProvider from "./context/CoinsProvider";
import "react-alice-carousel/lib/alice-carousel.css";

ReactDOM.render(
  <BrowserRouter>
    <CoinsProvider>
      <App />
    </CoinsProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
