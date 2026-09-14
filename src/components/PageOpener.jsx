/* ===========================================================================
   PageOpener — la testata delle pagine interne
   ---------------------------------------------------------------------------
   Stesso linguaggio della home (occhiello con filetto, titolo in Bricolage,
   firma in Sacramento) ma alto quanto il suo contenuto, non quanto lo schermo:
   qui sotto c'e materiale da leggere, e una testata a tutta viewport lo
   spingerebbe fuori dalla prima schermata.

   Il padding in alto tiene conto della barra fissa, che su mobile e alta due
   righe.
   =========================================================================== */
export default function PageOpener({ eyebrow, title, script, lead, children }) {
  return (
    <header className="relative isolate overflow-hidden bg-white">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[30%] -left-[10%] aspect-[1.3/1] w-[110vw] max-w-[820px] rotate-[-8deg]"
        style={{
          borderRadius: "58% 42% 71% 29% / 38% 63% 37% 62%",
          background:
            "radial-gradient(closest-side, rgba(13,169,220,0.24), rgba(13,169,220,0.16) 46%, rgba(13,169,220,0.05) 76%, rgba(13,169,220,0) 100%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[16%] top-[10%] aspect-[1.15/1] w-[80vw] max-w-[620px] rotate-[12deg]"
        style={{
          borderRadius: "31% 69% 42% 58% / 64% 33% 67% 36%",
          background:
            "radial-gradient(closest-side, rgba(10,132,172,0.16), rgba(10,132,172,0.1) 48%, rgba(10,132,172,0.03) 78%, rgba(10,132,172,0) 100%)",
        }}
      />

      <div
        data-reveal
        className="relative mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,72px)] pt-[clamp(132px,17vh,180px)] pb-[clamp(36px,6vh,68px)] lg:pt-[clamp(118px,14vh,160px)]"
      >
        <p className="flex items-center gap-3" data-item>
          <span aria-hidden="true" className="block h-px w-8 bg-blu-500 sm:w-12" />
          <span className="font-body text-[0.64rem] font-semibold tracking-[0.24em] text-blu-700 uppercase sm:text-[0.7rem]">
            {eyebrow}
          </span>
        </p>

        <h1
          className="mt-[clamp(12px,2vh,22px)] font-display font-extrabold text-blu-950"
          style={{
            fontSize: "clamp(2.6rem, min(8vw, 11vh), 5.6rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            fontStretch: "100%",
          }}
        >
          {/* maschera per riga: padding + margine negativo, cosi l'overflow non
              taglia i discendenti */}
          <span className="mb-[-0.12em] block overflow-hidden pb-[0.12em]">
            <span data-line className="block">
              {title}
            </span>
          </span>
        </h1>

        {script && (
          <p
            data-item
            className="mt-1 font-script text-[clamp(1.5rem,3vw,2.6rem)] leading-[1.1] text-blu-600"
          >
            {script}
          </p>
        )}

        {lead && (
          <p
            data-item
            className="mt-[clamp(14px,2.4vh,26px)] max-w-[58ch] text-[clamp(0.95rem,1.05vw,1.15rem)] leading-relaxed text-blu-800"
          >
            {lead}
          </p>
        )}

        {children}
      </div>
    </header>
  );
}
