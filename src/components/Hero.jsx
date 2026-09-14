import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ===========================================================================
   Hero — schermata di apertura
   ---------------------------------------------------------------------------
   Composizione su due fuochi: a sinistra il marchio su fondo chiaro, a destra
   la fotografia dei panini col lago. Lo sfondo fornito dal cliente ha gia la
   sfumatura verso il bianco sul lato sinistro; sopra ci metto comunque un velo
   mio, perche con object-cover il ritaglio cambia a ogni formato e la colonna
   di testo deve restare leggibile in tutti.

   Ordine di entrata chiesto dal cliente: prima il titolo, poi la fotografia in
   dissolvenza lenta, poi il menu in alto (che vive in SiteHeader e parte con un
   ritardo coordinato), poi i pulsanti, infine i dettagli.

   Tipografia: "SFIZI" in Bricolage Grotesque nerissimo, "PARTENOPEI" in
   Playfair Display (serif ad alto contrasto), la firma in Sacramento. Tre
   registri diversi che stanno insieme come su un'insegna dipinta.
   =========================================================================== */

const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Sfizi%20Partenopei%2C%20Piazzale%20Gilberto%20Quadri%201%2C%206962%20Viganello%20Lugano";

const LEAD = [
  "Portiamo sulla tua tavola il cibo e la tradizione Partenopea.",
  "A Lugano, ogni giorno, un pezzo di Napoli.",
];

const FEATURES = [
  { k: "leaf", a: "Ingredienti", b: "di qualità" },
  { k: "hat", a: "Ricette", b: "tradizionali" },
  { k: "heart", a: "Passione", b: "Napoletana" },
  { k: "people", a: "Un luogo", b: "di condivisione" },
];

/* --------------------------------------------------------------------------
   Iconcine disegnate in SVG invece che prese da una libreria: stesso peso di
   tratto su tutte e nessun pacchetto in piu.
   -------------------------------------------------------------------------- */
function FeatureGlyph({ k }) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">
      {k === "leaf" && <path d="M5 19c0-7 4.5-11 14-11 0 9-4.5 12-9 12a5 5 0 0 1-5-5Zm0 0 7-7" {...s} />}
      {k === "hat" && (
        <>
          <path d="M6.5 13.5a3.6 3.6 0 1 1 1.6-6.8 4 4 0 0 1 7.8 0 3.6 3.6 0 1 1 1.6 6.8Z" {...s} />
          <path d="M7 14v4.4a1.6 1.6 0 0 0 1.6 1.6h6.8a1.6 1.6 0 0 0 1.6-1.6V14" {...s} />
        </>
      )}
      {k === "heart" && <path d="M12 20s-7-4.4-7-9a3.9 3.9 0 0 1 7-2.4A3.9 3.9 0 0 1 19 11c0 4.6-7 9-7 9Z" {...s} />}
      {k === "people" && (
        <>
          <circle cx="9" cy="8.5" r="3" {...s} />
          <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" {...s} />
          <path d="M16 6.2a3 3 0 0 1 0 5.6M17.2 15a5.5 5.5 0 0 1 3.3 4.5" {...s} />
        </>
      )}
    </svg>
  );
}

function ForkGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M7 3v6a2.2 2.2 0 0 0 4.4 0V3M9.2 11.2V21M16.4 3c-1.5 1-2.2 2.6-2.2 4.6 0 1.7.7 2.8 2.2 3.2V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

/* Bandiera italiana in SVG: l'emoji su Windows viene monocroma. */
function FlagGlyph() {
  return (
    <svg viewBox="0 0 24 16" width="22" height="15" aria-hidden="true" className="shrink-0 rounded-[2px]">
      <rect width="8" height="16" fill="#008C45" />
      <rect x="8" width="8" height="16" fill="#F4F5F0" />
      <rect x="16" width="8" height="16" fill="#CD212A" />
      <rect x="0.4" y="0.4" width="23.2" height="15.2" rx="1.4" fill="none" stroke="rgba(7,41,55,0.18)" strokeWidth="0.8" />
    </svg>
  );
}

