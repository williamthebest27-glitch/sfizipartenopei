import { useEffect, useId, useRef, useState } from "react";
import { quandoEntraIlSito } from "../lib/intro.js";
import {
  CATEGORIE,
  leggiConsenso,
  salvaConsenso,
  suApriPreferenze,
} from "../lib/consenso.js";
import { CookieGlyph, CloseGlyph, ArrowGlyph } from "./glyphs.jsx";

/* ===========================================================================
   CookieBanner — il riquadro delle scelte sui cookie
   ---------------------------------------------------------------------------
   Una scheda in basso a destra, non una fascia che copre mezza pagina: il
   sito non usa niente di facoltativo, quindi il banner deve dirlo e farsi da
   parte, non bloccare la lettura. A destra perche a sinistra, sulla home,
   coprirebbe i pulsanti della hero; sulle pagine legali lascia libero
   l'indice. Non e modale e non ruba il fuoco alla prima visita; lo prende
   solo quando lo apre il visitatore da "Gestisci cookie".

   "Accetta tutti" e "Solo necessari" hanno lo stesso peso: rifiutare deve
   costare un clic esattamente come accettare.

   Sulla home aspetta il sipario (lib/intro.js) e poi ancora un attimo, cosi
   non entra in scena insieme al titolo della hero. Lo monta SiteFooter, quindi
   c'e su tutte le pagine pubbliche e non nella dashboard del pranzo.
   =========================================================================== */

const RITARDO = 1400; // ms dopo l'apertura del sito
const USCITA = 450; // ms, deve coprire la transizione di uscita

const VOCI = [
  {
    id: "necessari",
    nome: "Necessari",
    testo:
      "Ricordano le tue scelte su questo riquadro e se hai già visto l'animazione d'apertura. Senza, il sito non funziona come dovrebbe.",
    fisso: true,
  },
  {
    id: "statistiche",
    nome: "Statistiche",
    testo:
      "Servirebbero a contare in forma anonima le pagine visitate. Al momento sul sito non ne è attivo nessuno.",
  },
  {
    id: "marketing",
    nome: "Marketing",
    testo:
      "Servirebbero a mostrare pubblicità o contenuti personalizzati. Al momento non ne usiamo.",
  },
];

const tutte = (valore) => Object.fromEntries(CATEGORIE.map((c) => [c, valore]));

