import { useRef } from "react";
import { CHI_SIAMO, PROVENIENZA } from "../data/menu.js";
import { useReveal } from "../lib/reveal.js";

/* ===========================================================================
   ChiSiamo — la storia del locale, sotto la vetrina della home
   ---------------------------------------------------------------------------
   Testo del cliente a sinistra, grande e da leggere; a destra la provenienza
   (carne e pane svizzeri) in un pannello blu scuro, con un panino che ne
   esce dall'alto: carne e pane sono proprio quello che si vede nella foto.
   Il panino e l'hamburger e provola, non uno dei tre della vetrina appena
   sopra, cosi non si ripete la stessa fotografia due volte di fila.

   Le entrate le fa useReveal (lib/reveal.js), lo stesso delle pagine interne:
   qui siamo tre schermate sotto la piega, il sipario non c'entra.
   =========================================================================== */

/* Bandiera svizzera: quadrata, croce coi bracci lunghi 7/6 della larghezza. */
function BandieraSvizzera({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="4" fill="#DA291C" />
      <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" />
    </svg>
  );
}

export default function ChiSiamo() {
  const root = useRef(null);
  useReveal(root);

  return (
    <section
      ref={root}
      id="chi-siamo"
      aria-labelledby="chi-siamo-titolo"
      className="relative isolate overflow-hidden bg-white"
    >
      {/* macchia azzurra dietro al titolo, come nelle testate interne */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[4%] -left-[14%] -z-10 aspect-[1.3/1] w-[110vw] max-w-[900px] rotate-[-8deg]"
        style={{
          borderRadius: "58% 42% 71% 29% / 38% 63% 37% 62%",
          background:
            "radial-gradient(closest-side, rgba(13,169,220,0.16), rgba(13,169,220,0.08) 50%, rgba(13,169,220,0) 100%)",
        }}
      />

      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-[clamp(56px,7vw,120px)] px-[clamp(20px,5vw,72px)] py-[clamp(80px,13vh,160px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <h2
            id="chi-siamo-titolo"
            className="font-display font-extrabold text-blu-950"
            style={{
              fontSize: "clamp(2.8rem, min(8vw, 12vh), 6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.045em",
            }}
          >
            {/* maschera per riga, con riserva per i discendenti */}
            <span className="mb-[-0.12em] block overflow-hidden pb-[0.12em]">
              <span data-line className="block">
                Chi siamo
              </span>
            </span>
          </h2>
          <p
            data-item
            className="mt-1 font-script text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.15] text-blu-600"
          >
            la nostra storia
          </p>

          <p
            data-item
            className="mt-[clamp(22px,3.4vh,40px)] max-w-[44ch] text-[clamp(1.08rem,0.96rem+0.5vw,1.38rem)] leading-[1.65] text-blu-800"
          >
            {CHI_SIAMO.racconto}
          </p>
          <p
            data-item
            className="mt-[clamp(16px,2.4vh,26px)] max-w-[30ch] font-display text-[clamp(1.3rem,1.1rem+0.8vw,1.9rem)] leading-[1.2] font-bold text-blu-950"
            style={{ letterSpacing: "-0.02em" }}
          >
            {CHI_SIAMO.chiusa}
          </p>
        </div>

        {/* provenienza: il panino esce dal pannello. Lo spazio sopra il
            pannello e uno spaziatore interno e non un padding del blocco: un
            padding in % si calcola sulla colonna della griglia, che sotto lg
            e larga quanto la pagina, e il panino si staccava dal pannello. */}
        <div data-item className="relative mx-auto w-full max-w-[520px]">
          <div aria-hidden="true" className="pb-[30%]" />
          <img
            src="img/prodotti/hamburger-provola.webp"
            srcSet="img/prodotti/hamburger-provola-sm.webp 680w, img/prodotti/hamburger-provola.webp 914w"
            sizes="(min-width: 1024px) 470px, 88vw"
            width="914"
            height="484"
            alt="Panino hamburger e provola"
            loading="lazy"
            decoding="async"
            className="absolute top-0 left-1/2 z-10 w-[92%] -translate-x-1/2"
          />

          <div className="relative overflow-hidden rounded-[32px] bg-blu-950 px-[clamp(24px,3vw,40px)] pt-[23%] pb-[clamp(20px,2.6vw,32px)] text-white shadow-[0_40px_80px_-46px_rgba(7,41,55,0.9)]">
            {/* alone azzurro sotto al panino */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[30%] left-1/2 aspect-square w-[120%] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(13,169,220,0.42), rgba(13,169,220,0.14) 55%, rgba(13,169,220,0) 100%)",
              }}
            />

            <p className="relative font-script text-[clamp(1.7rem,2.6vw,2.3rem)] leading-none text-blu-300">
              Provenienza
            </p>
            <ul className="relative mt-3">
              {PROVENIENZA.map((p, i) => (
                <li
                  key={p.cosa}
                  className={`flex items-center justify-between gap-4 py-[clamp(14px,2vw,20px)] ${
                    i ? "border-t border-blu-800" : ""
                  }`}
                >
                  <span
                    className="font-display text-[clamp(2.3rem,4.2vw,3.4rem)] leading-none font-extrabold"
                    style={{ letterSpacing: "-0.045em" }}
                  >
                    {p.cosa}
                    <span className="sr-only"> {p.da}</span>
                  </span>
                  <span aria-hidden="true" className="flex items-center gap-3">
                    <span
                      className="font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-none font-extrabold text-blu-200"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      CH
                    </span>
                    <BandieraSvizzera className="h-[clamp(36px,3.6vw,46px)] w-[clamp(36px,3.6vw,46px)] shrink-0" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
