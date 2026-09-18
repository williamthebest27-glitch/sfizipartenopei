import { useRef, useState } from "react";
import { INFO } from "../data/menu.js";
import { useReveal } from "../lib/reveal.js";
import PageOpener from "./PageOpener.jsx";
import SiteFooter from "./SiteFooter.jsx";
import {
  PhoneGlyph,
  MailGlyph,
  PinGlyph,
  ClockGlyph,
  TruckGlyph,
  SendGlyph,
  CheckGlyph,
  ArrowGlyph,
} from "./glyphs.jsx";

/* ===========================================================================
   ContactPage — "Contatti"
   ---------------------------------------------------------------------------
   Il telefono e il canale vero di questo locale: e un banco d'asporto, non un
   ristorante - non ci sono tavoli e non si prenota niente. Quindi la colonna di
   sinistra mette il numero al primo posto, grande e cliccabile, e il modulo e la
   strada lunga per chi scrive fuori orario.

   Il modulo non ha un server dietro: alla conferma compone un'email gia pronta
   e apre il programma di posta di chi scrive. E scritto sotto al pulsante, cosi
   nessuno resta ad aspettare una risposta che non arriverebbe. Il giorno in cui
   il sito avra un endpoint (Formspree, una funzione serverless, il form di
   Webador) si cambia solo il corpo di `handleSubmit`.
   =========================================================================== */

/* Unico motivo previsto dal cliente. Resta una costante e non un campo del
   modulo: un menu a tendina con una voce sola e interfaccia morta. Finisce
   comunque nell'oggetto dell'email. */
const MOTIVO = "Informazioni";

/* --------------------------------------------------------------------------
   Campo con etichetta che sale. placeholder=" " e il trucco che fa funzionare
   :not(:placeholder-shown): senza quello spazio il campo vuoto risulta sempre
   "con placeholder mostrato" e l'etichetta non tornerebbe mai giu.
   -------------------------------------------------------------------------- */
