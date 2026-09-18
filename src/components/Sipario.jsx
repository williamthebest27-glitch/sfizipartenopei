import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marchio from "./Marchio.jsx";
import { prenotaSipario, apriIlSito } from "../lib/intro.js";

gsap.registerPlugin(ScrollTrigger);

/* ===========================================================================
   Sipario — il preloader della home
   ---------------------------------------------------------------------------
   Il marchio del cliente si scrive da solo su fondo blu, poi parte verso lo
   spettatore e si dissolve mentre dietro entra il sito.

   Come e costruito, e perche:

   1. IL MARCHIO E VETTORIALE (components/Marchio.jsx). Serve per due motivi:
      resta nitido anche ingrandito dieci volte, e si smonta nei suoi pezzi —
      la linea del Vesuvio, le lettere di SFIZI, il fritto, il puntino,
      PARTENOPEI — che entrano uno alla volta. Con un PNG non si potrebbe fare
      niente di tutto questo, e per giunta il preloader dipenderebbe da una
      richiesta di rete che puo arrivare tardi proprio mentre serve subito.

   2. DUE TIMELINE, NON UNA. `entrata` disegna il marchio, `uscita` lo fa
      esplodere verso lo schermo. In mezzo il sipario aspetta davvero che il
      sito sia pronto (font e window.load, con un tetto): e un preloader, non
      un'animazione a tempo. Due timeline separate perche una sola andrebbe
      messa in pausa a meta e ripresa, che e piu difficile da leggere e da
      ritoccare.

   3. IL SITO ENTRA MENTRE IL SIPARIO SI DISSOLVE. A meta della dissolvenza
      `apriIlSito()` sveglia le entrate di Hero e SiteHeader (vedi lib/intro.js):
      l'ultimo mezzo secondo di blu e il primo mezzo secondo della hero sono lo
      stesso momento, e il passaggio non e un taglio.

   4. SOLO transform E opacity, su un fondo a gradiente e un SVG piccolo. Il
      balzo finale ingrandisce il marchio di nove volte: `will-change` viene
      acceso un attimo prima, cosi Chrome rasterizza una volta sola e poi
      stira la texture invece di ridisegnare le curve a ogni fotogramma. Sopra
      le tre volte la sfocatura che ne nasce e voluta: sembra velocita.

   Chi ha gia visto l'intro in questa scheda (sessionStorage) trova la versione
   corta: marchio gia composto, solo il balzo finale.
   =========================================================================== */

/* Il fondo. Non piatto: la sfumatura dal blu del marchio al blu scuro da la
   profondita che rende credibile la spinta in avanti.
   ATTENZIONE: e ripetuto uguale dentro index.html, nel sipario dipinto prima
   che React monti. Se si cambia qui, si cambia anche li. */
const FONDO =
  "radial-gradient(118% 88% at 50% 42%, #23BDEC 0%, #0DA9DC 30%, #0A84AC 58%, #0B4A64 100%)";

/* Tutti i tempi in un posto solo: l'intro si ritocca da qui, senza rileggere
   la partitura. Secondi. */
const TEMPI = {
  linea: 0.9, // la linea del Vesuvio che si disegna
  lettera: 0.75, // durata della singola lettera di SFIZI
  passo: 0.08, // distanza fra una lettera e l'altra
  fritto: 0.9, // il glifo che cade dall'alto
  parola: 0.72, // le lettere di PARTENOPEI
  passoParola: 0.04,
  composto: 1.62, // istante in cui il marchio e leggibile e si puo uscire
  respiro: 0.32, // il contraccolpo prima del balzo
  balzo: 0.78, // il marchio addosso allo spettatore
  attesaMax: 4000, // ms: oltre questo non si aspettano piu gli asset
  attesaMin: 0.12, // s: pausa minima col marchio composto
};

const SCALA_BALZO = 7.4; // quanto cresce il marchio nel balzo finale
const CHIAVE = "sfizi:sipario-visto";

/* Chi ha gia visto l'intro in questa scheda la rivede corta: tre secondi a
   ogni ritorno sulla home diventano un pedaggio. Per rivederla intera basta
   una scheda nuova — oppure mettere qui true, che e il modo comodo di
   guardarla mentre la si ritocca. */
