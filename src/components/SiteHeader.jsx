import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MailGlyph } from "./glyphs.jsx";
import { quandoEntraIlSito } from "../lib/intro.js";

/* ===========================================================================
   SiteHeader — barra fissa in cima, condivisa da tutte le schermate
   ---------------------------------------------------------------------------
   Logo a sinistra, capsula di navigazione al centro, telefono a destra.
   Le due fasce laterali sono flex-1 basis-0: e cosi che la capsula resta
   centrata davvero, senza una translate CSS che entrerebbe in conflitto con la
   transform di GSAP durante l'entrata e si romperebbe al resize.

   Sta in position: fixed perche sotto c'e una sezione che ScrollTrigger blocca
   in pin: se la barra scorresse col documento sparirebbe proprio mentre il
   carosello e in scena.
   =========================================================================== */

const TEL = "+41784065676";
const TEL_LABEL = "078 406 56 76";

/* Tre pagine, non cinque: pranzo, sfizi e panini erano tre pagine separate sul
   sito Webador, qui sono tre sezioni ancorate dentro "I nostri prodotti". Gli
   href sono relativi e con estensione: cosi il sito funziona servito da
   qualsiasi cartella, anche aperto dal disco. */
const NAV = [
  { label: "Home", short: "Home", href: "index.html" },
  {
    label: "I nostri prodotti",
    short: "Prodotti",
    href: "i-nostri-prodotti.html",
  },
  { label: "Contatti", short: "Contatti", href: "contatti.html" },
];

/* Copia locale del marchio: il CDN di Webador non e una dipendenza che vale la
   pena tenersi, e in anteprima pubblicata sarebbe comunque bloccato. */
const LOGO = "img/logo.webp";

function PhoneGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M5.2 3.8h3.1l1.5 3.8-1.9 1.4a11.4 11.4 0 0 0 5.1 5.1l1.4-1.9 3.8 1.5v3.1a1.6 1.6 0 0 1-1.8 1.6A15.4 15.4 0 0 1 3.6 5.6a1.6 1.6 0 0 1 1.6-1.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Voce di navigazione: si ingrandisce e si accende al passaggio del mouse.
   Zoom e accensione sono in CSS puro, non in GSAP: cosi restano vivi anche
   quando le animazioni sono disattivate e non litigano con la transform che
   GSAP mette sulla capsula durante l'entrata in scena.

   La pastiglia accesa e blu-700: il blu pieno del marchio sotto testo bianco
   farebbe 2,6:1. Il bagliore attorno, invece, e decorativo, e li il blu del
   marchio ci sta tutto.
   -------------------------------------------------------------------------- */
function NavLink({ item, compact, current }) {
  return (
    <a
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={`group relative isolate rounded-full transition-transform duration-300 ease-hero hover:scale-[1.1] focus-visible:scale-[1.1] ${
        compact ? "px-2.5 py-1.5" : "px-4 py-2"
      }`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full bg-blu-700 opacity-0 shadow-[0_0_0_1px_rgba(13,169,220,0.55),0_10px_26px_-6px_rgba(13,169,220,0.9)] transition-opacity duration-300 ease-hero group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      {current && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-20 rounded-full bg-blu-50"
        />
      )}
      <span
        className={`relative block font-body font-semibold uppercase transition-colors duration-300 ease-hero group-hover:text-white group-focus-visible:text-white ${
          current ? "text-blu-700" : "text-blu-800"
        } ${compact ? "text-[0.6rem] tracking-[0.1em]" : "text-[0.7rem] tracking-[0.14em]"}`}
      >
        {compact ? item.short : item.label}
      </span>
    </a>
  );
}

