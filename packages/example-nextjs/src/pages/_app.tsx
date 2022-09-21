import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <a href="?forceHydrate=true">?forceHydrate=true</a>

      <RecoilRoot>
        <RecoilNexus />

        <Component {...pageProps} />
      </RecoilRoot>
    </>
  );
}

export default MyApp;
