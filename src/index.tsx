import React from "react";
import { createRoot } from "react-dom/client";
import { InstUISettingsProvider, canvas } from "@instructure/ui";
import App from "./app";

import "./global.css";

const Main = (
  <InstUISettingsProvider theme={canvas}>
    <App />
  </InstUISettingsProvider>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(Main);
