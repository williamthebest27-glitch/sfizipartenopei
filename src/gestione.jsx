import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PranzoAdmin from "./components/PranzoAdmin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PranzoAdmin />
  </StrictMode>
);
