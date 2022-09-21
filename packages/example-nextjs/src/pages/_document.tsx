import { Head } from "components/document";
import { Html, Main, NextScript } from "next/document";
// import "reactive-hydration/monkeypatch";

export default function Document() {
  return (
    <Html>
      <Head />

      <body>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