export default function SiteHeader({ current = "index.html" }) {
  const root = useRef(null);
  const bg = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = el.querySelectorAll("[data-head-item]");
        gsap.set(items, { opacity: 0, y: -14 });
        const entrata = gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "expo.out",
          /* il cliente vuole: prima il titolo, poi la foto, poi il menu.
             1,35s e il punto in cui la hero ha finito il titolo e la
             fotografia e a meta dissolvenza. */
          delay: 1.35,
          /* Sulla home il via lo da il sipario, nell'istante in cui comincia a
             dissolversi: il ritardo di 1,35s va contato da li, non dal
             montaggio, altrimenti il menu entrerebbe dietro al telo. Sulle
             pagine interne, che il sipario non ce l'hanno, parte subito. */
          paused: true,
        });

        const stacca = quandoEntraIlSito(() => entrata.play());
        return () => stacca();
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* Sulla home la barra sta su bianco e puo restare trasparente, ma sulle
     pagine interne il contenuto le scorre dietro e il logo diventa illeggibile.
     Un fondo smerigliato che si accende dopo una trentina di pixel risolve
     entrambe. Nessuna lettura di layout nel listener: solo window.scrollY. */
  useEffect(() => {
    const bar = bg.current;
    if (!bar) return;
    const onScroll = () => {
      bar.dataset.on = window.scrollY > 32 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={root}
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      <div
        ref={bg}
        data-on="false"
        aria-hidden="true"
        className="absolute inset-0 border-b border-blu-100 bg-white/92 opacity-0 transition-opacity duration-300 ease-hero data-[on=true]:opacity-100"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,72px)]">
        <div className="pointer-events-auto flex items-center gap-4 py-[clamp(10px,2vh,20px)]">
          <div className="flex flex-1 basis-0 justify-start">
            <a
              href="index.html"
              data-head-item
              className="flex items-center gap-3 rounded-sm mix-blend-multiply"
              aria-label="Sfizi Partenopei, torna alla home"
            >
              <img
                src={LOGO}
                alt=""
                width="240"
                height="240"
                className="h-10 w-10 sm:h-11 sm:w-11"
              />
              <span className="hidden font-body text-[0.72rem] font-semibold tracking-[0.18em] text-blu-950 uppercase lg:block">
                Sfizi Partenopei
              </span>
            </a>
          </div>

          <nav
            data-head-item
            aria-label="Navigazione principale"
            className="relative hidden shrink-0 items-center rounded-full border border-blu-100 bg-white/75 p-1 shadow-[0_14px_38px_-22px_rgba(7,41,55,0.6)] backdrop-blur-md lg:flex"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                current={item.href === current}
              />
            ))}
          </nav>

          <div className="flex flex-1 basis-0 items-center justify-end gap-3 lg:gap-5">
            <a
              href={`tel:${TEL}`}
              data-head-item
              className="group hidden items-center gap-2 font-body text-[0.76rem] font-semibold tracking-[0.08em] text-blu-950 tabular-nums sm:flex"
            >
              <span className="text-blu-600 transition-transform duration-300 ease-hero group-hover:-rotate-12">
                <PhoneGlyph />
              </span>
              {TEL_LABEL}
            </a>

            <a
              href="contatti.html"
              data-head-item
              className="group relative isolate inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-blu-900 px-4 py-2.5 font-body text-[0.66rem] font-semibold tracking-[0.12em] text-white uppercase shadow-[0_14px_30px_-16px_rgba(7,41,55,0.9)] transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-14px_rgba(13,169,220,0.8)] focus-visible:-translate-y-0.5 sm:px-5 sm:py-3 sm:text-[0.68rem]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-blu-600 transition-transform duration-500 ease-hero group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <span className="relative z-10 flex items-center gap-2.5 whitespace-nowrap">
                <MailGlyph />
                Contattaci
              </span>
            </a>
          </div>
        </div>

        {/* Sotto lg la capsula passa a tutta larghezza e si adatta da sola a
          qualsiasi telefono, invece di sfondare o di sparire. */}
        <nav
          data-head-item
          aria-label="Navigazione principale"
          className="pointer-events-auto flex w-full items-center justify-between rounded-full border border-blu-100 bg-white/75 p-1 shadow-[0_14px_38px_-22px_rgba(7,41,55,0.6)] backdrop-blur-md lg:hidden"
        >
          {NAV.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              compact
              current={item.href === current}
            />
          ))}
        </nav>
      </div>
    </header>
  );
}