function Field({ id, label, type = "text", required, autoComplete, textarea }) {
  const base =
    "peer w-full rounded-2xl border border-blu-200 bg-white px-4 pt-6 pb-2 font-body text-[0.95rem] text-blu-950 outline-none transition-all duration-300 ease-hero placeholder-shown:text-blu-950 focus:border-blu-600 focus:shadow-[0_0_0_4px_rgba(13,169,220,0.14)]";

  return (
    <div className="relative" data-item>
      {textarea ? (
        <textarea id={id} name={id} rows={5} placeholder=" " required={required} className={`${base} resize-y`} />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder=" "
          required={required}
          autoComplete={autoComplete}
          className={base}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-4 left-4 origin-left font-body text-[0.95rem] text-blu-700 transition-all duration-300 ease-hero peer-focus:top-2 peer-focus:text-[0.62rem] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:text-blu-600 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[0.62rem] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:tracking-[0.14em] peer-[:not(:placeholder-shown)]:uppercase"
      >
        {label}
        {required && <span className="text-blu-500"> *</span>}
      </label>
    </div>
  );
}

/* Scheda di contatto della colonna di sinistra. */
function ContactCard({ icon, label, children, href, external }) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blu-200 bg-blu-50 text-blu-600 transition-all duration-500 ease-hero group-hover:border-blu-600 group-hover:bg-blu-600 group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-body text-[0.62rem] font-semibold tracking-[0.2em] text-blu-700 uppercase">
          {label}
        </span>
        <span className="mt-1 block text-[1rem] leading-snug text-blu-950">{children}</span>
      </span>
    </>
  );

  const cls =
    "group flex items-start gap-4 rounded-[22px] border border-blu-100 bg-white p-5 shadow-[0_16px_36px_-32px_rgba(7,41,55,0.5)] transition-all duration-500 ease-hero";

  if (!href) return <div data-item className={cls}>{inner}</div>;

  return (
    <a
      data-item
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${cls} hover:-translate-y-1 hover:border-blu-200 hover:shadow-[0_26px_48px_-32px_rgba(13,169,220,0.6)] focus-visible:-translate-y-1`}
    >
      {inner}
    </a>
  );
}

/* ------------------------------------------------------------------------ */

export default function ContactPage() {
  const root = useRef(null);
  const [sent, setSent] = useState(false);
  useReveal(root);

  function handleSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k) => (f.get(k) || "").toString().trim();

    const oggetto = `${MOTIVO} — ${get("nome")}`;
    const corpo = [
      `Nome: ${get("nome")}`,
      `Telefono: ${get("telefono")}`,
      `Email: ${get("email")}`,
      `Motivo: ${MOTIVO}`,
      "",
      get("messaggio"),
    ].join("\n");

    window.location.href = `mailto:${INFO.email}?subject=${encodeURIComponent(
      oggetto
    )}&body=${encodeURIComponent(corpo)}`;
    setSent(true);
  }

  return (
    <div ref={root}>
      <main>
        <PageOpener
          eyebrow="Viganello · Lugano"
          title="Contatti"
          script="chiamaci, si fa prima"
          lead="Ordini e consegne si prendono al telefono: e il modo piu veloce per avere una risposta. Se preferisci scrivere, il modulo qui sotto prepara l'email gia compilata."
        />

        <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,72px)] pb-[clamp(48px,8vh,96px)]">
          <div className="grid gap-[clamp(28px,4vw,56px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            {/* ---------- colonna dei recapiti ---------- */}
            <section data-reveal aria-labelledby="recapiti-title" className="flex flex-col gap-4">
              <h2 id="recapiti-title" className="sr-only">
                Recapiti
              </h2>

              {/* il telefono ha un trattamento a parte: e il canale vero */}
              <a
                data-item
                href={`tel:${INFO.tel}`}
                className="group relative isolate overflow-hidden rounded-[26px] bg-blu-950 p-[clamp(22px,3vw,34px)] text-white shadow-[0_26px_54px_-34px_rgba(7,41,55,0.95)] transition-all duration-500 ease-hero hover:-translate-y-1 hover:shadow-[0_32px_60px_-30px_rgba(13,169,220,0.75)] focus-visible:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-blu-700 transition-transform duration-600 ease-hero group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <span className="flex items-center gap-2.5 font-body text-[0.62rem] font-semibold tracking-[0.22em] text-blu-300 uppercase">
                  <PhoneGlyph />
                  Chiama il banco
                </span>
                <span
                  className="mt-3 block font-display font-extrabold tabular-nums"
                  style={{ fontSize: "clamp(1.9rem,4.2vw,2.9rem)", letterSpacing: "-0.035em", lineHeight: 1 }}
                >
                  {INFO.telLabel}
                </span>
                <span className="mt-3 flex items-center gap-2 text-[0.9rem] text-blu-200">
                  Lun–Sab {INFO.orari[0].h}
                  <span className="transition-transform duration-500 ease-hero group-hover:translate-x-1">
                    <ArrowGlyph />
                  </span>
                </span>
              </a>

              <ContactCard icon={<MailGlyph size={18} />} label="Email" href={`mailto:${INFO.email}`}>
                <span className="break-all">{INFO.email}</span>
              </ContactCard>

              <ContactCard icon={<PinGlyph size={18} />} label="Il banco" href={INFO.maps} external>
                {INFO.via}
                <br />
                {INFO.cap}
              </ContactCard>

              <ContactCard icon={<ClockGlyph size={18} />} label="Orari">
                <span className="flex flex-col gap-1">
                  {INFO.orari.map((o) => (
                    <span key={o.g} className="flex items-baseline justify-between gap-4">
                      <span>{o.g}</span>
                      <span className="font-semibold tabular-nums">{o.h}</span>
                    </span>
                  ))}
                </span>
              </ContactCard>

              <ContactCard icon={<TruckGlyph size={18} />} label={`Consegna entro ${INFO.consegna.raggio}`}>
                <span className="tabular-nums">{INFO.consegna.finestre.join(" · ")}</span>
                <span className="mt-2 block text-[0.86rem] leading-relaxed text-blu-800">
                  {INFO.consegna.zone.join(" · ")}
                </span>
              </ContactCard>
            </section>

            {/* ---------- modulo ---------- */}
            <section
              data-reveal
              aria-labelledby="modulo-title"
              className="rounded-[28px] border border-blu-100 bg-white p-[clamp(22px,3.4vw,44px)] shadow-[0_26px_60px_-44px_rgba(7,41,55,0.7)]"
            >
              <p data-item className="flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-8 bg-blu-500" />
                <span className="font-body text-[0.62rem] font-semibold tracking-[0.22em] text-blu-700 uppercase">
                  Scrivici
                </span>
              </p>

              <h2
                id="modulo-title"
                className="mt-3 font-display font-extrabold text-blu-950"
                style={{ fontSize: "clamp(1.7rem,3.4vw,2.6rem)", lineHeight: 1, letterSpacing: "-0.035em" }}
              >
                <span className="mb-[-0.12em] block overflow-hidden pb-[0.12em]">
                  <span data-line className="block">
                    Dicci cosa ti serve.
                  </span>
                </span>
              </h2>

              {sent ? (
                <div
                  role="status"
                  className="mt-7 flex flex-col items-start gap-4 rounded-[22px] border border-blu-200 bg-blu-50 p-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blu-700 text-white">
                    <CheckGlyph size={22} />
                  </span>
                  <div>
                    <p className="font-display text-[1.2rem] font-extrabold text-blu-950">
                      Email pronta.
                    </p>
                    <p className="mt-2 max-w-[46ch] text-[0.94rem] leading-relaxed text-blu-800">
                      Abbiamo aperto il tuo programma di posta con il messaggio gia compilato: premi
                      invia da li e ti rispondiamo appena possibile. Se non si e aperto niente,
                      scrivici direttamente a{" "}
                      <a
                        href={`mailto:${INFO.email}`}
                        className="font-semibold text-blu-700 underline underline-offset-4"
                      >
                        {INFO.email}
                      </a>
                      .
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="rounded-full border border-blu-200 bg-white px-5 py-2.5 font-body text-[0.7rem] font-semibold tracking-[0.12em] text-blu-800 uppercase transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:border-blu-700 focus-visible:-translate-y-0.5"
                  >
                    Scrivi un altro messaggio
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate={false} className="mt-7 flex flex-col gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="nome" label="Nome e cognome" required autoComplete="name" />
                    <Field id="telefono" label="Telefono" type="tel" required autoComplete="tel" />
                  </div>

                  <Field id="email" label="Email" type="email" required autoComplete="email" />

                  <Field id="messaggio" label="Il tuo messaggio" required textarea />

                  <div data-item className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      className="group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-blu-900 px-8 py-[1.05rem] font-body text-[0.76rem] font-semibold tracking-[0.1em] text-white uppercase shadow-[0_18px_40px_-22px_rgba(7,41,55,0.95)] transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-20px_rgba(13,169,220,0.85)] focus-visible:-translate-y-0.5"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-blu-600 transition-transform duration-500 ease-hero group-hover:scale-y-100 group-focus-visible:scale-y-100"
                      />
                      <span className="relative z-10 flex items-center gap-3">
                        Invia
                        <span className="transition-transform duration-500 ease-hero group-hover:translate-x-1">
                          <SendGlyph />
                        </span>
                      </span>
                    </button>

                    <p className="max-w-[34ch] text-[0.8rem] leading-snug text-blu-700">
                      Il modulo apre il tuo programma di posta col messaggio gia scritto. Per una
                      risposta subito, meglio il telefono.
                    </p>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
