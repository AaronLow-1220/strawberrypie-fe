import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.jsx";
import "./tailwind.css";

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <App />);
} else {
  createRoot(rootElement).render(<App />);
}
