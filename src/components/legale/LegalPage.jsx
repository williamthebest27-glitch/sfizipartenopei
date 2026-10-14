import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReveal } from "../../lib/reveal.js";
import { apriPreferenzeCookie, leggiConsenso, suScelte } from "../../lib/consenso.js";
import { AGGIORNATO, DOCUMENTI, SOCIETA } from "../../data/legale.js";
import PageOpener from "../PageOpener.jsx";
import SiteFooter from "../SiteFooter.jsx";
import { ArrowGlyph, CheckGlyph, CookieGlyph } from "../glyphs.jsx";

/* ===========================================================================
   LegalPage — impaginato comune di privacy, cookie, termini e impressum
   ---------------------------------------------------------------------------
   Pagine da leggere, non da guardare: stessa testata delle pagine interne,
   poi una colonna di testo stretta (72 battute) e, da lg, l'indice incollato
   a sinistra che segue la lettura. Sotto lg l'indice e un <details> chiuso in
   cima al testo, cosi non spinge il contenuto due schermate piu giu.

   Ogni documento e un oggetto { titolo, script, lead, sommario, sezioni } in
   un file a parte: qui c'e solo la forma.
   =========================================================================== */

const scrollMorbido = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

function vaiA(id, e) {
  const sezione = document.getElementById(id);
  if (!sezione) return;
  e?.preventDefault();
  sezione.scrollIntoView({ behavior: scrollMorbido(), block: "start" });
  history.replaceState(null, "", `#${id}`);
  sezione.querySelector("h2")?.focus({ preventScroll: true });
}

/* Aperta con l'ancora nell'indirizzo (/privacy-policy#diritti): il browser
   cerca la sezione prima che React la disegni, quindi la pagina resterebbe in
   cima. Ci si va da qui, e di nuovo quando arrivano i font, che cambiano
   l'altezza dei paragrafi sopra; a meno che nel frattempo il visitatore non
   abbia gia toccato qualcosa. Va dichiarato prima di useReveal. */
function useAncoraIniziale() {
  useLayoutEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let toccato = false;
    const tocca = () => {
      toccato = true;
    };
    const eventi = ["wheel", "touchstart", "keydown", "pointerdown"];
    eventi.forEach((t) => window.addEventListener(t, tocca, { passive: true, once: true }));
    const vai = () => {
      if (!toccato) document.getElementById(id)?.scrollIntoView({ block: "start" });
    };
    vai();
    document.fonts?.ready.then(vai);
    return () => eventi.forEach((t) => window.removeEventListener(t, tocca));
  }, []);
}

/* La sezione che si sta leggendo, per accendere la voce dell'indice. Una
   fascia sottile a un terzo dello schermo: la sezione che la attraversa e
   quella attiva. */
