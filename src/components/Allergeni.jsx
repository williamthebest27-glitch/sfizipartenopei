import { useId, useRef } from "react";
import { ALLERGENI_LINGUE, INFO } from "../data/menu.js";
import { useReveal } from "../lib/reveal.js";

/* ===========================================================================
   Allergeni — l'avviso in quattro lingue, in fondo alla home
   ---------------------------------------------------------------------------
   Lugano vuol dire turisti: l'avviso c'e in italiano, inglese, francese e
   tedesco, come sul vecchio sito. Li c'erano le emoji delle bandiere, che su
   Windows escono come due lettere: qui le bandiere sono SVG, come quella
   italiana della hero. Ogni voce porta il suo `lang`, cosi un lettore di
   schermo legge il tedesco in tedesco.

   Colonne con un filetto in testa, non card: sono traduzioni dello stesso
   testo, non quattro cose diverse da mettere in vetrina.
   =========================================================================== */

function Inglese() {
  const id = useId();
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="block h-full w-full">
      <clipPath id={id}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

const tricolore = (a, b, c, orizzontale) => (
  <svg viewBox="0 0 24 16" preserveAspectRatio="none" className="block h-full w-full">
    {orizzontale ? (
      <>
        <rect width="24" height="5.34" fill={a} />
        <rect y="5.33" width="24" height="5.34" fill={b} />
        <rect y="10.66" width="24" height="5.34" fill={c} />
      </>
    ) : (
      <>
        <rect width="8" height="16" fill={a} />
        <rect x="8" width="8" height="16" fill={b} />
        <rect x="16" width="8" height="16" fill={c} />
      </>
    )}
  </svg>
);

const BANDIERE = {
  it: () => tricolore("#008C45", "#F4F5F0", "#CD212A"),
  en: () => <Inglese />,
  fr: () => tricolore("#0055A4", "#F4F5F0", "#EF4135"),
  de: () => tricolore("#1A1A1A", "#DD0000", "#FFCE00", true),
};

function Bandiera({ lang }) {
  const Disegno = BANDIERE[lang];
  return (
    <span
      aria-hidden="true"
      className="block h-[15px] w-[22px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-blu-950/15"
    >
      <Disegno />
    </span>
  );
}

export default function Allergeni() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section ref={root} aria-labelledby="allergeni-titolo" className="bg-blu-50">
      <div className="mx-auto grid w-full max-w-[1440px] gap-[clamp(32px,4vw,80px)] px-[clamp(20px,5vw,72px)] py-[clamp(56px,9vh,104px)] lg:grid-cols-[minmax(240px,0.75fr)_minmax(0,2fr)]">
        <div>
          <h2
            id="allergeni-titolo"
            data-item
            className="font-display text-[clamp(1.9rem,3vw,2.7rem)] leading-[1.02] font-extrabold text-blu-950"
            style={{ letterSpacing: "-0.035em" }}
          >
            Allergie e intolleranze
          </h2>
          <p data-item className="mt-4 max-w-[30ch] text-[0.98rem] leading-relaxed text-blu-800">
            Chiedici prima di ordinare, al banco o al telefono:{" "}
            <a
              href={`tel:${INFO.tel}`}
              className="font-semibold whitespace-nowrap text-blu-700 underline decoration-blu-300 underline-offset-[3px] transition-colors duration-300 hover:text-blu-950 hover:decoration-blu-600"
            >
              {INFO.telLabel}
            </a>
          </p>
        </div>

        <ul className="grid gap-x-[clamp(28px,4vw,64px)] gap-y-[clamp(28px,4vh,44px)] md:grid-cols-2">
          {ALLERGENI_LINGUE.map((l) => (
            <li key={l.lang} lang={l.lang} data-item className="border-t border-blu-200 pt-5">
              <p className="flex items-center gap-3 font-body text-[0.68rem] font-semibold tracking-[0.18em] text-blu-700 uppercase">
                <Bandiera lang={l.lang} />
                {l.lingua}
              </p>
              <p className="mt-3 max-w-[60ch] text-[1rem] leading-relaxed text-blu-900">{l.testo}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
