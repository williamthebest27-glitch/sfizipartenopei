import { INFO } from "../../data/menu.js";
import { REALIZZAZIONE, SOCIETA } from "../../data/legale.js";
import { ArrowGlyph } from "../glyphs.jsx";
import { Esterno, Righe } from "./LegalPage.jsx";

/* ===========================================================================
   Impressum
   ---------------------------------------------------------------------------
   Le indicazioni che la legge contro la concorrenza sleale chiede a chi offre
   qualcosa online: chi e il gestore, come contattarlo, numero IDI/IVA. Sede
   legale e punto vendita sono diversi (Lugano e Viganello) e ci sono tutti e
   due. In coda la firma di chi ha realizzato il sito e i crediti obbligatori
   (OpenStreetMap per la mappa).
   =========================================================================== */

export default {
  id: "impressum",
  titolo: "Impressum",
  script: "chi c'è dietro al sito",
  lead: "I dati di chi gestisce questo sito, di chi lo ha realizzato e le note legali sui suoi contenuti.",
  sezioni: [
    {
      id: "gestore",
      titolo: "Gestore del sito",
      corpo: (
        <Righe
          righe={[
            ["Ragione sociale", <strong>{SOCIETA.ragioneSociale}</strong>],
            ["Forma giuridica", SOCIETA.forma],
            [
              "Sede legale",
              <>
                {SOCIETA.sedeVia}
                <br />
                {SOCIETA.sedeCap}, {SOCIETA.paese}
              </>,
            ],
            [
              "Punto vendita",
              <>
                {INFO.via}
                <br />
                {INFO.cap}
              </>,
            ],
            ["Telefono", <a href={`tel:${INFO.tel}`}>{INFO.telLabel}</a>],
            ["Email", <a href={`mailto:${INFO.email}`}>{INFO.email}</a>],
            ["Partita IVA (IDI)", <span className="tabular-nums">{SOCIETA.iva}</span>],
            ["Iscritta al", SOCIETA.registro],
          ]}
        />
      ),
    },
    {
      id: "contenuti",
      titolo: "Responsabile dei contenuti",
      corpo: (
        <p>
          Responsabile dei contenuti del sito è {SOCIETA.ragioneSociale}, ai recapiti indicati sopra. Testi,
          prezzi, orari e fotografie dei prodotti sono forniti dal gestore.
        </p>
      ),
    },
    {
      id: "realizzazione",
      titolo: "Realizzazione del sito",
      corpo: (
        <>
          <p>Progettazione, grafica e sviluppo del sito sono di:</p>
          <a
            href={REALIZZAZIONE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative isolate flex flex-col gap-6 overflow-hidden rounded-[28px] bg-blu-950 p-6 font-normal text-blu-100 no-underline transition-transform duration-500 ease-hero hover:-translate-y-1 hover:text-blu-100 focus-visible:-translate-y-1 sm:flex-row sm:items-end sm:justify-between sm:p-8"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-20 -z-10 aspect-square w-72"
              style={{
                borderRadius: "58% 42% 71% 29% / 38% 63% 37% 62%",
                background:
                  "radial-gradient(closest-side, rgba(13,169,220,0.42), rgba(13,169,220,0.14) 60%, rgba(13,169,220,0) 100%)",
              }}
            />
            <span>
              <span
                className="block font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-none font-extrabold text-white"
                style={{ letterSpacing: "-0.04em" }}
              >
                {REALIZZAZIONE.nome}
              </span>
              <span className="mt-2 block text-[0.98rem] text-blu-200">{REALIZZAZIONE.attivita}</span>
            </span>
            <span className="inline-flex items-center gap-3 font-body text-[0.74rem] font-semibold tracking-[0.12em] text-white uppercase">
              {REALIZZAZIONE.dominio}
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-blu-700 transition-all duration-500 ease-hero group-hover:border-blu-400 group-hover:bg-blu-500 group-focus-visible:bg-blu-500">
                <ArrowGlyph size={16} />
              </span>
            </span>
          </a>
        </>
      ),
    },
    {
      id: "crediti",
      titolo: "Crediti",
      corpo: (
        <ul>
          <li>
            <strong>Mappa</strong> della pagina Contatti: dati © contributori di{" "}
            <Esterno href="https://www.openstreetmap.org/copyright">OpenStreetMap</Esterno>, disponibili con
            licenza Open Database License (ODbL).
          </li>
          <li>
            <strong>Caratteri</strong>: Bricolage Grotesque, Geist, Playfair Display e Sacramento, distribuiti con
            licenza SIL Open Font License.
          </li>
          <li>
            <strong>Fotografie e immagini</strong>: {SOCIETA.ragioneSociale}. Alcune immagini dei prodotti hanno
            scopo illustrativo.
          </li>
        </ul>
      ),
    },
    {
      id: "responsabilita",
      titolo: "Esclusione di responsabilità",
      corpo: (
        <p>
          Curiamo con attenzione i contenuti di questo sito, ma non possiamo garantire che siano sempre esatti,
          completi e aggiornati. Nei limiti consentiti dalla legge, escludiamo ogni responsabilità per danni
          materiali o immateriali derivanti dall'accesso al sito, dall'uso delle informazioni pubblicate o da
          malfunzionamenti tecnici. Ci riserviamo di modificare o rimuovere i contenuti in qualsiasi momento e
          senza preavviso.
        </p>
      ),
    },
    {
      id: "link",
      titolo: "Link esterni",
      corpo: (
        <p>
          Il sito contiene link a siti di terzi (per esempio Google Maps, Instagram e Facebook). Non abbiamo alcun
          controllo sui loro contenuti e non ne rispondiamo: l'accesso e l'uso di quei siti avvengono a rischio
          di chi li visita e secondo le loro condizioni.
        </p>
      ),
    },
    {
      id: "diritti",
      titolo: "Diritti d'autore",
      corpo: (
        <p>
          Il marchio, il logo, i testi, le fotografie e la grafica del sito sono protetti dal diritto d'autore e
          appartengono a {SOCIETA.ragioneSociale} o ai rispettivi titolari. Ogni riproduzione, anche parziale,
          richiede il consenso scritto preventivo del titolare.
        </p>
      ),
    },
    {
      id: "privacy",
      titolo: "Protezione dei dati",
      corpo: (
        <p>
          Come trattiamo i dati personali è spiegato nella <a href="/privacy-policy">privacy policy</a>; cosa salva
          il sito nel tuo browser nella <a href="/cookie-policy">cookie policy</a>. Le condizioni di vendita sono
          nei <a href="/termini-e-condizioni">termini e condizioni</a>.
        </p>
      ),
    },
  ],
};
