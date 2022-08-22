import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />

      {/* TODO: Do we need `ReactiveHydrationComponentPathContextProvider` here? */}
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
