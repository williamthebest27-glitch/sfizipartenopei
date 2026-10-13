import { useEffect, useRef, useState } from "react";
import { PRANZO_DEFAULT, LIMITI, pulisciPranzo, isFotoCaricata } from "../data/pranzo.js";

/* ===========================================================================
   Gestione pranzo — la dashboard del cliente
   ---------------------------------------------------------------------------
   Una pagina sola, per il telefono prima che per il computer: il cliente
   cambia il pranzo dal banco. Modifica solo la sezione pranzo (piatti, menù
   completo, contorni, testo d'apertura): il resto del sito non e raggiungibile
   da qui.

   Accesso: una password, controllata dal server (/api/pranzo-accesso) e
   tenuta in sessionStorage finche la scheda resta aperta. Le foto vengono
   ridimensionate qui nel browser (lato lungo 1600 px, WebP) prima di partire:
   una foto da telefono di 5 MB diventa ~250 KB e il caricamento e veloce
   anche col 4G del banco.
   =========================================================================== */

const CHIAVE = "sfizi-pranzo-pw";
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

const nuovoId = (pref) => `${pref}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

async function preparaFoto(file) {
  let src;
  try {
    src = await createImageBitmap(file, { imageOrientation: "from-image" });
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
    src = img;
  }
  const w = src.width;
  const h = src.height;
  const k = Math.min(1, 1600 / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * k);
  c.height = Math.round(h * k);
  c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
  let blob = await new Promise((r) => c.toBlob(r, "image/webp", 0.82));
  if (!blob || blob.type !== "image/webp") blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85));
  if (!blob) throw new Error("Non riesco a preparare questa foto.");
  return blob;
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

function Prezzo({ label, value, onChange, placeholder = "0.00" }) {
  return (
    <Campo label={label}>
      <span className="relative block">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[0.7rem] font-semibold tracking-[0.12em] text-blu-600">
          CHF
        </span>
        <input
          className={`${input} pl-12 tabular-nums`}
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </span>
    </Campo>
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

/* Foto: miniatura cliccabile, caricamento, rimozione. */
function Foto({ img, tonda, onChange, password, onErrore, onCarica }) {
  const file = useRef(null);
  const [carica, setCarica] = useState(false);

  async function scegli(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setCarica(true);
    onCarica(1);
    try {
      const blob = await preparaFoto(f);
      const r = await fetch("api/pranzo-foto", {
        method: "POST",
        headers: { "content-type": blob.type, "x-pranzo-password": password },
        body: blob,
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.errore || "Caricamento non riuscito.");
      onChange(d.url);
    } catch (err) {
      onErrore(err.message || "Caricamento non riuscito.");
    } finally {
      setCarica(false);
      onCarica(-1);
    }
  }

  const forma = tonda ? "rounded-full" : "rounded-2xl";
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => file.current?.click()}
        className={`group relative h-24 w-24 overflow-hidden border border-blu-200 bg-blu-50 transition hover:border-blu-600 ${forma}`}
        aria-label={img ? "Cambia foto" : "Aggiungi foto"}
      >
        {img ? (
          <img
            src={img}
            alt=""
            className={`h-full w-full ${isFotoCaricata(img) ? "object-cover" : "object-contain p-1"}`}
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-blu-600">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            <span className="text-[0.66rem] font-semibold">Foto</span>
          </span>
        )}
        {carica && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/80">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-blu-200 border-t-blu-600" />
          </span>
        )}
      </button>
      <input ref={file} type="file" accept="image/*" className="hidden" onChange={scegli} />
      {img && !carica && (
        <button type="button" onClick={() => onChange(null)} className="text-[0.7rem] font-semibold text-blu-700 underline-offset-2 hover:underline">
          Togli foto
        </button>
      )}
    </div>
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
      const r = await fetch("api/pranzo-accesso", { method: "POST", headers: { "x-pranzo-password": pw } });
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
          Gestione pranzo
        </h1>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-blu-700">
          Piatti, prezzi, foto e contorni della sezione pranzo del sito.
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
function sposta(arr, i, d) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const a = arr.slice();
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

export default function PranzoAdmin() {
  const [password, setPassword] = useState(leggi);
  const [dati, setDati] = useState(null);
  const [salvati, setSalvati] = useState(null); // ultima versione salvata, per sapere se ci sono modifiche
  const [stato, setStato] = useState({ tipo: "", msg: "" });
  const [salva, setSalva] = useState(false);
  /* foto in caricamento: finche ce n'e una, non si salva (si salverebbe la
     foto vecchia e quella nuova arriverebbe dopo, come modifica a parte) */
  const [inCarico, setInCarico] = useState(0);
  const onCarica = (d) => setInCarico((n) => Math.max(0, n + d));

  // carica i contenuti attuali (senza cache) appena si entra
  useEffect(() => {
    if (!password) return;
    let vivo = true;
    fetch("api/pranzo?fresco=1", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!vivo) return;
        const base = d && Array.isArray(d.piatti) ? d : PRANZO_DEFAULT;
        const { aggiornato, ...resto } = base;
        setDati(resto);
        setSalvati(JSON.stringify(resto));
        if (aggiornato) setStato({ tipo: "", msg: `Ultimo salvataggio: ${new Date(aggiornato).toLocaleString("it-CH", { dateStyle: "medium", timeStyle: "short" })}` });
      })
      .catch(() => {
        if (!vivo) return;
        setDati(PRANZO_DEFAULT);
        setSalvati(JSON.stringify(PRANZO_DEFAULT));
      });
    return () => {
      vivo = false;
    };
  }, [password]);

  const modificato = dati && salvati !== JSON.stringify(dati);

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

  if (!dati) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-blu-200 border-t-blu-600" aria-label="Caricamento" />
      </main>
    );
  }

  const set = (fn) => setDati((d) => fn(structuredClone(d)));
  const errore = (msg) => setStato({ tipo: "errore", msg });
  const esci = () => {
    if (modificato && !window.confirm("Ci sono modifiche non salvate. Uscire lo stesso?")) return;
    scrivi("");
    setPassword("");
    setDati(null);
  };

  async function salvaTutto() {
    let pulito;
    try {
      pulito = pulisciPranzo(dati);
    } catch (e) {
      errore(e.message);
      return;
    }
    setSalva(true);
    setStato({ tipo: "", msg: "Salvataggio…" });
    try {
      const r = await fetch("api/pranzo", {
        method: "PUT",
        headers: { "content-type": "application/json", "x-pranzo-password": password },
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
      setDati(resto);
      setSalvati(JSON.stringify(resto));
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
            <span className="font-display text-[1.05rem] font-extrabold text-blu-950">Gestione pranzo</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/i-nostri-prodotti#pranzo"
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
        <Sezione titolo="Testo d'apertura" sotto="La frase sotto il titolo «Pranzo».">
          <Campo label="Testo" max={LIMITI.lead} value={dati.lead}>
            <textarea
              rows={3}
              className={`${input} resize-y`}
              value={dati.lead}
              onChange={(e) => set((d) => ((d.lead = e.target.value), d))}
            />
          </Campo>
        </Sezione>

        <Sezione
          titolo="Piatti"
          sotto="L'ordine qui è l'ordine sul sito."
          azione={
            <Mini
              label="Aggiungi piatto"
              disabled={dati.piatti.length >= LIMITI.piatti}
              onClick={() =>
                set((d) => (d.piatti.push({ id: nuovoId("piatto"), name: "", desc: "", price: "", price2: "", img: null }), d))
              }
            >
              + Piatto
            </Mini>
          }
        >
          {dati.piatti.length === 0 && (
            <p className="rounded-xl bg-blu-50 p-4 text-[0.88rem] text-blu-700">Nessun piatto: aggiungine uno con «+ Piatto».</p>
          )}
          <ol className="flex flex-col gap-3">
            {dati.piatti.map((p, i) => (
              <li key={p.id} className="rounded-2xl border border-blu-100 p-3 sm:p-4">
                <div className="flex gap-3 sm:gap-4">
                  <Foto
                    img={p.img}
                    password={password}
                    onErrore={errore}
                    onCarica={onCarica}
                    onChange={(url) => set((d) => ((d.piatti[i].img = url), d))}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <Campo label="Nome del piatto" max={LIMITI.nome} value={p.name}>
                      <input className={input} value={p.name} onChange={(e) => set((d) => ((d.piatti[i].name = e.target.value), d))} />
                    </Campo>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                  <Campo label="Descrizione (facoltativa)" max={LIMITI.desc} value={p.desc}>
                    <textarea rows={2} className={`${input} resize-y`} value={p.desc} onChange={(e) => set((d) => ((d.piatti[i].desc = e.target.value), d))} />
                  </Campo>
                  <div className="grid grid-cols-2 gap-3">
                    <Prezzo label="Prezzo" value={p.price} onChange={(v) => set((d) => ((d.piatti[i].price = v), d))} />
                    <Prezzo label="2° prezzo" placeholder="facoltativo" value={p.price2} onChange={(v) => set((d) => ((d.piatti[i].price2 = v), d))} />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-blu-100 pt-3">
                  <div className="flex gap-2">
                    <Mini label="Sposta su" disabled={i === 0} onClick={() => set((d) => ((d.piatti = sposta(d.piatti, i, -1)), d))}>↑</Mini>
                    <Mini label="Sposta giù" disabled={i === dati.piatti.length - 1} onClick={() => set((d) => ((d.piatti = sposta(d.piatti, i, 1)), d))}>↓</Mini>
                  </div>
                  <Mini
                    danger
                    label="Elimina piatto"
                    onClick={() => {
                      if (window.confirm(`Eliminare «${p.name || "questo piatto"}»?`)) set((d) => (d.piatti.splice(i, 1), d));
                    }}
                  >
                    Elimina
                  </Mini>
                </div>
              </li>
            ))}
          </ol>
        </Sezione>

        <Sezione titolo="Menù completo" sotto="La card blu in fondo ai piatti.">
          <div className="flex flex-col gap-3">
            <Campo label="Nome" max={LIMITI.nome} value={dati.menu.name}>
              <input className={input} value={dati.menu.name} onChange={(e) => set((d) => ((d.menu.name = e.target.value), d))} />
            </Campo>
            <Campo label="Descrizione" max={LIMITI.desc} value={dati.menu.desc}>
              <input className={input} value={dati.menu.desc} onChange={(e) => set((d) => ((d.menu.desc = e.target.value), d))} />
            </Campo>
            <div className="grid grid-cols-2 gap-3">
              <Prezzo label="Prezzo" value={dati.menu.price} onChange={(v) => set((d) => ((d.menu.price = v), d))} />
            </div>
          </div>
        </Sezione>

        <Sezione
          titolo="Contorni"
          sotto="Tutti allo stesso prezzo."
          azione={
            <Mini
              label="Aggiungi contorno"
              disabled={dati.contorni.items.length >= LIMITI.contorni}
              onClick={() => set((d) => (d.contorni.items.push({ id: nuovoId("contorno"), name: "", img: null }), d))}
            >
              + Contorno
            </Mini>
          }
        >
          <div className="mb-4 grid grid-cols-2 gap-3">
            <Prezzo label="Prezzo dei contorni" value={dati.contorni.price} onChange={(v) => set((d) => ((d.contorni.price = v), d))} />
          </div>
          <ol className="flex flex-col gap-3">
            {dati.contorni.items.map((c, i) => (
              <li key={c.id} className="flex items-start gap-3 rounded-2xl border border-blu-100 p-3">
                <Foto
                  tonda
                  img={c.img}
                  password={password}
                  onErrore={errore}
                  onCarica={onCarica}
                  onChange={(url) => set((d) => ((d.contorni.items[i].img = url), d))}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <Campo label="Nome" max={LIMITI.nome} value={c.name}>
                    <input className={input} value={c.name} onChange={(e) => set((d) => ((d.contorni.items[i].name = e.target.value), d))} />
                  </Campo>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <Mini label="Sposta su" disabled={i === 0} onClick={() => set((d) => ((d.contorni.items = sposta(d.contorni.items, i, -1)), d))}>↑</Mini>
                      <Mini label="Sposta giù" disabled={i === dati.contorni.items.length - 1} onClick={() => set((d) => ((d.contorni.items = sposta(d.contorni.items, i, 1)), d))}>↓</Mini>
                    </div>
                    <Mini
                      danger
                      label="Elimina contorno"
                      onClick={() => {
                        if (window.confirm(`Eliminare «${c.name || "questo contorno"}»?`)) set((d) => (d.contorni.items.splice(i, 1), d));
                      }}
                    >
                      Elimina
                    </Mini>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Sezione>

        <p className="px-1 text-[0.78rem] leading-relaxed text-blu-700">
          Le foto si ritagliano da sole: quelle dei piatti riempiono il riquadro, quelle dei contorni diventano tonde. Meglio
          scattarle dall'alto, con il piatto al centro.
        </p>
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
              ? "Caricamento della foto…"
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
