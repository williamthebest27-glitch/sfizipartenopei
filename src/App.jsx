import Sipario from "./components/Sipario.jsx";
/* dopo il sipario: il suo modulo deve essersi gia prenotato quando quello del
   banner in evidenza si mette in coda per l'entrata della home (lib/intro.js),
   se no la locandina partirebbe a tempo da subito, sotto il telo */
import Evento from "./components/Evento.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import Hero from "./components/Hero.jsx";
import Showcase from "./components/Showcase.jsx";
import ChiSiamo from "./components/ChiSiamo.jsx";
import Allergeni from "./components/Allergeni.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

/* Il sipario sta solo qui, sulla home: e l'ingresso del sito, non un dazio da
   pagare a ogni pagina. Le pagine interne non importano nemmeno il modulo, e
   per questo le loro entrate partono subito (vedi lib/intro.js). */
export default function App() {
  return (
    <>
      <Sipario />
      <Evento />
      <SiteHeader current="/" />
      <main>
        <Hero />
        <Showcase />
        <ChiSiamo />
        <Allergeni />
      </main>
      <SiteFooter />
    </>
  );
}
