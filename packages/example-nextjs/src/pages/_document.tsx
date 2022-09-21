import { NextScript } from "components/NextScript";
import { Html, Head, Main } from "next/document";
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