const SEMPRE_INTERA = false;

/* Il modulo si prenota appena viene caricato, prima che qualunque effetto
   React giri: da questo momento Hero e SiteHeader sanno di dover aspettare. */
prenotaSipario();

function vistoInQuestaSessione() {
  try {
    return sessionStorage.getItem(CHIAVE) === "1";
  } catch {
    return false; // navigazione privata, cookie bloccati: pazienza, intro piena
  }
}

function segnaVisto() {
  try {
    sessionStorage.setItem(CHIAVE, "1");
  } catch {
    /* niente */
  }
}

/* Il sipario aspetta quello che serve davvero alla prima schermata: i font
   (altrimenti il titolo della hero cambia faccia sotto gli occhi) e window.load
   (la fotografia della hero, che e in preload). Con un tetto: meglio un'entrata
   su una foto non ancora arrivata che uno schermo blu che non se ne va. */
function quandoIlSitoEPronto() {
  const pezzi = [];

  if (document.fonts?.ready) pezzi.push(document.fonts.ready);

  pezzi.push(
    document.readyState === "complete"
      ? Promise.resolve()
      : new Promise((ok) => window.addEventListener("load", ok, { once: true }))
  );

  return Promise.race([
    Promise.all(pezzi),
    new Promise((ok) => setTimeout(ok, TEMPI.attesaMax)),
  ]);
}

