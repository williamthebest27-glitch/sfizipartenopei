import { INFO } from "../data/menu.js";
import { PhoneGlyph, MailGlyph, PinGlyph, ClockGlyph, InstagramGlyph, FacebookGlyph } from "./glyphs.jsx";

/* ===========================================================================
   SiteFooter — chiusura condivisa
   ---------------------------------------------------------------------------
   Su un sito di piu pagine il pie serve a due cose: dare un finale alle pagine
   lunghe e tenere i contatti sempre a un pollice di distanza. Fondo blu scuro
   perche e l'unico punto del sito dove il blu puo prendersi tutta la campitura
   senza togliere spazio alla fotografia.
   =========================================================================== */

const NAV = [
  { label: "Home", href: "index.html" },
  { label: "I nostri prodotti", href: "i-nostri-prodotti.html" },
  { label: "Contatti", href: "contatti.html" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-blu-950 text-blu-100">
      <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,72px)] py-[clamp(44px,7vh,80px)]">
        <div className="grid gap-[clamp(32px,5vw,64px)] md:grid-cols-2 lg:grid-cols-4">
          {/* marchio */}
          <div className="lg:col-span-1">
            <p
              className="font-display text-[1.5rem] font-extrabold text-white uppercase"
              style={{ letterSpacing: "-0.03em" }}
            >
              Sfizi
            </p>
            <p className="font-serif text-[1.45rem] font-bold text-blu-400 uppercase">Partenopei</p>
            <p className="mt-2 font-script text-[1.3rem] text-blu-300">Autentico gusto Napoletano</p>
          </div>

          {/* contatti */}
          <div>
            <h2 className="font-body text-[0.64rem] font-semibold tracking-[0.22em] text-blu-400 uppercase">
              Contatti
            </h2>
            <ul className="mt-4 flex flex-col gap-3 text-[0.94rem]">
              <li>
                <a
                  href={`tel:${INFO.tel}`}
                  className="group flex items-center gap-2.5 text-white transition-colors duration-300 hover:text-blu-300 focus-visible:text-blu-300"
                >
                  <span className="text-blu-400">
                    <PhoneGlyph />
                  </span>
                  <span className="font-semibold tabular-nums">{INFO.telLabel}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${INFO.email}`}
                  className="flex items-center gap-2.5 break-all text-blu-100 transition-colors duration-300 hover:text-white focus-visible:text-white"
                >
                  <span className="text-blu-400">
                    <MailGlyph />
                  </span>
                  {INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={INFO.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-blu-100 transition-colors duration-300 hover:text-white focus-visible:text-white"
                >
                  <span className="mt-0.5 text-blu-400">
                    <PinGlyph />
                  </span>
                  <span>
                    {INFO.via}
                    <br />
                    {INFO.cap}
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* orari e consegna */}
          <div>
            <h2 className="font-body text-[0.64rem] font-semibold tracking-[0.22em] text-blu-400 uppercase">
              Orari
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[0.94rem]">
              {INFO.orari.map((o) => (
                <li key={o.g} className="flex items-center gap-2.5">
                  <span className="text-blu-400">
                    <ClockGlyph />
                  </span>
                  <span className="text-blu-100">
                    {o.g} — <span className="font-semibold text-white tabular-nums">{o.h}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.88rem] leading-relaxed text-blu-200">
              Consegna entro {INFO.consegna.raggio}
              <br />
              <span className="tabular-nums">{INFO.consegna.finestre.join(" · ")}</span>
            </p>
          </div>

          {/* navigazione e social */}
          <div>
            <h2 className="font-body text-[0.64rem] font-semibold tracking-[0.22em] text-blu-400 uppercase">
              Pagine
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[0.94rem]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="group inline-flex items-center gap-2 text-blu-100 transition-colors duration-300 hover:text-white focus-visible:text-white"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-px w-0 bg-blu-400 transition-all duration-300 ease-hero group-hover:w-4 group-focus-visible:w-4"
                    />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram di Sfizi Partenopei"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blu-800 text-blu-200 transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:border-blu-400 hover:text-white focus-visible:-translate-y-0.5"
              >
                <InstagramGlyph size={18} />
              </a>
              <a
                href={INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook di Sfizi Partenopei"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blu-800 text-blu-200 transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:border-blu-400 hover:text-white focus-visible:-translate-y-0.5"
              >
                <FacebookGlyph size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-[clamp(32px,5vh,56px)] flex flex-col gap-3 border-t border-blu-900 pt-6 text-[0.78rem] text-blu-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sfizi Partenopei — Viganello, Lugano</p>

          <p>
            Sito realizzato da{" "}
            <a
              href="https://lyamflow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative font-semibold text-blu-100 transition-colors duration-300 ease-hero hover:text-white focus-visible:text-white"
            >
              LyamFlow
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 block h-px w-full origin-left scale-x-0 bg-blu-400 transition-transform duration-300 ease-hero group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
