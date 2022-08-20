import { Provider as JotaiProvider } from "jotai";
import JotaiNexus from "jotai-nexus";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <JotaiNexus />
      <Component {...pageProps} />
    </JotaiProvider>
  );
}

export default MyApp;