/* Timbro circolare: testo su tracciato + profilo del Vesuvio sull'acqua. */
function Stamp() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <path id="stamp-arc-top" d="M100,100 m-74,0 a74,74 0 1,1 148,0" />
        <path id="stamp-arc-bottom" d="M100,100 m-62,0 a62,62 0 1,0 124,0" />
      </defs>
      <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.9" />
      <text fontSize="13" letterSpacing="3.2" fill="currentColor" fontWeight="600">
        <textPath href="#stamp-arc-top" startOffset="50%" textAnchor="middle">
          TRADIZIONE PARTENOPEA
        </textPath>
      </text>
      <text fontSize="13" letterSpacing="3.2" fill="currentColor" fontWeight="600">
        <textPath href="#stamp-arc-bottom" startOffset="50%" textAnchor="middle">
          A LUGANO
        </textPath>
      </text>
      <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M74 100 90 80l10 12 9-14 17 22" />
        <path d="M72 112h56M78 120h44" />
      </g>
    </svg>
  );
}

/* Sottolineatura a pennello sotto la firma. */
function Swash({ className }) {
  return (
    <svg viewBox="0 0 320 16" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path d="M4 11c46-6 92-8 138-7 44 1 88 4 132 9" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

function MouseGlyph() {
  return (
    <svg viewBox="0 0 24 36" width="18" height="27" fill="none" aria-hidden="true">
      <rect x="1.1" y="1.1" width="21.8" height="33.8" rx="10.9" stroke="currentColor" strokeWidth="1.5" />
      <circle data-cue-dot cx="12" cy="10" r="2.1" fill="currentColor" />
    </svg>
  );
}

/* Scroll morbido solo su questo clic, non come regola globale su html: con una
   sezione in pin lo scroll morbido del browser litiga con ScrollTrigger. */
function scrollToVetrina(e) {
  const target = document.getElementById("vetrina");
  if (!target) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY,
    behavior: reduce ? "auto" : "smooth",
  });
}

/* ------------------------------------------------------------------------ */

