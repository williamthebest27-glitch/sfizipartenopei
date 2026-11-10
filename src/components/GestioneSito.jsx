import { useEffect, useRef, useState } from "react";
import {
  BANNER_DEFAULT,
  BANNER_VUOTO,
  LIMITI_BANNER,
  pulisciBanner,
  scaduto,
  dataLeggibile,
  oggiALugano,
} from "../data/banner.js";

/* ===========================================================================
   Gestione sito — la dashboard del cliente
   ---------------------------------------------------------------------------
   Una pagina sola, per il telefono prima che per il computer. Il cliente
   modifica il banner in evidenza della home: una locandina a tutto schermo
   per eventi, offerte, chiusure. Il resto del sito non e raggiungibile da qui.

   Fino al 10 novembre 2026 da qui si gestiva anche la sezione Pranzo della
   pagina prodotti (piatti, menù completo, contorni): tolta definitivamente su
   richiesta del cliente, con le sue API.

   Accesso: una password, controllata dal server (/api/accesso) e tenuta in
   sessionStorage finche la scheda resta aperta. La locandina viene
   ridimensionata qui nel browser (lato lungo 2000 px, WebP) prima di partire:
   una foto da telefono di 5 MB diventa poche centinaia di KB e il caricamento
   e veloce anche col 4G del banco.
   =========================================================================== */

const CHIAVE = "sfizi-gestione-pw";
const INTESTAZIONE = "x-gestione-password";
const leggi = () => {
  try {
    return sessionStorage.getItem(CHIAVE) || "";
  } catch {
    return "";
  }
};
const scrivi = (v) => {
  try {
    v ? sessionStorage.setItem(CHIAVE, v) : sessionStorage.removeItem(CHIAVE);
  } catch {
    /* navigazione privata: si rientra con la password a ogni apertura */
  }
};

async function apriImmagine(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    try {
      await img.decode();
    } catch {
      throw new Error("Non riesco a leggere questa foto. Prova con una JPG o PNG.");
    } finally {
      URL.revokeObjectURL(url);
    }
    return img;
  }
}

/* La foto ridisegnata con il lato lungo al massimo `lato` px (mai ingrandita). */
function ridisegna(src, lato) {
  const k = Math.min(1, lato / Math.max(src.width, src.height));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(src.width * k));
  c.height = Math.max(1, Math.round(src.height * k));
  c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
  return c;
}

/* WebP dove il browser lo sa scrivere, JPEG altrove (Safari). */
async function comprimi(c, qualita) {
  let blob = await new Promise((r) => c.toBlob(r, "image/webp", qualita));
  if (!blob || blob.type !== "image/webp") blob = await new Promise((r) => c.toBlob(r, "image/jpeg", qualita + 0.03));
  if (!blob) throw new Error("Non riesco a preparare questa foto.");
  return blob;
}

/* La locandina: grande e poco compressa, perche e piena di scritte e sul sito
   e alta quanto lo schermo. In piu le sue misure (la home le usa per
   riservare lo spazio) e una copia da 32 px in JPEG, che sul sito fa da fondo
   sfocato. */
async function preparaLocandina(file) {
  const src = await apriImmagine(file);
  const c = ridisegna(src, 2000);
  const blob = await comprimi(c, 0.86);
  const anteprima = ridisegna(src, 32).toDataURL("image/jpeg", 0.6);
  return { blob, w: c.width, h: c.height, anteprima };
}

/* --------------------------------------------------------------------------
   Pezzi di interfaccia
   -------------------------------------------------------------------------- */
const input =
  "w-full rounded-xl border border-blu-200 bg-white px-3.5 py-2.5 text-[0.95rem] text-blu-950 outline-none transition focus:border-blu-600 focus:shadow-[0_0_0_4px_rgba(13,169,220,0.14)]";

