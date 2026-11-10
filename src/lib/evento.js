/* ===========================================================================
   evento — la regia del banner in evidenza sulla home
   ---------------------------------------------------------------------------
   Prima si apre la home, poi arriva la locandina (chiesto cosi dal cliente):
   il sipario si alza, la hero fa la sua entrata intera — titolo, foto, menu,
   pulsanti — e RITARDO ms dopo la locandina sale sopra il sito gia composto.

   Il modulo parte appena viene caricato, cioe dentro il sipario: chiede il
   banner a /api/banner e intanto scarica e decodifica la locandina, cosi al
   momento giusto e gia pronta e compare senza buchi.

   - Niente da mostrare (banner spento, scaduto, gia visto in questa scheda,
     API giu): non succede niente, la home resta com'e.
   - Locandina non ancora arrivata al momento giusto: la si aspetta al massimo
     ATTESA_MAX ms, poi si rinuncia per questa volta. Una locandina che piomba
     addosso a chi sta gia leggendo la pagina e peggio di nessuna locandina.
   - Il banner dei cookie aspetta (dopoEvento): compare dopo, non sotto la
     locandina.

   ?evento nell'indirizzo la mostra anche a chi l'ha gia vista: e il link
   «Vedi sul sito» della dashboard.
   =========================================================================== */
import { BANNER_DEFAULT, bannerVisibile } from "../data/banner.js";
import { quandoEntraIlSito } from "./intro.js";

const CHIAVE = "sfizi:evento-visto";
/* ms dopo l'inizio dell'entrata della hero: a 2 s sono arrivati i pulsanti,
   l'ultimo pezzo (misurato), quindi la home e composta e si e vista */
const RITARDO = 2300;
const ATTESA_MAX = 3000;

let istantanea = { stato: "attesa", banner: null }; // attesa | aperto | chiuso | niente
const ascoltatori = new Set();
let avviato = false;
let dopo = [];

function cambia(stato, banner = istantanea.banner) {
  istantanea = { stato, banner };
  ascoltatori.forEach((fn) => fn());
  if (stato === "chiuso" || stato === "niente") {
    const coda = dopo;
    dopo = [];
    coda.forEach((fn) => fn());
  }
}

function giaVisto() {
  try {
    return sessionStorage.getItem(CHIAVE) === "1";
  } catch {
    return false;
  }
}

function segnaVisto() {
  try {
    sessionStorage.setItem(CHIAVE, "1");
  } catch {
    /* navigazione privata: la si rivede alla prossima apertura, pazienza */
  }
}

/* { salvato: false } = il cliente non ha mai salvato: vale il banner di
   partenza. Qualunque errore = nessun banner, perche non e un contenuto
   indispensabile. */
async function leggiBanner() {
  const r = await fetch("api/banner", { headers: { accept: "application/json" } });
  if (!r.ok) return null;
  const d = await r.json();
  if (d && d.salvato === false) return BANNER_DEFAULT;
  return d && typeof d === "object" && "attivo" in d ? d : null;
}

function caricaImmagine(src) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(ok);
    img.onerror = ko;
    img.src = src;
  });
}

export function avviaEvento() {
  if (avviato || typeof window === "undefined") return;
  avviato = true;

  const forzato = new URLSearchParams(window.location.search).has("evento");
  if (!forzato && giaVisto()) {
    cambia("niente");
    return;
  }

  let momento = false;
  let pronto = null;
  let deciso = false;

  const rinuncia = () => {
    if (deciso) return;
    deciso = true;
    cambia("niente");
  };
  const forseApri = () => {
    if (deciso || !momento || !pronto) return;
    deciso = true;
    cambia("aperto", pronto);
  };

  quandoEntraIlSito(() => {
    window.setTimeout(() => {
      momento = true;
      forseApri();
      if (!deciso) window.setTimeout(rinuncia, ATTESA_MAX);
    }, RITARDO);
  });

  leggiBanner()
    .then((b) => {
      if (!bannerVisibile(b)) return rinuncia();
      return caricaImmagine(b.img).then(() => {
        pronto = b;
        forseApri();
      });
    })
    .catch(rinuncia);
}

/* Chi guarda ha chiusa la locandina: in questa scheda non la si ripropone.
   "chiuso" tiene il banner: il componente resta montato per l'animazione
   d'uscita e si smonta da solo alla fine. */
export function chiudiEvento() {
  if (istantanea.stato !== "aperto") return;
  segnaVisto();
  cambia("chiuso");
}

/* Per chi deve comparire dopo la locandina (il banner dei cookie). Sulle
   pagine senza locandina il modulo non e mai avviato: parte subito. */
export function dopoEvento(fn) {
  const s = istantanea.stato;
  if (!avviato || s === "chiuso" || s === "niente") {
    fn();
    return () => {};
  }
  dopo.push(fn);
  return () => {
    dopo = dopo.filter((altro) => altro !== fn);
  };
}

export function iscriviti(fn) {
  ascoltatori.add(fn);
  return () => ascoltatori.delete(fn);
}

export const leggiEvento = () => istantanea;
