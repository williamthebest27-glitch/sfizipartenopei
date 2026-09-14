import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SiteHeader from "./components/SiteHeader.jsx";
import ProductsPage from "./components/ProductsPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SiteHeader current="i-nostri-prodotti.html" />
    <ProductsPage />
  </StrictMode>
);
