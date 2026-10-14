/* ===========================================================================
   consenso — le scelte del visitatore sui cookie
   ---------------------------------------------------------------------------
   Oggi il sito non usa niente di facoltativo: niente statistiche, niente
   pubblicita. Il banner esiste lo stesso, perche il cliente lo vuole e perche
   il giorno in cui si aggiunge uno strumento di misura il consenso deve gia
   esserci. Quel giorno:

     1. si carica lo script dentro  quandoConsentito("statistiche", () => ...)
     2. si alza VERSIONE di uno, cosi il banner torna a chiedere a tutti
     3. si aggiunge la voce nella tabella della cookie policy

   Le scelte stanno in localStorage per DURATA giorni, poi si richiedono. Ogni
   accesso allo storage e protetto: in navigazione privata o coi dati del sito
   bloccati puo lanciare, e allora le scelte valgono per la pagina aperta.
   =========================================================================== */

const CHIAVE = "sfizi:consenso";
const VERSIONE = 1;
const DURATA = 365; // giorni

export const CATEGORIE = ["statistiche", "marketing"];

const EVENTO_SCELTE = "sfizi:consenso";
const EVENTO_APRI = "sfizi:preferenze-cookie";

let inMemoria = null; // ripiego quando lo storage non c'e

export function leggiConsenso() {
  let dato = inMemoria;
  try {
    const grezzo = localStorage.getItem(CHIAVE);
    if (grezzo) dato = JSON.parse(grezzo);
  } catch {
    /* storage bloccato o valore illeggibile: vale quello in memoria */
  }
  if (!dato || dato.v !== VERSIONE || !dato.data) return null;
  const eta = (Date.now() - new Date(dato.data).getTime()) / 86400000;
  if (!(eta >= 0 && eta < DURATA)) return null;
  return dato;
}

export function salvaConsenso(scelte) {
  const dato = {
    v: VERSIONE,
    data: new Date().toISOString(),
    scelte: Object.fromEntries(CATEGORIE.map((c) => [c, scelte[c] === true])),
  };
  inMemoria = dato;
  try {
    localStorage.setItem(CHIAVE, JSON.stringify(dato));
  } catch {
    /* niente: resta in memoria finche la pagina e aperta */
  }
  window.dispatchEvent(new CustomEvent(EVENTO_SCELTE, { detail: dato }));
  return dato;
}

export function haConsenso(categoria) {
  if (categoria === "necessari") return true;
  return leggiConsenso()?.scelte?.[categoria] === true;
}

/* Esegue fn subito se la categoria e gia consentita, altrimenti appena il
   visitatore la consente. Restituisce la funzione per disdire. */
export function quandoConsentito(categoria, fn) {
  if (haConsenso(categoria)) {
    fn();
    return () => {};
  }
  const ascolta = () => {
    if (!haConsenso(categoria)) return;
    window.removeEventListener(EVENTO_SCELTE, ascolta);
    fn();
  };
  window.addEventListener(EVENTO_SCELTE, ascolta);
  return () => window.removeEventListener(EVENTO_SCELTE, ascolta);
}

/* Il pulsante "Gestisci cookie" del pie e quello della cookie policy non
   conoscono il banner: gli mandano un evento. */
export function apriPreferenzeCookie() {
  window.dispatchEvent(new CustomEvent(EVENTO_APRI));
}

export function suScelte(fn) {
  const h = (e) => fn(e.detail);
  window.addEventListener(EVENTO_SCELTE, h);
  return () => window.removeEventListener(EVENTO_SCELTE, h);
}

export function suApriPreferenze(fn) {
  window.addEventListener(EVENTO_APRI, fn);
  return () => window.removeEventListener(EVENTO_APRI, fn);
}
