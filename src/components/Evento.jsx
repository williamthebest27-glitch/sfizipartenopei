import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { avviaEvento, chiudiEvento, iscriviti, leggiEvento } from "../lib/evento.js";
import { ArrowGlyph, CloseGlyph, PhoneGlyph } from "./glyphs.jsx";

/* ===========================================================================
   Evento — la locandina in evidenza, a tutto schermo sulla home
   ---------------------------------------------------------------------------
   Il cliente la carica da /gestione (eventi, offerte, chiusure). Prima si
   apre la home con la sua entrata, poi la locandina sale sopra il sito gia
   composto (la regia e i tempi stanno in lib/evento.js).

   Composizione: la locandina intera, mai ritagliata — e piena di scritte —
   alta quanto lo schermo concede, su un fondo che e la locandina stessa
   rimpicciolita a 24 px e sfocata: i colori dell'evento a tutta pagina senza
   un secondo file da scaricare. Sotto, «Chiama e ordina» (se il cliente lo
   vuole) e «Vai al sito». Si chiude anche con la X, con Esc e cliccando il
   fondo.

   Lo spazio per la locandina lo calcola il CSS (index.css,
   [data-evento-dialogo]): larghezza = min(colonna, altezza libera x rapporto),
   cosi verticale, orizzontale o quadrata entra sempre intera.
   =========================================================================== */

const TEL = "+41784065676";

avviaEvento();

export default function Evento() {
  const { stato, banner } = useSyncExternalStore(iscriviti, leggiEvento, leggiEvento);
  const [finito, setFinito] = useState(false);
  if (finito || !banner || (stato !== "aperto" && stato !== "chiuso")) return null;
  return <Locandina banner={banner} onFine={() => setFinito(true)} />;
}

function Locandina({ banner, onFine }) {
  const root = useRef(null);
  const chiudiRef = useRef(() => {});
  /* onFine cambia a ogni render del genitore (che si ridisegna proprio quando
     lo stato passa a "chiuso"): tenuto in un ref, l'effetto gira una volta
     sola e l'entrata non riparte a meta uscita */
  const fineRef = useRef(onFine);
  fineRef.current = onFine;

  useLayoutEffect(() => {
    const el = root.current;
    const doc = document.documentElement;
    const ridotto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    doc.dataset.evento = "";
    /* il fuoco va sul riquadro, non sulla X: chi usa la tastiera arriva ai
       comandi col primo Tab, e chi usa il mouse non vede un anello acceso */
    el.focus({ preventScroll: true });

    let uscendo = false;
    const ctx = gsap.context(() => {
      const poster = el.querySelector("[data-poster]");
      const resto = el.querySelectorAll("[data-entra]");
      if (ridotto) {
        gsap.from(el, { opacity: 0, duration: 0.4, ease: "power1.out" });
        return;
      }
      gsap
        .timeline()
        .from(el, { opacity: 0, duration: 0.45, ease: "power2.out" }, 0)
        .from(poster, { y: 46, scale: 0.94, opacity: 0, duration: 1, ease: "expo.out" }, 0.08)
        .from(resto, { y: 14, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }, 0.36);
    }, el);

    const fine = () => {
      delete doc.dataset.evento;
      fineRef.current();
    };

    chiudiRef.current = () => {
      if (uscendo) return;
      uscendo = true;
      chiudiEvento(); // segna "vista" e lascia passare il banner dei cookie
      el.style.pointerEvents = "none";
      ctx.add(() => {
        if (ridotto) {
          gsap.to(el, { opacity: 0, duration: 0.3, onComplete: fine });
          return;
        }
        gsap
          .timeline({ onComplete: fine })
          .to(el.querySelector("[data-poster]"), { scale: 0.96, y: -10, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
          .to(el.querySelectorAll("[data-entra]"), { opacity: 0, duration: 0.25, ease: "power1.in" }, 0)
          .to(el, { opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.12);
      });
    };

    /* Esc chiude; Tab gira solo fra i comandi della locandina */
    const tasti = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        chiudiRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const fuochi = Array.from(el.querySelectorAll("a[href], button:not(:disabled)"));
      if (!fuochi.length) return;
      const primo = fuochi[0];
      const ultimo = fuochi[fuochi.length - 1];
      if (e.shiftKey && (document.activeElement === primo || !el.contains(document.activeElement))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (document.activeElement === ultimo || !el.contains(document.activeElement))) {
        e.preventDefault();
        primo.focus();
      }
    };
    document.addEventListener("keydown", tasti);

    return () => {
      document.removeEventListener("keydown", tasti);
      ctx.revert();
      delete doc.dataset.evento;
    };
  }, []);

  const chiudi = () => chiudiRef.current();
  const rapporto = banner.w && banner.h ? banner.w / banner.h : 0.75;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="evento-titolo"
      tabIndex={-1}
      data-evento-dialogo
      onClick={(e) => {
        if (e.target === e.currentTarget) chiudi();
      }}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-blu-950 px-4 outline-none sm:px-8"
      style={{ "--rapporto": rapporto }}
    >
      {/* fondo: la locandina stessa, minuscola e sfocata, sotto un velo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {banner.anteprima && (
          <div
            className="absolute -inset-[10%] scale-110 bg-cover bg-center blur-[34px]"
            style={{ backgroundImage: `url("${banner.anteprima}")` }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,rgba(7,41,55,0.25)_0%,rgba(7,41,55,0.72)_100%)]" />
      </div>

      {/* in alto: cosa e, e la X */}
      <div
        data-entra
        className="pointer-events-none absolute inset-x-4 flex items-center justify-between gap-4 sm:inset-x-6"
        style={{ top: "calc(14px + env(safe-area-inset-top))" }}
      >
        <p
          id="evento-titolo"
          className="min-w-0 truncate font-body text-[0.68rem] font-semibold tracking-[0.16em] text-white/90 uppercase sm:text-[0.72rem]"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-blu-400 align-middle" aria-hidden="true" />
          In evidenza <span className="text-white/45">·</span> {banner.titolo}
        </p>
        <button
          type="button"
          data-chiudi
          onClick={chiudi}
          aria-label="Chiudi e vai al sito"
          className="pointer-events-auto grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/30 bg-white/10 text-white transition-colors duration-200 hover:bg-white/22 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <CloseGlyph size={18} />
        </button>
      </div>

      <img
        data-poster
        src={banner.img}
        width={banner.w || undefined}
        height={banner.h || undefined}
        alt={banner.descrizione || banner.titolo}
        decoding="async"
        draggable="false"
        className="relative block h-auto rounded-[18px] shadow-[0_44px_90px_-34px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.14)] sm:rounded-[22px]"
      />

      <div data-entra className="relative mt-4 flex w-full max-w-[400px] flex-col gap-2.5 sm:mt-5 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-3">
        {banner.chiama && (
          <a
            href={`tel:${TEL}`}
            className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-white px-6 font-body text-[0.74rem] font-semibold tracking-[0.1em] whitespace-nowrap text-blu-950 uppercase shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-hero hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-[52px] sm:px-7 sm:text-[0.76rem]"
          >
            <span className="text-blu-600">
              <PhoneGlyph size={16} />
            </span>
            Chiama e ordina
          </a>
        )}
        <button
          type="button"
          onClick={chiudi}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 font-body text-[0.74rem] font-semibold tracking-[0.1em] whitespace-nowrap text-white uppercase transition-colors duration-200 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-[52px] sm:px-7 sm:text-[0.76rem]"
        >
          Vai al sito
          <ArrowGlyph size={15} />
        </button>
      </div>
    </div>
  );
}
