import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import SiteHeader from "./components/SiteHeader.jsx";
import LegalPage from "./components/legale/LegalPage.jsx";
import privacy from "./components/legale/privacy.jsx";
import cookie from "./components/legale/cookie.jsx";
import termini from "./components/legale/termini.jsx";
import impressum from "./components/legale/impressum.jsx";

/* Un solo ingresso per le quattro pagine legali: l'HTML dice quale documento
   mostrare con data-doc sulla radice. Sono solo testo, e tenerli in un bundle
   unico vuol dire che passando dall'uno all'altro il JS e gia in cache. */
const DOCS = { privacy, cookie, termini, impressum };

const root = document.getElementById("root");
const doc = DOCS[root.dataset.doc] || privacy;

createRoot(root).render(
  <StrictMode>
    <SiteHeader current="" />
    <LegalPage doc={doc} />
  </StrictMode>
);
