import { renderToString } from "react-dom/server";
import { PrerenderedRoute } from "./components/PrerenderedRoute";

export const render = (pathname) =>
  renderToString(<PrerenderedRoute pathname={pathname} />);