export default function Sipario() {
  const [vivo, setVivo] = useState(true);
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    /* Il sipario dipinto nell'HTML ha fatto il suo lavoro (niente lampo
       bianco prima che React monti): da qui in poi lo disegna React, con lo
       stesso fondo, quindi si toglie senza che si veda niente. */
    document.getElementById("sipario-iniziale")?.remove();

    const doc = document.documentElement;
    const ridotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const corta = !SEMPRE_INTERA && vistoInQuestaSessione();

    /* Scroll fermo finche c'e il sipario: senza, una rotellata durante l'intro
       lascerebbe la pagina a meta hero quando si alza il telo. Lo sblocco sta
       sia in chiusura sia nella pulizia dell'effetto: comunque vada, torna. */
    doc.dataset.sipario = "true";
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    let chiuso = false;
    const sblocca = () => {
      delete doc.dataset.sipario;
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    };

    const ctx = gsap.context(() => {
      const q = (sel) => Array.from(el.querySelectorAll(sel));
      const one = (sel) => el.querySelector(sel);

      const lockup = one("[data-lockup]");
      const claim = one("[data-claim]");
      const alone = one("[data-alone]");
      const anelli = q("[data-anello]");
      const monte = one('[data-parte="monte"]');
      const fritto = one('[data-parte="glifo"]');
      const puntino = one('[data-parte="puntino"]');
      const sfizi = q('[data-parte="sfizi"] [data-segno]');
      const partenopei = q('[data-parte="partenopei"] [data-segno]');

      /* Gli anelli sono centrati con xPercent/yPercent invece che con la
         translate di Tailwind: la scale che li fa esplodere passa da GSAP, e
         due transform sulla stessa proprieta non convivono. */
      gsap.set(anelli, { xPercent: -50, yPercent: -50, opacity: 0 });

      function chiudi() {
        if (chiuso) return;
        chiuso = true;
        apriIlSito(); // rete di sicurezza: se la timeline non ci e arrivata
        sblocca();
        segnaVisto();
        ScrollTrigger.refresh(); // lo scroll era bloccato: rimisura le sezioni
        setVivo(false);
      }

      /* --- versione ridotta ------------------------------------------------
         Con prefers-reduced-motion niente balzo e niente lettere: il marchio
         compare, si aspetta il sito, il telo si dissolve. Le dissolvenze non
         danno fastidio a nessuno, i movimenti grandi si. */
      if (ridotto) {
        gsap.set(lockup, { opacity: 0 });
        gsap.to(lockup, { opacity: 1, duration: 0.35, ease: "power2.out" });
        gsap.to(claim, { opacity: 1, duration: 0.35, delay: 0.1 });

        quandoIlSitoEPronto().then(() => {
          apriIlSito();
          gsap.to(el, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: chiudi,
          });
        });
        return;
      }

      /* --- stato di partenza ----------------------------------------------
         La linea del Vesuvio parte tagliata a destra e si scopre: e il gesto
         con cui il marchio e disegnato a mano, quindi e il gesto con cui si
         presenta. Il ritaglio negativo sugli altri lati evita che il bordo
         antialiasato venga mangiato. */
      gsap.set(monte, { clipPath: "inset(-4% 100% -4% -4%)" });
      gsap.set(sfizi, {
        opacity: 0,
        scale: 0.42,
        y: 24,
        rotation: -10,
        transformOrigin: "50% 50%",
      });
      gsap.set(fritto, {
        opacity: 0,
        scale: 0.55,
        y: -70,
        rotation: 16,
        transformOrigin: "50% 65%",
      });
      gsap.set(puntino, { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
      gsap.set(partenopei, {
        opacity: 0,
        y: 62,
        scale: 0.86,
        transformOrigin: "50% 100%",
      });
      gsap.set(claim, { opacity: 0 });
      gsap.set(alone, { opacity: 0 });

      /* --- entrata: il marchio si scrive -----------------------------------
         La linea corre da sinistra a destra e le lettere di SFIZI cadono via
         via che le passa sotto; il fritto arriva dall'alto quando la linea e
         a tre quarti; il puntino scatta nell'istante in cui la linea lo
         raggiunge, come il punto finale di una firma. PARTENOPEI risponde dal
         basso solo dopo, perche due parole che entrano insieme si leggono come
         confusione. */
      const entrata = gsap.timeline({ paused: true });

      entrata
        .to(alone, { opacity: 1, duration: 1.1, ease: "power2.out" }, 0)
        /* Spinta lenta e continua per tutta l'entrata: impercettibile da sola,
           ma fa si che il balzo finale non parta da fermo — la macchina si sta
           gia avvicinando, e alla fine accelera. */
        .fromTo(lockup, { scale: 0.955 }, { scale: 1.035, duration: 2.1, ease: "none" }, 0)
        .to(monte, { clipPath: "inset(-4% -4% -4% -4%)", duration: TEMPI.linea, ease: "power2.inOut" }, 0)
        .to(
          sfizi,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotation: 0,
            duration: TEMPI.lettera,
            stagger: TEMPI.passo,
            ease: "back.out(1.7)",
          },
          0.08
        )
        .to(
          fritto,
          { opacity: 1, scale: 1, y: 0, rotation: 0, duration: TEMPI.fritto, ease: "back.out(1.5)" },
          0.55
        )
        .to(puntino, { opacity: 1, scale: 1, duration: 0.62, ease: "back.out(3)" }, 0.84)
        .to(
          partenopei,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: TEMPI.parola,
            stagger: TEMPI.passoParola,
            ease: "expo.out",
          },
          0.95
        )
        .to(claim, { opacity: 1, duration: 0.6, ease: "power2.out" }, 1.18)
        /* Il marchio a questo punto e tutto leggibile: le code delle
           dissolvenze finiscono da sole mentre il sipario si prepara a uscire.
           Aspettare la fine vera della timeline lasciava un secondo di
           immagine ferma, e un secondo fermo in un preloader e lunghissimo. */
        .add(() => {
          entrataFinita = true;
          forseUscita();
        }, TEMPI.composto);

      /* Mentre si aspettano gli asset il marchio respira: uno schermo fermo
         sembra un sito bloccato. Parte solo se l'attesa continua. */
      const respiro = gsap.to(lockup, {
        scale: 1.022,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });

      /* --- uscita: il balzo verso lo spettatore ----------------------------
         Prima il marchio si ritrae (0,9): il balzo che segue sembra il doppio.
         Poi cresce di oltre sette volte accelerando — `power3.in`, cioe lento
         all'inizio e via — e si spegne mentre il telo stesso viene addosso e
         si dissolve. Due anelli partono nell'istante dello scatto: sono il
         colpo. */
      const uscita = gsap.timeline({ paused: true, onComplete: chiudi });

      uscita
        .set([el, lockup], { willChange: "transform, opacity" })
        .to(lockup, { scale: 0.9, duration: TEMPI.respiro, ease: "power2.inOut" }, 0)
        .to(claim, { opacity: 0, duration: 0.28, ease: "power2.in" }, 0)
        .to(lockup, { scale: SCALA_BALZO, duration: TEMPI.balzo, ease: "power3.in" }, TEMPI.respiro)
        .to(lockup, { opacity: 0, duration: 0.46, ease: "power2.in" }, TEMPI.respiro + 0.3)
        .fromTo(
          anelli,
          { scale: 0.5, opacity: 0.5 },
          { scale: 3.1, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
          TEMPI.respiro
        )
        .to(el, { scale: 1.2, duration: TEMPI.balzo, ease: "power2.in" }, TEMPI.respiro + 0.06)
        /* da qui il sito e in scena: la hero comincia a comporsi dietro al blu
           che se ne va, e i due movimenti si sovrappongono */
        .add(apriIlSito, TEMPI.respiro + 0.26)
        .set(el, { pointerEvents: "none" }, TEMPI.respiro + 0.26)
        .to(el, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, TEMPI.respiro + 0.3);

      /* --- regia ----------------------------------------------------------- */
      let entrataFinita = false;
      let sitoPronto = false;
      let partita = false;

      function forseUscita() {
        if (partita || !entrataFinita || !sitoPronto) return;
        partita = true;
        respiro.pause(); // l'uscita riparte da dove sta, senza scatti
        uscita.play();
      }

      if (corta) {
        /* gia vista in questa scheda: marchio gia composto, solo il balzo */
        entrata.progress(1).pause();
        entrataFinita = true;
      } else {
        entrata.play();
      }

      quandoIlSitoEPronto().then(() => {
        gsap.delayedCall(TEMPI.attesaMin, () => {
          sitoPronto = true;
          forseUscita();
        });
      });

      /* Se l'attesa si allunga oltre l'entrata, il marchio respira. */
      gsap.delayedCall(entrata.duration() + 0.2, () => {
        if (!partita && entrataFinita) respiro.play();
      });

      /* --- si puo saltare --------------------------------------------------
         Un clic, un tasto o una rotellata dicono "ho capito, fammi entrare":
         l'entrata accelera invece di essere tagliata di netto, cosi il marchio
         resta leggibile, e non si aspettano piu gli asset. */
      function salta() {
        if (partita) return;
        sitoPronto = true;
        respiro.pause();
        if (entrataFinita) forseUscita();
        else entrata.timeScale(3.4);
      }

      const eventi = ["pointerdown", "keydown", "wheel", "touchstart"];
      eventi.forEach((tipo) =>
        window.addEventListener(tipo, salta, { passive: true, once: true })
      );

      return () => eventi.forEach((tipo) => window.removeEventListener(tipo, salta));
    }, root);

    return () => {
      /* In sviluppo React monta, smonta e rimonta: senza questa riga la regia
         del montaggio buttato via potrebbe ancora chiamare chiudi() e far
         sparire il sipario appena rimontato. */
      chiuso = true;
      ctx.revert();
      sblocca();
    };
  }, []);

  if (!vivo) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
      style={{ background: FONDO }}
    >
      {/* alone: solo un gradiente su un elemento fermo, nessuna transform, e il
          fondo smette di sembrare una campitura piatta */}
      <span
        data-alone
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 42% at 50% 46%, rgba(255,255,255,0.34), rgba(255,255,255,0.12) 45%, rgba(255,255,255,0) 74%)",
        }}
      />

      {/* i due anelli dello scatto */}
      <span
        data-anello
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(62vmin,540px)] rounded-full border border-white/55"
      />
      <span
        data-anello
        className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(62vmin,540px)] rounded-full border border-white/35"
      />

      <div data-lockup className="relative">
        <Marchio className="block w-[min(56vh,74vw,560px)] text-white" />

        <p
          data-claim
          className="absolute top-full left-1/2 mt-[clamp(18px,3vh,36px)] w-max max-w-[88vw] -translate-x-1/2 text-center font-body text-[clamp(0.62rem,0.95vw,0.8rem)] font-semibold tracking-[0.2em] text-white/90 uppercase"
        >
          Portiamo sulla tua tavola il cibo e la tradizione Partenopea
        </p>
      </div>
    </div>
  );
}
