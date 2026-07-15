import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ConfiguratorProvider } from "./store/ConfiguratorContext";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfiguratorProvider>
      <App />
    </ConfiguratorProvider>
  </StrictMode>,
);