function Interruttore({ acceso, onChange, etichetta, descrittoDa }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={acceso}
      aria-label={etichetta}
      aria-describedby={descrittoDa}
      onClick={() => onChange(!acceso)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-300 ease-hero ${
        acceso ? "border-blu-700 bg-blu-700" : "border-blu-200 bg-blu-100"
      }`}
    >
      <span
        aria-hidden="true"
        className={`block h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(7,41,55,0.3)] transition-transform duration-300 ease-hero ${
          acceso ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

const btnPieno =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-blu-900 px-3 py-3 sm:px-5 font-body text-[0.7rem] font-semibold tracking-[0.1em] whitespace-nowrap text-white uppercase transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:bg-blu-700 focus-visible:-translate-y-0.5";
const btnVuoto =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-blu-200 bg-white px-3 py-3 sm:px-5 font-body text-[0.7rem] font-semibold tracking-[0.1em] whitespace-nowrap text-blu-900 uppercase transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:border-blu-700 focus-visible:-translate-y-0.5";

export default function CookieBanner() {
  const [montato, setMontato] = useState(false);
  const [dentro, setDentro] = useState(false);
  const [vista, setVista] = useState("sintesi"); // "sintesi" | "preferenze"
  const [scelte, setScelte] = useState(() => tutte(false));
  const [giaDeciso, setGiaDeciso] = useState(false);
  const [giro, setGiro] = useState(0); // ogni apertura, anche a scheda gia aperta

  const titolo = useRef(null);
  const daChi = useRef(null); // a chi restituire il fuoco alla chiusura
  const prendiFuoco = useRef(false);
  const timerUscita = useRef(0);

  const uid = useId();
  const idTitolo = `${uid}-titolo`;
  const idTesto = `${uid}-testo`;

  function apri(conVista, fuoco) {
    window.clearTimeout(timerUscita.current);
    const salvato = leggiConsenso();
    setGiaDeciso(Boolean(salvato));
    setScelte(salvato ? { ...tutte(false), ...salvato.scelte } : tutte(false));
    setVista(conVista);
    prendiFuoco.current = fuoco;
    setMontato(true);
    setGiro((g) => g + 1);
  }

  function chiudi() {
    setDentro(false);
    timerUscita.current = window.setTimeout(() => setMontato(false), USCITA);
    const torna = daChi.current;
    daChi.current = null;
    if (torna && document.contains(torna)) torna.focus({ preventScroll: true });
  }

  function decidi(valori) {
    salvaConsenso(valori);
    chiudi();
  }

  /* Prima visita (o scelte scadute): si presenta da solo, dopo il sipario. */
  useEffect(() => {
    if (leggiConsenso()) return;
    let timer = 0;
    const stacca = quandoEntraIlSito(() => {
      timer = window.setTimeout(() => apri("sintesi", false), RITARDO);
    });
    return () => {
      stacca();
      window.clearTimeout(timer);
    };
  }, []);

  /* "Gestisci cookie" dal pie o dalla cookie policy. */
  useEffect(
    () =>
      suApriPreferenze(() => {
        daChi.current = document.activeElement;
        apri("preferenze", true);
      }),
    []
  );

  /* Entrata: un fotogramma dopo il montaggio, se no la transizione non parte. */
  useEffect(() => {
    if (!montato) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setDentro(true))
    );
    return () => cancelAnimationFrame(raf);
  }, [montato, giro]);

  useEffect(() => {
    if (dentro && prendiFuoco.current) {
      prendiFuoco.current = false;
      titolo.current?.focus({ preventScroll: true });
    }
  }, [dentro, vista, giro]);

  /* Esc chiude solo chi ha gia scelto: alla prima visita una scelta serve. */
  useEffect(() => {
    if (!montato || !giaDeciso) return;
    const onKey = (e) => {
      if (e.key === "Escape") chiudi();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [montato, giaDeciso]);

  useEffect(() => () => window.clearTimeout(timerUscita.current), []);

  if (!montato) return null;

  const preferenze = vista === "preferenze";

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={idTitolo}
      aria-describedby={idTesto}
      data-in={dentro ? "true" : "false"}
      className="fixed inset-x-4 bottom-4 z-[60] max-h-[calc(100svh-2rem)] overflow-y-auto overscroll-contain rounded-[28px] border border-blu-100 bg-white text-blu-800 shadow-[0_34px_80px_-34px_rgba(7,41,55,0.6),0_10px_28px_-14px_rgba(7,41,55,0.28)] transition-[opacity,transform] duration-500 ease-hero data-[in=false]:translate-y-6 data-[in=false]:opacity-0 motion-reduce:transition-none sm:bottom-6 sm:left-auto sm:right-6 sm:w-[min(440px,calc(100vw-3rem))]"
    >
      {/* macchia azzurra, la stessa delle testate interne */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-14 aspect-square w-56"
        style={{
          borderRadius: "58% 42% 71% 29% / 38% 63% 37% 62%",
          background:
            "radial-gradient(closest-side, rgba(13,169,220,0.2), rgba(13,169,220,0.08) 60%, rgba(13,169,220,0) 100%)",
        }}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blu-200 bg-blu-50 text-blu-700">
            <CookieGlyph size={20} />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="font-body text-[0.6rem] font-semibold tracking-[0.22em] text-blu-700 uppercase">
              Cookie e privacy
            </p>
            <h2
              id={idTitolo}
              ref={titolo}
              tabIndex={-1}
              className="mt-1 font-display text-[1.28rem] leading-tight font-extrabold text-blu-950 outline-none"
              style={{ letterSpacing: "-0.025em" }}
            >
              {preferenze ? "Le tue preferenze" : "Usiamo solo il necessario"}
            </h2>
          </div>

          {preferenze && (
            <button
              type="button"
              onClick={() => (giaDeciso ? chiudi() : setVista("sintesi"))}
              aria-label={giaDeciso ? "Chiudi senza modificare" : "Torna indietro"}
              className="-mt-1 -mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-blu-700 transition-colors duration-300 hover:bg-blu-50 hover:text-blu-950"
            >
              {giaDeciso ? <CloseGlyph size={18} /> : <span className="rotate-180"><ArrowGlyph size={18} /></span>}
            </button>
          )}
        </div>

        {!preferenze ? (
          <>
            <p id={idTesto} className="mt-4 text-[0.9rem] leading-relaxed">
              Il sito salva nel tuo browser solo ciò che gli serve per funzionare. Niente pubblicità né
              profilazione: statistiche e marketing partirebbero soltanto con il tuo consenso.{" "}
              <a
                href="/cookie-policy"
                className="font-semibold text-blu-700 underline decoration-blu-300 underline-offset-[3px] hover:text-blu-950 hover:decoration-blu-600"
              >
                Cookie policy
              </a>{" "}
              ·{" "}
              <a
                href="/privacy-policy"
                className="font-semibold text-blu-700 underline decoration-blu-300 underline-offset-[3px] hover:text-blu-950 hover:decoration-blu-600"
              >
                Privacy
              </a>
            </p>

            <div className="mt-5 flex flex-col gap-2.5 min-[360px]:flex-row">
              <button type="button" className={btnVuoto} onClick={() => decidi(tutte(false))}>
                Solo necessari
              </button>
              <button type="button" className={btnPieno} onClick={() => decidi(tutte(true))}>
                Accetta tutti
              </button>
            </div>

            <button
              type="button"
              onClick={() => setVista("preferenze")}
              className="group mt-3.5 inline-flex items-center gap-2 font-body text-[0.78rem] font-semibold text-blu-700 transition-colors duration-300 hover:text-blu-950"
            >
              Scegli tu cosa attivare
              <span className="transition-transform duration-300 ease-hero group-hover:translate-x-1">
                <ArrowGlyph size={14} />
              </span>
            </button>
          </>
        ) : (
          <>
            <p id={idTesto} className="mt-4 text-[0.88rem] leading-relaxed">
              Puoi cambiare idea quando vuoi da «Gestisci cookie», in fondo a ogni pagina. I dettagli sono
              nella{" "}
              <a
                href="/cookie-policy"
                className="font-semibold text-blu-700 underline decoration-blu-300 underline-offset-[3px] hover:text-blu-950 hover:decoration-blu-600"
              >
                cookie policy
              </a>
              .
            </p>

            <ul className="mt-4 flex flex-col gap-2.5">
              {VOCI.map((v) => {
                const idDesc = `${uid}-${v.id}`;
                return (
                  <li key={v.id} className="rounded-2xl border border-blu-100 bg-blu-50/60 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-display text-[1rem] font-bold text-blu-950">{v.nome}</span>
                      {v.fisso ? (
                        <span className="rounded-full bg-white px-3 py-1 font-body text-[0.6rem] font-semibold tracking-[0.14em] text-blu-700 uppercase ring-1 ring-blu-200">
                          Sempre attivi
                        </span>
                      ) : (
                        <Interruttore
                          acceso={scelte[v.id]}
                          etichetta={v.nome}
                          descrittoDa={idDesc}
                          onChange={(acceso) => setScelte((s) => ({ ...s, [v.id]: acceso }))}
                        />
                      )}
                    </div>
                    <p id={idDesc} className="mt-1.5 text-[0.82rem] leading-relaxed text-blu-700">
                      {v.testo}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex flex-col gap-2.5 min-[360px]:flex-row">
              <button type="button" className={btnVuoto} onClick={() => decidi(scelte)}>
                Salva le scelte
              </button>
              <button type="button" className={btnPieno} onClick={() => decidi(tutte(true))}>
                Accetta tutti
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
