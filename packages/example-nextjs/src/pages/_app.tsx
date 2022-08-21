import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { ReactiveHydrationComponentPathContextProvider } from "reactive-hydration";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <RecoilNexus />

      {/* TODO: Do we really need `ReactiveHydrationComponentPathContextProvider` at the root? */}
      <ReactiveHydrationComponentPathContextProvider>
        <Component {...pageProps} />
      </ReactiveHydrationComponentPathContextProvider>
    </RecoilRoot>
  );
}

export default MyApp;
