import { Provider as JotaiProvider } from "jotai";
import JotaiNexus from "jotai-nexus";
import type { AppProps } from "next/app";
import { ReactiveHydrationComponentPathContextProvider } from "reactive-hydration";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <JotaiNexus />
      <ReactiveHydrationComponentPathContextProvider>
        <Component {...pageProps} />
      </ReactiveHydrationComponentPathContextProvider>
    </JotaiProvider>
  );
}

export default MyApp;
