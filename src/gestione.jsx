import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GestioneSito from "./components/GestioneSito.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GestioneSito />
  </StrictMode>
);
