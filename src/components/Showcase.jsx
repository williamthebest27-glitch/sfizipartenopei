import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fitWidth } from "../lib/type.js";

gsap.registerPlugin(ScrollTrigger);

/* Su mobile la barra degli indirizzi che entra e esce cambia la viewport e fa
   ricalcolare tutto a ScrollTrigger: e la causa classica dello scatto a meta
   scroll, e con un pin si vede il doppio. Con questo flag l'altezza viene
   congelata al primo load. */
ScrollTrigger.config({ ignoreMobileResize: true });

/* ===========================================================================
   Showcase — la vetrina
   ---------------------------------------------------------------------------
   Arriva dopo la hero di apertura: la sezione si blocca e lo scroll diventa un
   carosello. A ogni passo cambiano insieme la parola gigante sullo sfondo, il
   prodotto e la sua scheda.

   Due movimenti su assi diversi, di proposito:
     - lo SFONDO (parola + macchie) scorre in ORIZZONTALE per tutta la
       larghezza: e da li che arriva il senso di scorrimento;
     - i PRODOTTI si danno il cambio in VERTICALE: quello in scena scende e
       rimpicciolisce fino a sparire, il successivo compare dall'alto piccolo e
       cresce fino al centro. Nessun prodotto attraversa mai la colonna di
       testo, quindi il blocco di sinistra resta leggibile in ogni fotogramma.

   Palette: fondo bianco, blu del marchio. Il blu pieno #0DA9DC (2,7:1 su
   bianco) non porta mai testo: le parole giganti usano blu-600/700/800, tutte
   sopra il 4:1. Ramp completa in index.css.
   =========================================================================== */

const TEL = "+41784065676";
const TEL_LABEL = "078 406 56 76";

/* Le tre scene usano le stesse fotografie della pagina prodotti, non copie
   diverse dello stesso piatto: sono i file scontornati in public/img/prodotti.
   Le misure w/h sono quelle vere del file, servono a riservare lo spazio. */
const SCENES = [
  {
    id: "sfizi",
    word: "Sfizi",
    /* Cinque lettere: con la campata piena verrebbe alta 380px e il prodotto
       le mangerebbe l'ultima. La campata piu stretta la riporta al peso di
       PANINI, che di lettere ne ha sei. */
    span: 56,
    name: "Calzoncino fritto",
    price: "5.00",
    kicker: "Sfizi Partenopei",
    img: "img/prodotti/calzoncino-fritto.webp",
    imgSm: "img/prodotti/calzoncino-fritto-sm.webp",
    w: 895,
    h: 575,
    ink: "text-blu-600",
    rest: -8,
  },
  {
    id: "panini",
    word: "Panini",
    /* Sotto la parola PANINI ci va un panino del listino, non il Giovannino,
       che sta fra gli sfizi: la parola fa da etichetta alla scena, e se il
       prodotto e di un'altra categoria l'etichetta mente. */
    name: "Salsiccia e provola",
    price: "9.00",
    kicker: "Paninoteca",
    img: "img/prodotti/salsiccia-provola.webp",
    imgSm: "img/prodotti/salsiccia-provola-sm.webp",
    w: 1200,
    h: 767,
    ink: "text-blu-800",
    rest: 6,
  },
  {
    id: "menu",
    /* Una frase, non una parola: due righe composte allo stesso corpo. */
    word: ["Menù e piatti", "del giorno"],
    name: "Menù completo",
    price: "15.00",
    kicker: "Paninoteca",
    img: "img/prodotti/menu-cotoletta.webp",
    imgSm: "img/prodotti/menu-cotoletta-sm.webp",
    w: 1200,
    h: 649,
    ink: "text-blu-700",
    rest: -5,
  },
];

const N = SCENES.length;
const WORD_SPAN = 66;

const FACTS = [
  { k: "Consegna", v: "entro 8 km", always: true },
  { k: "Finestre", v: "11:30–13:30 · 18:30–21:00", always: true },
  { k: "Apertura", v: "Lun–Sab 11:30–20:30" },
  { k: "Banco", v: "P.le G. Quadri 1, Viganello" },
];

/* Macchie organiche: border-radius a otto valori invece di un SVG. Pesano
   niente e si scalano da sole. Il riempimento e sfumato, cosi il bordo non
   taglia e non serve un filter: blur, che costerebbe una ri-rasterizzazione a
   ogni spostamento del nastro. */
