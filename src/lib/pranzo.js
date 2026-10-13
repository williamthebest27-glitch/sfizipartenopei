import { useEffect, useState } from "react";
import { PRANZO_DEFAULT } from "../data/pranzo.js";

/* I contenuti del pranzo salvati dal cliente dalla dashboard.
   Si parte da quelli di default, cosi la sezione c'e subito e non resta mai
   vuota; appena arriva la risposta di /api/pranzo si passa a quelli salvati.
   Se la lettura fallisce (rete, 404 perche non ha mai salvato, sito aperto
   dal disco) restano quelli di default, senza errori in console. */
export function usePranzo() {
  const [dati, setDati] = useState(PRANZO_DEFAULT);

  useEffect(() => {
    let vivo = true;
    fetch("api/pranzo", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (vivo && d && Array.isArray(d.piatti) && d.menu && d.contorni) setDati(d);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  return dati;
}
