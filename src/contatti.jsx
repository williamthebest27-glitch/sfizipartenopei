import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SiteHeader from "./components/SiteHeader.jsx";
import ContactPage from "./components/ContactPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SiteHeader current="contatti.html" />
    <ContactPage />
  </StrictMode>
);
