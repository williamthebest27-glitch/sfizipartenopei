/* ===========================================================================
   intro — il semaforo fra il sipario e l'entrata del sito
   ---------------------------------------------------------------------------
   Il preloader tiene la schermata per qualche secondo. Se l'entrata della hero
   partisse al montaggio, si consumerebbe dietro al sipario e alla dissolvenza
   il sito sarebbe gia composto: niente entrata, nessun effetto.

   Qui c'e un semaforo minimo. Il sipario si prenota quando il suo modulo viene
   caricato, cioe prima che qualunque effetto React giri; chi anima un'entrata
   registra un callback e viene svegliato nel momento in cui il sipario comincia
   a dissolversi, non quando finisce, cosi le due cose si incrociano.

   Tre garanzie:
   - se il sipario non c'e (pagine interne, che non lo importano) il callback
     parte subito e le pagine si comportano come prima;
   - i callback partono una volta sola;
   - se qualcosa va storto nel sipario, dopo SCAMPO ms si apre lo stesso. Una
     entrata fuori tempo e un difetto, una pagina che resta invisibile e un
     sito rotto.
   =========================================================================== */

const SCAMPO = 8000;

let prenotato = false;
let aperto = false;
let inAttesa = [];
let salvagente = 0;

/* Chiamata dal modulo del sipario, non da un effetto: deve risultare gia vera
   quando gli altri componenti montano. */
export function prenotaSipario() {
  if (aperto || prenotato) return;
  prenotato = true;
  salvagente = window.setTimeout(apriIlSito, SCAMPO);
}

export function apriIlSito() {
  if (aperto) return;
  aperto = true;
  window.clearTimeout(salvagente);
  const coda = inAttesa;
  inAttesa = [];
  coda.forEach((fn) => fn());
}

/* Restituisce la funzione per disdire: serve a React, che in sviluppo monta,
   smonta e rimonta gli effetti, e senza disdetta lascerebbe in coda callback
   che pilotano timeline gia distrutte. */
export function quandoEntraIlSito(fn) {
  if (aperto || !prenotato) {
    fn();
    return () => {};
  }
  inAttesa.push(fn);
  return () => {
    inAttesa = inAttesa.filter((altro) => altro !== fn);
  };
}
