import { useLayoutEffect } from "react";
import gsap from "gsap";

/* ===========================================================================
   useReveal — entrate in scena delle pagine interne
   ---------------------------------------------------------------------------
   Un solo hook per tutta la pagina invece di una timeline per sezione. Scansiona
   il sottoalbero e raccoglie due tipi di elemento:

     [data-line]  una riga di testo dentro una maschera overflow-hidden: sale
                  da sotto, e l'animazione tipografica del sito
     [data-item]  qualsiasi altro blocco: sale e sfuma dentro

   L'innesco e doppio, e serve che lo sia. Misurato su questa pagina:

     IntersectionObserver copre lo scorrimento normale a costo zero, senza
     leggere il layout a ogni frame. Ma notifica solo i CAMBI di stato: un
     elemento che passa da "sotto la piega" a "sopra la finestra" in un frame
     solo - un clic su un'ancora di categoria, un ricaricamento a meta pagina,
     un salto con la barra di scorrimento - non interseca mai, quindi nessuna
     callback, e restava fermo a opacity 0. Con ScrollTrigger.batch succedeva
     esattamente lo stesso: trenta card su quarantasei invisibili.

     La passata di recupero chiude il buco. Non gira a ogni scroll: solo quando
     lo scatto supera mezza schermata, cioe quando un salto puo aver scavalcato
     qualcosa. Durante lo scorrimento normale non legge niente.

   Quello che e gia sopra la finestra si mostra senza animazione: animarlo
   significherebbe far comparire dal nulla roba che si vede solo tornando su.

   Sotto prefers-reduced-motion l'hook non tocca niente: la pagina si vede
   subito completa.
   =========================================================================== */

const FROM = {
  line: { yPercent: 115 },
  item: { opacity: 0, y: 26 },
};

const TO = {
  line: { yPercent: 0, duration: 1.05, stagger: 0.09, ease: "expo.out" },
  item: { opacity: 1, y: 0, duration: 0.8, stagger: 0.055, ease: "power3.out" },
};

const kindOf = (node) => (node.hasAttribute("data-line") ? "line" : "item");

export function useReveal(rootRef) {
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer;
    let onScroll;

    const ctx = gsap.context(() => {
      const pending = new Set(el.querySelectorAll("[data-line], [data-item]"));
      if (!pending.size) return;

      pending.forEach((node) => gsap.set(node, FROM[kindOf(node)]));

      /* Mostra un gruppo: animato se entra adesso, istantaneo se e gia
         passato sopra la finestra. Lo stagger tiene insieme cio che compare
         nello stesso momento. */
      const show = (nodes, animate) => {
        ["line", "item"].forEach((kind) => {
          const group = nodes.filter((n) => kindOf(n) === kind);
          if (!group.length) return;
          if (animate) gsap.to(group, TO[kind]);
          else gsap.set(group, { ...TO[kind], duration: 0, stagger: 0 });
        });
        nodes.forEach((n) => {
          pending.delete(n);
          observer.unobserve(n);
        });
        if (!pending.size) window.removeEventListener("scroll", onScroll);
      };

      observer = new IntersectionObserver(
        (entries) => {
          const entranti = [];
          const passati = [];
          entries.forEach((e) => {
            if (e.isIntersecting) entranti.push(e.target);
            else if (e.boundingClientRect.top < 0) passati.push(e.target);
          });
          if (passati.length) show(passati, false);
          if (entranti.length) show(entranti, true);
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0 }
      );

      pending.forEach((node) => observer.observe(node));

      /* Recupero dopo un salto: tutto cio che ormai sta sopra la soglia va
         scoperto, altrimenti resta invisibile per sempre. */
      const sweep = () => {
        const soglia = window.innerHeight * 0.92;
        const passati = [];
        const entranti = [];
        pending.forEach((n) => {
          const top = n.getBoundingClientRect().top;
          if (top < 0) passati.push(n);
          else if (top < soglia) entranti.push(n);
        });
        if (passati.length) show(passati, false);
        if (entranti.length) show(entranti, true);
      };

      let ultimo = window.scrollY;
      onScroll = () => {
        const ora = window.scrollY;
        if (Math.abs(ora - ultimo) > window.innerHeight * 0.5) sweep();
        ultimo = ora;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      /* Un ricaricamento con la posizione ripristinata, o un'apertura con
         l'ancora nell'indirizzo, parte gia a meta pagina. */
      requestAnimationFrame(sweep);
    }, rootRef);

    return () => {
      if (observer) observer.disconnect();
      if (onScroll) window.removeEventListener("scroll", onScroll);
      ctx.revert();
    };
  }, [rootRef]);
}