function Campo({ label, hint, children, max, value }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[0.78rem] font-semibold text-blu-800">{label}</span>
        {max ? (
          <span className={`text-[0.7rem] tabular-nums ${value.length > max ? "text-red-600" : "text-blu-600/70"}`}>
            {value.length}/{max}
          </span>
        ) : hint ? (
          <span className="text-[0.7rem] text-blu-600/80">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

function Mini({ onClick, label, children, disabled, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-[0.78rem] font-semibold transition disabled:opacity-30 ${
        danger
          ? "border-red-200 text-red-700 hover:border-red-500 hover:bg-red-50"
          : "border-blu-200 text-blu-800 hover:border-blu-600 hover:bg-blu-50"
      }`}
    >
      {children}
    </button>
  );
}

function Sezione({ titolo, sotto, children, azione }) {
  return (
    <section className="rounded-[22px] border border-blu-100 bg-white p-4 shadow-[0_16px_36px_-32px_rgba(7,41,55,0.5)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-[1.25rem] font-extrabold text-blu-950" style={{ letterSpacing: "-0.02em" }}>
            {titolo}
          </h2>
          {sotto && <p className="mt-0.5 text-[0.84rem] text-blu-700">{sotto}</p>}
        </div>
        {azione}
      </div>
      {children}
    </section>
  );
}

/* --------------------------------------------------------------------------
   Banner in evidenza
   -------------------------------------------------------------------------- */
function Interruttore({ acceso, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={acceso}
      onClick={() => onChange(!acceso)}
      className="group inline-flex shrink-0 items-center gap-2.5 rounded-full py-1 pr-1 pl-3 text-[0.78rem] font-semibold text-blu-800"
    >
      {label}
      <span
        className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${acceso ? "bg-blu-600" : "bg-blu-200"}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${acceso ? "translate-x-5" : ""}`}
        />
      </span>
    </button>
  );
}

function StatoBanner({ b }) {
  let testo;
  let tono;
  if (!b.img) [testo, tono] = ["Nessuna locandina", "spento"];
  else if (!b.attivo) [testo, tono] = ["Spento: non compare sul sito", "spento"];
  else if (scaduto(b)) [testo, tono] = [`Scaduto il ${dataLeggibile(b.fino)}: non compare più`, "avviso"];
  else
    [testo, tono] = [
      b.fino ? `Acceso fino al ${dataLeggibile(b.fino)} compreso` : "Acceso, senza scadenza",
      "acceso",
    ];
  const stile = {
    acceso: "bg-blu-50 text-blu-800 border-blu-200",
    spento: "bg-white text-blu-700 border-blu-100",
    avviso: "bg-amber-50 text-amber-800 border-amber-200",
  }[tono];
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.76rem] font-semibold ${stile}`}>
      <span
        className={`h-2 w-2 rounded-full ${tono === "acceso" ? "bg-blu-500" : tono === "avviso" ? "bg-amber-500" : "bg-blu-200"}`}
        aria-hidden="true"
      />
      {testo}
    </p>
  );
}

function BannerEditor({ banner: b, set, password, onErrore, onCarica }) {
  const file = useRef(null);
  const [carica, setCarica] = useState(false);

  async function scegli(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setCarica(true);
    onCarica(1);
    try {
      const { blob, w, h, anteprima } = await preparaLocandina(f);
      const r = await fetch("api/banner-foto", {
        method: "POST",
        headers: { "content-type": blob.type, [INTESTAZIONE]: password },
        body: blob,
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.errore || "Caricamento non riuscito.");
      /* Locandina nuova al posto di un'altra: titolo e descrizione erano quelli
         della vecchia, quindi si svuotano (il salvataggio chiede il titolo).
         La data di fine resta, ma si vede nello stato del banner. */
      set((x) =>
        Object.assign(x, x.img ? { titolo: "", descrizione: "" } : {}, { img: d.url, w, h, anteprima, attivo: true })
      );
    } catch (err) {
      onErrore(err.message || "Caricamento non riuscito.");
    } finally {
      setCarica(false);
      onCarica(-1);
    }
  }

  const apri = () => file.current?.click();
  const oggi = oggiALugano();

  return (
    <Sezione
      titolo="Banner in evidenza"
      sotto="Una locandina a tutto schermo che compare sulla home appena si è aperta: eventi, offerte, chiusure. Chi visita la vede una volta, poi la chiude e resta sul sito."
      azione={
        <Interruttore
          label="Sul sito"
          acceso={b.attivo}
          onChange={(v) => {
            if (v && !b.img) {
              apri();
              return;
            }
            set((x) => ((x.attivo = v), x));
          }}
        />
      }
    >
      <div className="mb-4">
        <StatoBanner b={b} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {/* locandina */}
        <div className="flex shrink-0 flex-col items-center gap-2.5 sm:w-[200px]">
          <button
            type="button"
            onClick={apri}
            aria-label={b.img ? "Cambia locandina" : "Carica una locandina"}
            className={`group relative w-full max-w-[240px] overflow-hidden rounded-2xl border bg-blu-50 transition hover:border-blu-600 ${
              b.img ? "border-blu-200" : "border-dashed border-blu-300"
            } ${b.img && !b.attivo ? "opacity-55" : ""}`}
            style={{ aspectRatio: b.img && b.w && b.h ? `${b.w} / ${b.h}` : "3 / 4" }}
          >
            {b.img ? (
              <img src={b.img} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-blu-700">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <rect x="4" y="3" width="16" height="18" rx="2.5" />
                  <path d="m4 16 4.5-4.5 4 4 2.5-2.5L20 18" strokeLinejoin="round" />
                  <circle cx="15.5" cy="8" r="1.6" />
                </svg>
                <span className="text-[0.8rem] font-semibold">Carica la locandina</span>
                <span className="text-[0.7rem] text-blu-600">JPG o PNG, verticale o orizzontale</span>
              </span>
            )}
            {carica && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/80">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-blu-200 border-t-blu-600" />
              </span>
            )}
          </button>
          <input ref={file} type="file" accept="image/*" className="hidden" onChange={scegli} />
          {b.img && !carica && (
            <div className="flex gap-2">
              <Mini label="Cambia locandina" onClick={apri}>
                Cambia
              </Mini>
              <Mini
                danger
                label="Togli la locandina"
                onClick={() => {
                  if (window.confirm("Togliere la locandina? Il banner si spegne.")) set(() => structuredClone(BANNER_VUOTO));
                }}
              >
                Togli
              </Mini>
            </div>
          )}
        </div>

        {/* dettagli */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Campo label="Titolo" max={LIMITI_BANNER.titolo} value={b.titolo}>
            <input
              className={input}
              value={b.titolo}
              placeholder="Es. Aperitivo di Natale"
              onChange={(e) => set((x) => ((x.titolo = e.target.value), x))}
            />
          </Campo>
          <Campo label="Cosa dice la locandina (facoltativo)" max={LIMITI_BANNER.descrizione} value={b.descrizione}>
            <textarea
              rows={3}
              className={`${input} resize-y`}
              value={b.descrizione}
              placeholder="Per chi non vede l'immagine e per Google: prezzo, date, cosa comprende."
              onChange={(e) => set((x) => ((x.descrizione = e.target.value), x))}
            />
          </Campo>
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            <Campo label="Visibile fino al (compreso)" hint={b.fino ? "" : "facoltativo"}>
              <span className="flex items-center gap-2">
                <input
                  type="date"
                  className={`${input} min-w-0`}
                  value={b.fino}
                  min={oggi}
                  onChange={(e) => set((x) => ((x.fino = e.target.value), x))}
                />
                {b.fino && (
                  <Mini label="Togli la data di fine" onClick={() => set((x) => ((x.fino = ""), x))}>
                    ✕
                  </Mini>
                )}
              </span>
            </Campo>
            <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-blu-200 px-3.5 py-2.5">
              <input
                type="checkbox"
                className="h-5 w-5 shrink-0 accent-blu-600"
                checked={b.chiama}
                onChange={(e) => set((x) => ((x.chiama = e.target.checked), x))}
              />
              <span className="text-[0.84rem] leading-snug text-blu-950">
                Pulsante <b className="font-semibold">«Chiama e ordina»</b>
              </span>
            </label>
          </div>
          <p className="text-[0.76rem] leading-relaxed text-blu-700">
            Dopo la data di fine il banner si spegne da solo.{" "}
            <a href="/?evento" target="_blank" rel="noopener" className="font-semibold text-blu-800 underline underline-offset-2">
              Vedi sul sito ↗
            </a>{" "}
            (mostra l'ultima versione salvata).
          </p>
        </div>
      </div>
    </Sezione>
  );
}

/* --------------------------------------------------------------------------
   Accesso
   -------------------------------------------------------------------------- */
function Accesso({ onEntra }) {
  const [pw, setPw] = useState("");
  const [errore, setErrore] = useState("");
  const [attesa, setAttesa] = useState(false);

  async function invia(e) {
    e.preventDefault();
    setAttesa(true);
    setErrore("");
    try {
      const r = await fetch("api/accesso", { method: "POST", headers: { [INTESTAZIONE]: pw } });
      if (r.ok) onEntra(pw);
      else setErrore(r.status === 401 ? "Password sbagliata." : "Il server non risponde, riprova tra poco.");
    } catch {
      setErrore("Connessione assente, riprova.");
    } finally {
      setAttesa(false);
    }
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-5 py-10">
      <form onSubmit={invia} className="w-full max-w-[380px] rounded-[26px] border border-blu-100 bg-white p-7 shadow-[0_26px_60px_-44px_rgba(7,41,55,0.7)]">
        <img src="img/logo.webp" alt="Sfizi Partenopei" className="h-12 w-auto" />
        <h1 className="mt-5 font-display text-[1.7rem] font-extrabold text-blu-950" style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}>
          Gestione sito
        </h1>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-blu-700">
          Il banner in evidenza della home: la locandina per eventi, offerte e chiusure.
        </p>
        <label className="mt-6 block">
          <span className="mb-1.5 block text-[0.78rem] font-semibold text-blu-800">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            className={input}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </label>
        {errore && <p className="mt-3 text-[0.84rem] font-semibold text-red-700" role="alert">{errore}</p>}
        <button
          type="submit"
          disabled={!pw || attesa}
          className="mt-5 w-full rounded-full bg-blu-950 px-6 py-3.5 text-[0.8rem] font-semibold tracking-[0.08em] text-white uppercase transition hover:bg-blu-700 disabled:opacity-40"
        >
          {attesa ? "Controllo…" : "Entra"}
        </button>
      </form>
    </main>
  );
}

/* --------------------------------------------------------------------------
   Editor
   -------------------------------------------------------------------------- */
const quando = (iso) =>
  new Date(iso).toLocaleString("it-CH", { dateStyle: "medium", timeStyle: "short" });

export default function GestioneSito() {
  const [password, setPassword] = useState(leggi);
  const [banner, setBanner] = useState(null);
  const [salvato, setSalvato] = useState(null); // ultima versione salvata, per sapere se ci sono modifiche
  const [stato, setStato] = useState({ tipo: "", msg: "" });
  const [salva, setSalva] = useState(false);
  /* locandina in caricamento: finche non e arrivata, non si salva (si
     salverebbe quella vecchia e la nuova arriverebbe dopo, come modifica a
     parte) */
  const [inCarico, setInCarico] = useState(0);
  const onCarica = (d) => setInCarico((n) => Math.max(0, n + d));

  /* carica il banner attuale (senza cache) appena si entra.
     { salvato: false } = mai salvato: vale il banner di partenza, lo stesso
     che mostra il sito */
  useEffect(() => {
    if (!password) return;
    let vivo = true;
    fetch("api/banner?fresco=1", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!vivo) return;
        const { aggiornato, ...resto } = d && typeof d === "object" && "attivo" in d ? d : BANNER_DEFAULT;
        const b = { ...BANNER_VUOTO, ...resto };
        setBanner(b);
        setSalvato(JSON.stringify(b));
        if (aggiornato) setStato({ tipo: "", msg: `Ultimo salvataggio: ${quando(aggiornato)}` });
      })
      .catch(() => {
        if (!vivo) return;
        setBanner(BANNER_DEFAULT);
        setSalvato(JSON.stringify(BANNER_DEFAULT));
      });
    return () => {
      vivo = false;
    };
  }, [password]);

  const modificato = banner && salvato !== JSON.stringify(banner);

  // avviso se si chiude la pagina con modifiche non salvate
  useEffect(() => {
    if (!modificato) return;
    const h = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [modificato]);

  if (!password) {
    return (
      <Accesso
        onEntra={(pw) => {
          scrivi(pw);
          setPassword(pw);
        }}
      />
    );
  }

  if (!banner) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-blu-200 border-t-blu-600" aria-label="Caricamento" />
      </main>
    );
  }

  const setB = (fn) => setBanner((b) => fn(structuredClone(b)));
  const errore = (msg) => setStato({ tipo: "errore", msg });
  const esci = () => {
    if (modificato && !window.confirm("Ci sono modifiche non salvate. Uscire lo stesso?")) return;
    scrivi("");
    setPassword("");
    setBanner(null);
  };

  async function salvaTutto() {
    let pulito;
    try {
      pulito = pulisciBanner(banner);
    } catch (e) {
      errore(e.message);
      return;
    }
    setSalva(true);
    setStato({ tipo: "", msg: "Salvataggio…" });
    try {
      const r = await fetch("api/banner", {
        method: "PUT",
        headers: { "content-type": "application/json", [INTESTAZIONE]: password },
        body: JSON.stringify(pulito),
      });
      const d = await r.json().catch(() => ({}));
      if (r.status === 401) {
        scrivi("");
        setPassword("");
        return;
      }
      if (!r.ok) throw new Error(d.errore || "Salvataggio non riuscito.");
      const { aggiornato, ...resto } = d;
      const b = { ...BANNER_VUOTO, ...resto };
      setBanner(b);
      setSalvato(JSON.stringify(b));
      setStato({ tipo: "ok", msg: "Salvato. Sul sito entro un paio di minuti." });
    } catch (e) {
      errore(e.message || "Salvataggio non riuscito.");
    } finally {
      setSalva(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-blu-50/60 pb-32">
      {/* testata */}
      <header className="sticky top-0 z-20 border-b border-blu-100 bg-white/95">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="img/logo.webp" alt="" className="h-9 w-auto" />
            <span className="font-display text-[1.05rem] font-extrabold text-blu-950">Gestione sito</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener"
              className="rounded-full border border-blu-200 px-3.5 py-2 text-[0.74rem] font-semibold text-blu-800 transition hover:border-blu-600"
            >
              Vedi il sito ↗
            </a>
            <button type="button" onClick={esci} className="rounded-full px-3 py-2 text-[0.74rem] font-semibold text-blu-700 hover:bg-blu-50">
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[760px] flex-col gap-4 px-4 pt-5 sm:gap-5">
        <BannerEditor banner={banner} set={setB} password={password} onErrore={errore} onCarica={onCarica} />
      </main>

      {/* barra di salvataggio */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-blu-100 bg-white/95 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-[760px] items-center justify-between gap-3 px-4 py-3">
          <p
            role="status"
            className={`min-w-0 text-[0.82rem] leading-snug ${
              stato.tipo === "errore" ? "font-semibold text-red-700" : stato.tipo === "ok" ? "font-semibold text-blu-700" : "text-blu-700"
            }`}
          >
            {inCarico > 0
              ? "Caricamento della locandina…"
              : modificato && stato.tipo !== "errore"
                ? "Modifiche non salvate."
                : stato.msg}
          </p>
          <button
            type="button"
            onClick={salvaTutto}
            disabled={!modificato || salva || inCarico > 0}
            className="shrink-0 rounded-full bg-blu-950 px-6 py-3 text-[0.78rem] font-semibold tracking-[0.08em] text-white uppercase transition hover:bg-blu-700 disabled:opacity-35"
          >
            {salva ? "Salvo…" : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}