export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = (sel) => Array.from(el.querySelectorAll(sel));
      const one = (sel) => el.querySelector(sel);
      const mm = gsap.matchMedia();

      /* --- entrata in scena ------------------------------------------------
         L'ordine e quello chiesto: prima il titolo, poi la fotografia in
         dissolvenza lenta, poi i pulsanti e i dettagli. Il menu in alto vive in
         SiteHeader e ha un ritardo di 1,35s, calibrato per inserirsi qui in
         mezzo.

         Sotto prefers-reduced-motion questo blocco non gira mai: nessun
         gsap.set nasconde niente e la schermata si vede subito, completa. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q("[data-word]"), { yPercent: 115 });
        gsap.set(one("[data-script]"), { opacity: 0, y: 18, rotate: -2 });
        gsap.set(one("[data-swash]"), { scaleX: 0, transformOrigin: "left center" });
        gsap.set(q("[data-eyebrow-line]"), { scaleX: 0, transformOrigin: "left center" });
        gsap.set(one("[data-eyebrow-text]"), { opacity: 0, y: 8 });
        gsap.set(one("[data-photo]"), { opacity: 0, scale: 1.08 });
        gsap.set(one("[data-veil]"), { opacity: 0 });
        gsap.set(one("[data-lead]"), { opacity: 0, y: 18 });
        gsap.set(q("[data-cta]"), { opacity: 0, y: 22 });
        gsap.set(q("[data-feature]"), { opacity: 0, y: 16 });
        gsap.set(one("[data-flag]"), { opacity: 0, x: -14 });
        gsap.set(one("[data-stamp]"), { opacity: 0, scale: 0.8, rotation: -18 });
        gsap.set(q("[data-note]"), { opacity: 0, y: 14 });
        gsap.set(one("[data-cue]"), { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });

        /* 1 · il titolo */
        tl.to(q("[data-eyebrow-line]"), { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0)
          .to(one("[data-eyebrow-text]"), { opacity: 1, y: 0, duration: 0.6 }, 0.08)
          .to(q("[data-word]"), { yPercent: 0, duration: 1.25, stagger: 0.13, ease: "expo.out" }, 0.18)
          .to(one("[data-script]"), { opacity: 1, y: 0, rotate: 0, duration: 1, ease: "expo.out" }, 0.62)
          .to(one("[data-swash]"), { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0.78)
          /* 2 · la fotografia, lenta */
          .to(one("[data-photo]"), { opacity: 1, scale: 1, duration: 2.1, ease: "power2.out" }, 0.75)
          .to(one("[data-veil]"), { opacity: 1, duration: 1.6, ease: "power2.out" }, 0.75)
          /* 3 · qui entra il menu in alto (SiteHeader, delay 1.35) */
          /* 4 · testo e pulsanti */
          .to(one("[data-lead]"), { opacity: 1, y: 0, duration: 0.9 }, 1.5)
          .to(q("[data-cta]"), { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.68)
          /* 5 · i dettagli */
          .to(one("[data-stamp]"), { opacity: 1, scale: 1, rotation: 0, duration: 1.3, ease: "expo.out" }, 1.6)
          .to(q("[data-note]"), { opacity: 1, y: 0, duration: 0.9, stagger: 0.14 }, 1.8)
          .to(q("[data-feature]"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 1.95)
          .to(one("[data-flag]"), { opacity: 1, x: 0, duration: 0.8 }, 2.15)
          .to(one("[data-cue]"), { opacity: 1, duration: 0.7 }, 2.3);

        const dot = one("[data-cue-dot]");
        if (dot) {
          gsap.fromTo(
            dot,
            { y: 0, opacity: 1 },
            { y: 11, opacity: 0, duration: 1.4, repeat: -1, repeatDelay: 0.3, ease: "power1.in", delay: 2.6 }
          );
        }
      });

      /* --- parallasse verso la sezione successiva --------------------------
         La fotografia resta indietro, la colonna di testo corre avanti e si
         spegne: il passaggio alla vetrina diventa un movimento solo invece di
         un taglio. Solo transform e opacity, un unico ScrollTrigger. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } })
          .to(one("[data-photo]"), { yPercent: 12, ease: "none" }, 0)
          .to(one("[data-copy]"), { yPercent: -26, opacity: 0.1, ease: "none" }, 0)
          .to(one("[data-stamp]"), { yPercent: -55, rotation: 14, ease: "none" }, 0)
          .to(q("[data-note]"), { yPercent: -34, opacity: 0.15, ease: "none" }, 0)
          .to(one("[data-cue]"), { opacity: 0, ease: "none" }, 0);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-white"
    >
      {/* ===== z-0 · fotografia ========================================== */}
      <img
        data-photo
        src="img/hero-bg.webp"
        srcSet="img/hero-bg-820.webp 820w, img/hero-bg-1280.webp 1280w, img/hero-bg.webp 1806w"
        sizes="100vw"
        alt=""
        width="1806"
        height="871"
        fetchpriority="high"
        decoding="async"
        className="absolute inset-0 z-0 h-full w-full object-cover object-[70%_62%] will-change-transform lg:object-[78%_center]"
      />

      {/* ===== z-10 · velo ===============================================
          Due sfumature diverse: verticale sul telefono, dove il testo sta sopra
          la foto; orizzontale da md in su, dove il testo le sta accanto. */}
      <div data-veil aria-hidden="true" className="absolute inset-0 z-10">
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(to bottom, #fff 0%, #fff 55%, rgba(255,255,255,0.82) 66%, rgba(255,255,255,0.3) 78%, rgba(255,255,255,0) 88%)",
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(100deg, #fff 0%, #fff 34%, rgba(255,255,255,0.9) 44%, rgba(255,255,255,0.45) 55%, rgba(255,255,255,0.08) 66%, rgba(255,255,255,0) 75%)",
          }}
        />
      </div>

      {/* ===== z-20 · ornamenti sulla foto ================================ */}
      <div
        data-stamp
        aria-hidden="true"
        className="pointer-events-none absolute top-[13%] left-[52%] z-20 hidden h-[clamp(110px,13vw,190px)] w-[clamp(110px,13vw,190px)] text-blu-700 opacity-95 drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)] lg:block"
      >
        <Stamp />
      </div>

      <p
        data-note
        aria-hidden="true"
        className="pointer-events-none absolute top-[19%] right-[clamp(20px,4vw,64px)] z-20 hidden text-right font-script text-[clamp(1.5rem,2.1vw,2.2rem)] leading-[1.15] text-blu-950 [text-shadow:0_1px_16px_rgba(255,255,255,0.95),0_1px_4px_rgba(255,255,255,0.9)] lg:block"
      >
        Più di
        <br />
        un panino,
        <br />
        una tradizione.
        <span className="mt-1 block text-blu-500">
          <Swash className="ml-auto h-2.5 w-[7.5rem]" />
        </span>
      </p>

      <p
        data-note
        aria-hidden="true"
        className="pointer-events-none absolute right-[clamp(20px,4vw,64px)] bottom-[16%] z-20 hidden text-right font-script text-[clamp(1.4rem,2vw,2.05rem)] leading-[1.15] text-blu-950 [text-shadow:0_1px_16px_rgba(255,255,255,0.95),0_1px_4px_rgba(255,255,255,0.9)] lg:block"
      >
        Napoli
        <br />
        nel cuore ♥
      </p>

      {/* ===== z-30 · colonna del marchio ================================= */}
      <div className="relative z-30 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-start px-[clamp(20px,5vw,72px)] pt-[clamp(118px,15vh,152px)] lg:justify-center lg:pt-[clamp(128px,17vh,170px)] pb-[clamp(86px,12vh,124px)] ">
        <div data-copy className="w-full lg:max-w-[48%]">
          <p className="flex items-center gap-3">
            <span data-eyebrow-line aria-hidden="true" className="block h-px w-7 bg-blu-500 sm:w-10" />
            <span
              data-eyebrow-text
              className="font-body text-[0.63rem] font-semibold tracking-[0.24em] text-blu-700 uppercase sm:text-[0.7rem]"
            >
              Viganello · Lugano
            </span>
            <span data-eyebrow-line aria-hidden="true" className="block h-px w-7 bg-blu-500 sm:w-10" />
          </p>

          <h1 id="hero-title" className="mt-[clamp(10px,1.8vh,22px)]">
            {/* maschera per riga: padding + margine negativo, cosi l'overflow
                non taglia i discendenti */}
            <span className="mb-[-0.1em] block overflow-hidden pb-[0.1em]">
              <span
                data-word
                className="block font-display font-extrabold text-blu-950 uppercase"
                style={{
                  fontSize: "clamp(4.2rem, min(10.4vw, 15vh), 11rem)",
                  lineHeight: 0.82,
                  letterSpacing: "-0.045em",
                  fontStretch: "100%",
                }}
              >
                Sfizi
              </span>
            </span>
            <span className="mb-[-0.1em] block overflow-hidden pb-[0.1em]">
              <span
                data-word
                className="block font-serif font-bold text-blu-600 uppercase"
                style={{
                  fontSize: "clamp(2.43rem, min(6.1vw, 8.8vh), 6.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.005em",
                }}
              >
                Partenopei
              </span>
            </span>
          </h1>

          <p className="relative mt-[clamp(2px,0.6vh,10px)] inline-block">
            <span data-script className="block font-script text-[clamp(1.9rem,3.4vw,3.1rem)] leading-[1.1] text-blu-950">
              Autentico gusto Napoletano
            </span>
            <span data-swash aria-hidden="true" className="mt-0.5 block text-blu-400">
              <Swash className="h-3 w-full" />
            </span>
          </p>

          <div
            data-lead
            className="mt-[clamp(14px,2.4vh,26px)] max-w-[52ch] text-[clamp(0.92rem,1.05vw,1.12rem)] leading-relaxed text-blu-800"
          >
            {LEAD.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-[clamp(18px,3vh,34px)] flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="i-nostri-prodotti.html"
              data-cta
              className="group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-blu-900 px-8 py-[1.05rem] font-body text-[0.78rem] font-semibold tracking-[0.1em] text-white uppercase shadow-[0_18px_40px_-22px_rgba(7,41,55,0.95)] transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-20px_rgba(13,169,220,0.85)] focus-visible:-translate-y-0.5"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-blu-600 transition-transform duration-500 ease-hero group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <span className="relative z-10 flex items-center gap-3">
                <ForkGlyph />
                Scopri il menu
                <span className="transition-transform duration-500 ease-hero group-hover:translate-x-1 group-focus-visible:translate-x-1">
                  <ArrowGlyph />
                </span>
              </span>
            </a>

            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              data-cta
              className="group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-blu-200 bg-white/70 px-8 py-[1.05rem] font-body text-[0.78rem] font-semibold tracking-[0.1em] text-blu-800 uppercase backdrop-blur-sm transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:border-blu-700 hover:text-white hover:shadow-[0_22px_48px_-20px_rgba(13,169,220,0.85)] focus-visible:-translate-y-0.5 focus-visible:border-blu-700 focus-visible:text-white"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-blu-700 transition-transform duration-500 ease-hero group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <span className="relative z-10 flex items-center gap-3">
                <PinGlyph />
                Vieni a trovarci
              </span>
            </a>
          </div>

          {/* Quattro promesse. Spariscono sotto i 720px di altezza: li lo
              spazio serve al marchio e ai pulsanti. */}
          <ul className="mt-[clamp(20px,3.4vh,38px)] hidden grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 sm:gap-x-3 lg:[@media(min-height:720px)]:grid">
            {FEATURES.map((f) => (
              <li key={f.k} data-feature className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blu-200 bg-white/70 text-blu-600 backdrop-blur-sm">
                  <FeatureGlyph k={f.k} />
                </span>
                <span className="font-body text-[0.72rem] leading-[1.3] text-blu-800">
                  {f.a}
                  <br />
                  <span className="text-blu-700">{f.b}</span>
                </span>
              </li>
            ))}
          </ul>

          <p data-flag className="mt-[clamp(16px,2.6vh,30px)] hidden items-center gap-3 lg:[@media(min-height:780px)]:flex">
            <FlagGlyph />
            <span className="font-body text-[0.63rem] font-semibold tracking-[0.24em] text-blu-700 uppercase">
              Napoli sempre con noi
            </span>
          </p>
        </div>
      </div>

      {/* ===== z-30 · indicatore di scroll ================================ */}
      <a
        data-cue
        href="#vetrina"
        onClick={scrollToVetrina}
        className="group absolute inset-x-0 bottom-[clamp(18px,3.4vh,38px)] z-30 mx-auto flex w-fit flex-col items-center gap-2 rounded-full border border-white/70 bg-white/70 px-5 py-3 text-blu-700 shadow-[0_14px_34px_-20px_rgba(7,41,55,0.6)] backdrop-blur-md transition-transform duration-300 ease-hero hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
      >
        <MouseGlyph />
        <span className="text-center font-body text-[0.56rem] font-semibold tracking-[0.22em] uppercase">
          Scrolla
          <br />
          per scoprire
        </span>
      </a>
    </section>
  );
}
