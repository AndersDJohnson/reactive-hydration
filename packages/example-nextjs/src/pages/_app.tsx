import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { ReactiveHydrateContextProvider } from "reactive-hydration";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilNexus />

      {/* TODO: Do we really need `ReactiveHydrateContextProvider` at the root? */}
      <ReactiveHydrateContextProvider>
        <Component {...pageProps} />
      </ReactiveHydrateContextProvider>
    </RecoilRoot>
  );
}

export default MyApp;