function useSezioneAttiva(ids) {
  const [attiva, setAttiva] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setAttiva(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -64% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return attiva;
}

const num = (i) => String(i + 1).padStart(2, "0");

/* ---------------------------------------------------------------------------
   Pezzi usati dentro i documenti
   --------------------------------------------------------------------------- */

/* Coppie etichetta / valore: dati societari, voci della cookie policy. */
export function Righe({ righe, className = "" }) {
  return (
    <dl
      className={`overflow-hidden rounded-3xl border border-blu-100 bg-white text-[0.95rem] leading-relaxed ${className}`}
    >
      {righe.map(([etichetta, valore], i) => (
        <div
          key={etichetta}
          className={`grid gap-1 px-5 py-3.5 sm:grid-cols-[minmax(150px,34%)_1fr] sm:gap-6 sm:px-6 ${
            i ? "border-t border-blu-100" : ""
          }`}
        >
          <dt className="font-body text-[0.64rem] font-semibold tracking-[0.18em] text-blu-700 uppercase sm:pt-1">
            {etichetta}
          </dt>
          <dd className="m-0 min-w-0 text-blu-950">{valore}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Esterno({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/* Apre il banner sulle preferenze, da dentro il testo della cookie policy. */
export function PulsantePreferenze() {
  return (
    <button
      type="button"
      onClick={apriPreferenzeCookie}
      className="group inline-flex items-center gap-2.5 rounded-full bg-blu-900 px-6 py-3.5 font-body text-[0.72rem] font-semibold tracking-[0.1em] text-white uppercase shadow-[0_18px_40px_-22px_rgba(7,41,55,0.95)] transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:bg-blu-700 focus-visible:-translate-y-0.5"
    >
      <CookieGlyph size={17} />
      Gestisci le preferenze
    </button>
  );
}

/* Le scelte salvate in questo browser, aggiornate appena cambiano. */
export function StatoConsenso() {
  const [dato, setDato] = useState(null);
  useEffect(() => {
    setDato(leggiConsenso());
    return suScelte(setDato);
  }, []);

  if (!dato) {
    return <p>In questo browser non hai ancora espresso una scelta.</p>;
  }
  const quando = new Date(dato.data).toLocaleDateString("it-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const si = (v) => (v ? "consentite" : "non consentite");
  return (
    <p>
      Le tue scelte in questo browser, salvate il {quando}: <strong>necessari</strong> sempre attivi,{" "}
      <strong>statistiche</strong> {si(dato.scelte.statistiche)}, <strong>marketing</strong>{" "}
      {si(dato.scelte.marketing)}.
    </p>
  );
}

/* ---------------------------------------------------------------------------
   Pagina
   --------------------------------------------------------------------------- */

function Indice({ sezioni, attiva }) {
  return (
    <ol className="flex flex-col">
      {sezioni.map((s, i) => {
        const on = s.id === attiva;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={(e) => vaiA(s.id, e)}
              aria-current={on ? "location" : undefined}
              className={`group flex items-baseline gap-3 border-l-2 py-1.5 pl-4 text-[0.88rem] leading-snug transition-colors duration-300 ease-hero ${
                on
                  ? "border-blu-600 font-semibold text-blu-950"
                  : "border-blu-100 text-blu-700 hover:border-blu-300 hover:text-blu-950"
              }`}
            >
              <span className={`font-body text-[0.66rem] tabular-nums ${on ? "text-blu-600" : "text-blu-400"}`}>
                {num(i)}
              </span>
              {s.titolo}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export default function LegalPage({ doc }) {
  const root = useRef(null);
  const ids = useRef(doc.sezioni.map((s) => s.id)).current;

  useAncoraIniziale();
  useReveal(root);
  const attiva = useSezioneAttiva(ids);

  const altri = DOCUMENTI.filter((d) => d.id !== doc.id);

  return (
    <>
      <main ref={root}>
        <PageOpener eyebrow="Informazioni legali" title={doc.titolo} script={doc.script} lead={doc.lead}>
          <div data-item className="mt-[clamp(18px,3vh,30px)] flex flex-wrap gap-2">
            <span className="rounded-full border border-blu-200 bg-white/80 px-3.5 py-1.5 font-body text-[0.7rem] font-semibold text-blu-800">
              Aggiornato il {AGGIORNATO}
            </span>
            <span className="rounded-full border border-blu-200 bg-white/80 px-3.5 py-1.5 font-body text-[0.7rem] font-semibold text-blu-800">
              {SOCIETA.ragioneSociale}
            </span>
          </div>
        </PageOpener>

        <div data-reveal className="mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,72px)] pb-[clamp(64px,10vh,120px)]">
          <div className="grid gap-10 lg:grid-cols-[minmax(220px,290px)_minmax(0,1fr)] lg:gap-[clamp(48px,6vw,112px)]">
            {/* indice incollato, solo da lg */}
            <aside className="hidden lg:block">
              <nav aria-label="Indice del documento" className="sticky top-32 pt-2">
                <p className="mb-4 font-body text-[0.64rem] font-semibold tracking-[0.22em] text-blu-700 uppercase">
                  In questa pagina
                </p>
                <Indice sezioni={doc.sezioni} attiva={attiva} />
              </nav>
            </aside>

            <article className="min-w-0 max-w-[72ch]">
              {doc.sommario && (
                <div data-item className="rounded-[28px] border border-blu-100 bg-blu-50 p-6 sm:p-8">
                  <p className="font-body text-[0.64rem] font-semibold tracking-[0.22em] text-blu-700 uppercase">
                    In breve
                  </p>
                  <ul className="mt-4 flex flex-col gap-3 text-[0.98rem] leading-relaxed text-blu-900">
                    {doc.sommario.map((riga) => (
                      <li key={riga} className="flex gap-3">
                        <span className="mt-[0.3em] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blu-700 text-white">
                          <CheckGlyph size={12} />
                        </span>
                        <span>{riga}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* indice sotto lg: chiuso, si apre a richiesta */}
              <details data-item className="group mt-6 rounded-3xl border border-blu-100 bg-white lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-body text-[0.7rem] font-semibold tracking-[0.18em] text-blu-800 uppercase [&::-webkit-details-marker]:hidden">
                  In questa pagina
                  <span className="text-blu-600 transition-transform duration-300 ease-hero group-open:rotate-90">
                    <ArrowGlyph size={16} />
                  </span>
                </summary>
                <div className="px-3 pb-4">
                  <Indice sezioni={doc.sezioni} attiva={attiva} />
                </div>
              </details>

              {doc.sezioni.map((s, i) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-titolo`}
                  className="mt-[clamp(28px,4vh,44px)] scroll-mt-40 border-t border-blu-100 pt-[clamp(28px,4vh,40px)] lg:scroll-mt-32"
                >
                  <div data-item>
                    <p className="font-body text-[0.68rem] font-semibold tracking-[0.2em] text-blu-600 tabular-nums">
                      {num(i)}
                    </p>
                    <h2
                      id={`${s.id}-titolo`}
                      tabIndex={-1}
                      className="mt-1.5 font-display font-extrabold text-blu-950 outline-none"
                      style={{
                        fontSize: "clamp(1.35rem, 1.1rem + 0.9vw, 1.8rem)",
                        lineHeight: 1.15,
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {s.titolo}
                    </h2>
                    <div className="prosa mt-4">{s.corpo}</div>
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>

        {/* gli altri tre documenti */}
        <section data-reveal aria-labelledby="altri-documenti" className="bg-blu-50">
          <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,72px)] py-[clamp(48px,8vh,88px)]">
            <h2
              id="altri-documenti"
              data-item
              className="font-body text-[0.66rem] font-semibold tracking-[0.22em] text-blu-700 uppercase"
            >
              Altri documenti
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {altri.map((d) => (
                <li key={d.id} data-item>
                  <a
                    href={d.href}
                    className="group flex h-full flex-col justify-between gap-8 rounded-[28px] border border-blu-100 bg-white p-6 transition-all duration-500 ease-hero hover:-translate-y-1 hover:border-blu-300 hover:shadow-[0_26px_50px_-30px_rgba(7,41,55,0.5)] focus-visible:-translate-y-1 sm:p-7"
                  >
                    <span>
                      <span
                        className="block font-display text-[1.4rem] font-extrabold text-blu-950"
                        style={{ letterSpacing: "-0.025em" }}
                      >
                        {d.label}
                      </span>
                      <span className="mt-2 block text-[0.92rem] leading-relaxed text-blu-700">{d.desc}</span>
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blu-200 text-blu-700 transition-all duration-500 ease-hero group-hover:border-blu-700 group-hover:bg-blu-700 group-hover:text-white">
                      <ArrowGlyph size={16} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
