import ReactDOMServer from "react-dom/server";
import { App } from "./App";

export function render() {
  // TODO: Do we want to consider `renderToNodeStream` or `renderToPipeableStream`?
  return ReactDOMServer.renderToString(<App />);
}