const BLOB_A = "58% 42% 71% 29% / 38% 63% 37% 62%";
const BLOB_B = "31% 69% 42% 58% / 64% 33% 67% 36%";
const BLOB_INK_A =
  "radial-gradient(closest-side, rgba(13,169,220,0.30), rgba(13,169,220,0.24) 42%, rgba(13,169,220,0.10) 74%, rgba(13,169,220,0) 100%)";
const BLOB_INK_B =
  "radial-gradient(closest-side, rgba(10,132,172,0.20), rgba(10,132,172,0.14) 46%, rgba(10,132,172,0.05) 76%, rgba(10,132,172,0) 100%)";

function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M5.2 3.8h3.1l1.5 3.8-1.9 1.4a11.4 11.4 0 0 0 5.1 5.1l1.4-1.9 3.8 1.5v3.1a1.6 1.6 0 0 1-1.8 1.6A15.4 15.4 0 0 1 3.6 5.6a1.6 1.6 0 0 1 1.6-1.8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------------ */

export default function Showcase() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = (sel) => Array.from(el.querySelectorAll(sel));
      const one = (sel) => el.querySelector(sel);

      const scenes = q("[data-scene]");
      const prods = q("[data-product]");
      const tags = q("[data-tag]");
      const dots = q("[data-dot]");
      const mm = gsap.matchMedia();

      /* --- 1. Entrata in scena ---------------------------------------------
         A differenza della hero questa sezione nasce sotto la piega: l'entrata
         parte quando arriva in vista, non al caricamento, e si esegue una volta
         sola. Sotto prefers-reduced-motion non gira nulla e resta tutto
         visibile. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q("[data-blob]"), { opacity: 0, scale: 0.8 });
        gsap.set(one("[data-glow]"), { opacity: 0, scale: 0.86 });
        gsap.set(one("[data-word]"), { yPercent: 108, opacity: 0 });
        gsap.set(one("[data-eyebrow-line]"), { scaleX: 0, transformOrigin: "left center" });
        gsap.set(one("[data-eyebrow-text]"), { opacity: 0, x: -12 });
        gsap.set(one("[data-p-in]"), { opacity: 0, yPercent: 12 });
        gsap.set(one("[data-title]"), { opacity: 0, y: 22 });
        gsap.set(one("[data-sub]"), { opacity: 0, y: 16 });
        gsap.set(q("[data-cta]"), { opacity: 0, y: 20 });
        gsap.set(one("[data-rail-line]"), { scaleX: 0, transformOrigin: "left center" });
        gsap.set(q("[data-fact]"), { opacity: 0, y: 14 });
        gsap.set(one("[data-steps]"), { opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        });

        tl.to(one("[data-glow]"), { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }, 0)
          .to(q("[data-blob]"), { opacity: 1, scale: 1, duration: 1.5, stagger: 0.12, ease: "expo.out" }, 0.04)
          .to(one("[data-word]"), { yPercent: 0, opacity: 1, duration: 1.25, ease: "expo.out" }, 0.12)
          .to(one("[data-p-in]"), { opacity: 1, yPercent: 0, duration: 1.35, ease: "expo.out" }, 0.26)
          .to(one("[data-eyebrow-line]"), { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0.34)
          .to(one("[data-eyebrow-text]"), { opacity: 1, x: 0, duration: 0.6 }, 0.42)
          .to(one("[data-title]"), { opacity: 1, y: 0, duration: 0.9 }, 0.5)
          .to(one("[data-rail-line]"), { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0.6)
          .to(one("[data-sub]"), { opacity: 1, y: 0, duration: 0.85 }, 0.66)
          .to(q("[data-cta]"), { opacity: 1, y: 0, duration: 0.85, stagger: 0.09 }, 0.74)
          .to(q("[data-fact]"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0.84)
          .to(one("[data-steps]"), { opacity: 1, duration: 0.6 }, 0.95);

        /* Respiro del prodotto a riposo. Agisce su y del wrapper, mentre il
           carosello usa yPercent/scale/rotation sull'immagine: proprieta
           diverse su elementi diversi, non si pestano mai. */
        gsap.to(one("[data-p-in]"), {
          y: -12,
          duration: 3.8,
          delay: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      /* --- 2. Il carosello -------------------------------------------------
         NON una timeline di tween, ma un valore solo che lo scroll trascina e
         da cui ogni stato viene ricalcolato.

         Il motivo e un difetto visto dal cliente e poi riprodotto: con una
         timeline di tween corti e `scrub`, una rotellata veloce fa saltare il
         playhead oltre un tween in un solo aggiornamento, e quel tween non
         viene mai renderizzato. Risultato misurato sul sito live: opacita
         delle scene [1, 0, 1] - la prima parola gigante non spariva piu e
         restava stampata sopra la terza, e lo stesso capitava alle schede dei
         prezzi.

         Con un tween solo che porta `t` da 0 a N-1 il problema non puo
         esistere: quel tween copre tutto l'intervallo, quindi viene sempre
         renderizzato, e apply() deriva ogni opacita e ogni trasformazione da t
         con una funzione pura. A qualunque posizione di scroll, in avanti,
         indietro o saltando, lo stato e sempre coerente. */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const REST = SCENES.map((sc) => sc.rest);
        const OUT = 78; // quanto scende il prodotto che esce, in % della sua altezza
        const IN = -78; // e da quanto in alto arriva il successivo

        const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
        const norm = (v, a, b) => clamp01((v - a) / (b - a));
        const easeIn = gsap.parseEase("power2.in");
        const easeOut = gsap.parseEase("power3.out");

        const progress = one("[data-progress]");

        const apply = (t) => {
          const seg = Math.min(N - 2, Math.max(0, Math.floor(t)));
          const f = clamp01(t - seg);

          /* La parola gigante NON si incrocia con la successiva: due parole
             diverse sfumate nello stesso punto si leggono come testo
             sovrapposto, ed e esattamente il difetto segnalato. Quella in
             scena sparisce del tutto, poi entra l'altra. Le macchie restano
             ferme, quindi il fondo non resta mai vuoto. */
          const wordOut = norm(f, 0, 0.3);
          const wordIn = norm(f, 0.42, 0.78);
          scenes.forEach((sc, i) =>
            gsap.set(sc, { opacity: i === seg ? 1 - wordOut : i === seg + 1 ? wordIn : 0 })
          );

          /* schede: l'uscita finisce prima che l'entrata cominci, cosi i due
             nomi non si sovrappongono mai */
          const tagOut = norm(f, 0, 0.32);
          const tagIn = norm(f, 0.55, 1);
          tags.forEach((tg, i) => {
            if (i === seg) gsap.set(tg, { opacity: 1 - tagOut, y: -10 * tagOut });
            else if (i === seg + 1) gsap.set(tg, { opacity: tagIn, y: 12 * (1 - tagIn) });
            else gsap.set(tg, { opacity: 0 });
          });

          /* prodotti: quello in scena scende rimpicciolendo, il successivo
             arriva dall'alto piccolo e cresce fino al centro */
          const via = easeIn(norm(f, 0, 0.55));
          const arriva = easeOut(norm(f, 0.4, 1));
          prods.forEach((pr, i) => {
            if (i === seg) {
              gsap.set(pr, {
                yPercent: OUT * via,
                scale: 1 - 0.58 * via,
                rotation: REST[i] - 12 * via,
                opacity: 1 - via,
              });
            } else if (i === seg + 1) {
              gsap.set(pr, {
                yPercent: IN * (1 - arriva),
                scale: 0.42 + 0.58 * arriva,
                rotation: REST[i] + 12 * (1 - arriva),
                opacity: arriva,
              });
            } else {
              const sopra = i > seg + 1; // deve ancora arrivare
              gsap.set(pr, {
                yPercent: sopra ? IN : OUT,
                scale: 0.42,
                rotation: REST[i] + (sopra ? 12 : -12),
                opacity: 0,
              });
            }
          });

          if (progress) gsap.set(progress, { scaleX: t / (N - 1) });

          const idx = Math.min(N - 1, Math.round(t));
          dots.forEach((d, k) => (d.dataset.active = k === idx ? "true" : "false"));
        };

        apply(0);

        const guida = { t: 0 };
        gsap.to(guida, {
          t: N - 1,
          ease: "none",
          onUpdate: () => apply(guida.t),
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });
      });

      /* --- 3. Inclinazione col puntatore -----------------------------------
         Solo mouse vero. Nessuna lettura di layout nel handler: le coordinate
         sono normalizzate sulla finestra, quindi zero reflow per evento. Agisce
         sul contenitore del prodotto, non sull'immagine, per non toccare il
         movimento del carosello. */
      mm.add(
        "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const holder = one("[data-p-tilt]");
          const glow = one("[data-glow]");
          if (!holder) return;

          const px = gsap.quickTo(holder, "x", { duration: 1.1, ease: "power3" });
          const py = gsap.quickTo(holder, "y", { duration: 1.2, ease: "power3" });
          const gx = gsap.quickTo(glow, "x", { duration: 1.6, ease: "power3" });

          const onMove = (e) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            px(nx * 26);
            py(ny * 16);
            gx(nx * -34);
          };

          el.addEventListener("pointermove", onMove);
          return () => {
            el.removeEventListener("pointermove", onMove);
            px(0);
            py(0);
            gx(0);
          };
        }
      );

      /* Le immagini hanno width/height espliciti, quindi non spostano il
         layout; i font variabili invece si, e ScrollTrigger ha gia misurato. */
      if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="vetrina"
      data-vetrina
      aria-labelledby="vetrina-title"
      className="relative bg-white"
      style={{ height: `${N * 100}svh` }}
    >
      {/* Il pannello si incolla con position: sticky invece di essere bloccato
          da ScrollTrigger. Il blocco via transform ricompensa lo scroll con una
          traslazione calcolata sul main thread: misurato, il pannello derivava
          verso l'alto di una trentina di pixel mentre si scorreva, ed e il "su e
          giu" segnalato dal cliente. Lo sticky lo gestisce il compositore del
          browser, quindi non deriva di un pixel e non produce layout shift.
          ScrollTrigger qui si limita a leggere il progresso. */}
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-white">
        {/* ===== z-0 · fondale che scorre ===================================
            Un solo nastro largo N schermate. Ogni scena porta le sue macchie e
            la sua parola gigante. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {/* Le macchie sono identiche in tutte e tre le scene: disegnate una
              volta sola, fuori dal cambio. Se facessero parte della dissolvenza
              sparirebbero e ricomparirebbero a ogni passaggio, che e movimento
              che il cliente non vuole. */}
          <span
            data-blob
            className="absolute top-[38%] -left-[16%] aspect-[1.3/1] w-[92vw] max-w-[560px] rotate-[-8deg] lg:top-[24%] lg:-left-[12%] lg:w-[52vw] lg:max-w-[800px]"
            style={{ borderRadius: BLOB_A, background: BLOB_INK_A }}
          />
          <span
            data-blob
            className="absolute -right-[14%] top-[18%] aspect-[1.15/1] w-[78vw] max-w-[440px] rotate-[12deg] lg:-right-[8%] lg:top-[20%] lg:w-[46vw] lg:max-w-[700px]"
            style={{ borderRadius: BLOB_B, background: BLOB_INK_B }}
          />

          {/* Una parola per scena, tutte nello stesso posto. Non si
              sovrappongono mai: si danno il cambio una alla volta. */}
          {SCENES.map((sc, i) => {
            /* Una parola sola o una frase su piu righe. Il corpo si ricava
               dalla riga PIU LUNGA e vale per tutte: dando a ogni riga la sua
               larghezza piena, come si fa con le parole singole, "MENU"
               verrebbe alto il triplo di "DEL GIORNO". */
            const righe = Array.isArray(sc.word) ? sc.word : [sc.word];
            const lunga = righe.reduce((a, b) => (b.length > a.length ? b : a));

            return (
              <div
                key={sc.id}
                data-scene
                {...(i > 0 ? { "data-alt": "" } : {})}
                className="absolute inset-x-0 top-[17%] text-center md:top-[16%] lg:top-[15%]"
              >
                <span
                  data-word
                  className={`inline-block font-display font-extrabold uppercase ${sc.ink}`}
                  style={{
                    fontSize: fitWidth(lunga, sc.span ?? WORD_SPAN),
                    lineHeight: 0.82,
                    letterSpacing: "-0.045em",
                    fontStretch: "100%",
                  }}
                >
                  {righe.map((riga) => (
                    <span key={riga} data-riga className="block">
                      {riga}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>

        {/* alone fisso: da profondita e non scorre col nastro */}
        <div
          data-glow
          aria-hidden="true"
          className="pointer-events-none absolute top-[8%] -right-[26%] z-0 aspect-square w-[124vw] max-w-[760px] lg:top-[4%] lg:-right-[6%] lg:w-[62vw] lg:max-w-[1020px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(13,169,220,0.18), rgba(13,169,220,0.10) 38%, rgba(13,169,220,0.035) 64%, rgba(13,169,220,0) 100%)",
          }}
        />

        {/* ===== z-10 · i prodotti =========================================
            Impilati nello stesso punto: si danno il cambio in verticale. Il
            contenitore porta il translate CSS, l'immagine resta libera per
            GSAP. La larghezza e legata anche a svh: su un telefono basso, un
            prodotto dimensionato solo sulla larghezza finirebbe addosso al
            testo. */}
        <div
          data-p-tilt
          aria-hidden="true"
          className="pointer-events-none absolute top-[38%] left-1/2 z-10 w-[min(86vw,30svh)] max-w-[540px] -translate-x-1/2 -translate-y-1/2 md:top-[42%] md:w-[70vw] md:max-w-[480px] lg:top-[53%] lg:left-auto lg:right-[3.5%] lg:w-[43vw] lg:max-w-[650px] lg:translate-x-0"
        >
          <div data-p-in className="relative">
            {SCENES.map((s, i) => (
              <img
                key={s.id}
                data-product
                {...(i > 0 ? { "data-alt": "" } : {})}
                src={s.img}
                srcSet={`${s.imgSm} 680w, ${s.img} 1200w`}
                sizes="(min-width: 1024px) 43vw, (min-width: 768px) 70vw, 90vw"
                alt=""
                loading="eager"
                decoding="async"
                width={s.w}
                height={s.h}
                className={`${
                  i === 0 ? "block" : "absolute inset-0 block"
                } h-auto w-full drop-shadow-[0_22px_26px_rgba(7,41,55,0.15)]`}
              />
            ))}
          </div>
        </div>

        {/* ===== z-20 · interfaccia ========================================
            pt lascia spazio alla barra fissa, che su mobile e alta due righe. */}
        <div className="relative z-20 mx-auto flex h-full w-full max-w-[1440px] flex-col px-[clamp(20px,5vw,72px)] pt-[clamp(108px,15vh,150px)] lg:pt-[clamp(88px,11vh,124px)]">
          <div className="relative flex flex-1 flex-col justify-end pb-[clamp(8px,2.2vh,26px)]">
            <div className="lg:max-w-[50%]">
              <p className="flex items-center gap-3">
                <span data-eyebrow-line aria-hidden="true" className="block h-px w-8 bg-blu-500 sm:w-12" />
                <span
                  data-eyebrow-text
                  className="font-body text-[0.66rem] font-semibold tracking-[0.18em] text-blu-700 uppercase sm:text-[0.72rem]"
                >
                  Paninoteca &amp; sfizi fritti
                </span>
              </p>

              <h2
                id="vetrina-title"
                data-title
                className="mt-[clamp(8px,1.6vh,18px)] font-display font-extrabold text-blu-950"
                style={{
                  fontSize: "clamp(1.75rem, min(3.6vw, 4.4vh), 3.2rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  fontStretch: "88%",
                }}
              >
                Tre assaggi dal banco.
              </h2>

              <p
                data-sub
                className="mt-[clamp(8px,1.6vh,18px)] max-w-[46ch] text-[clamp(0.86rem,0.95vw,1.06rem)] leading-relaxed text-blu-800"
              >
                <span className="sm:hidden">
                  Fritto napoletano fatto al momento, consegnato entro 8 km.
                </span>
                <span className="hidden sm:inline">
                  Fritto napoletano fatto al momento al banco di Viganello — consegnato caldo entro
                  otto chilometri.
                </span>
              </p>

              <div className="mt-[clamp(12px,2.4vh,28px)] flex flex-row flex-wrap items-center gap-x-4 gap-y-2 sm:gap-5">
                <a
                  href={`tel:${TEL}`}
                  data-cta
                  className="group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-blu-950 px-6 py-[0.9rem] font-body text-[0.74rem] font-semibold tracking-[0.1em] text-white uppercase transition-transform duration-300 ease-hero hover:-translate-y-0.5 focus-visible:-translate-y-0.5 sm:px-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-blu-600 transition-transform duration-500 ease-hero group-hover:scale-y-100 group-focus-visible:scale-y-100"
                  />
                  <span className="relative z-10 flex items-center gap-3 tabular-nums">
                    <PhoneGlyph />
                    Ordina · {TEL_LABEL}
                  </span>
                </a>

                <a
                  href="i-nostri-prodotti.html"
                  data-cta
                  className="group relative inline-flex items-center gap-2.5 rounded-full px-2 py-[0.9rem] font-body text-[0.74rem] font-semibold tracking-[0.1em] text-blu-700 uppercase"
                >
                  Guarda il menù
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-500 ease-hero group-hover:translate-x-1 group-focus-visible:translate-x-1"
                  >
                    →
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute right-2 bottom-[0.68rem] left-2 h-px origin-left scale-x-0 bg-blu-500 transition-transform duration-500 ease-hero group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              </div>
            </div>

            {/* scheda del prodotto in scena: cambia col carosello */}
            <div className="relative mt-[clamp(12px,2.4vh,26px)] h-[clamp(46px,8.4vh,86px)] lg:h-[clamp(70px,10vh,104px)] lg:absolute lg:right-0 lg:bottom-[clamp(8px,2.2vh,26px)] lg:mt-0 lg:w-[clamp(300px,30vw,420px)]">
              {SCENES.map((s, i) => (
                <div
                  key={s.id}
                  data-tag
                  {...(i > 0 ? { "data-alt": "" } : {})}
                  className="absolute inset-0 flex flex-col items-start gap-1 lg:items-end lg:text-right"
                >
                  <span className="hidden font-body text-[0.64rem] font-semibold tracking-[0.16em] text-blu-700 uppercase sm:block">
                    {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")} · {s.kicker}
                  </span>
                  <span
                    className="font-display text-[clamp(1rem,1.25vw,1.35rem)] font-extrabold text-blu-950"
                    style={{ fontStretch: "88%", lineHeight: 1.1 }}
                  >
                    {s.name}
                  </span>
                  <span className="font-body text-[0.95rem] font-semibold text-blu-600 tabular-nums">
                    <span className="sm:hidden">
                      {String(i + 1).padStart(2, "0")}/{String(N).padStart(2, "0")} ·{" "}
                    </span>
                    CHF {s.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* --- rail dei dati + passi del carosello --- */}
          <div className="relative pt-[clamp(10px,1.8vh,20px)] pb-[clamp(10px,2vh,24px)]">
            <span
              data-rail-line
              aria-hidden="true"
              className="absolute top-0 right-0 left-0 block h-px origin-left bg-blu-100"
            />
            {/* avanzamento del carosello, sopra la riga */}
            <span
              data-progress
              aria-hidden="true"
              className="absolute top-0 left-0 block h-px w-full origin-left scale-x-0 bg-blu-500"
            />

            <div className="flex items-end justify-between gap-6">
              <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-4">
                {FACTS.map((f) => (
                  <li key={f.k} data-fact className={`flex flex-col gap-1 ${f.always ? "" : "hidden md:flex"}`}>
                    <span className="flex items-center gap-2 font-body text-[0.64rem] font-semibold tracking-[0.16em] text-blu-700 uppercase">
                      <span aria-hidden="true" className="h-[3px] w-[3px] shrink-0 bg-blu-500" />
                      {f.k}
                    </span>
                    <span className="font-body text-[0.92rem] font-semibold tracking-[-0.005em] text-blu-950 tabular-nums sm:text-[1.02rem]">
                      {f.v}
                    </span>
                  </li>
                ))}
              </ul>

              <div data-steps className="flex shrink-0 items-center gap-2" aria-hidden="true">
                {SCENES.map((s, i) => (
                  <span
                    key={s.id}
                    data-dot
                    data-active={i === 0 ? "true" : "false"}
                    className="block h-[3px] w-3 rounded-full bg-blu-200 transition-all duration-500 ease-hero data-[active=true]:w-8 data-[active=true]:bg-blu-500"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elenco reale dei prodotti in vetrina: il carosello sopra e decorativo
          (aria-hidden), questo e cio che leggono gli screen reader. */}
      <ul className="sr-only">
        {SCENES.map((s) => (
          <li key={s.id}>
            {s.name} — CHF {s.price}
          </li>
        ))}
      </ul>
    </section>
  );
}
