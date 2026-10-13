/* ===========================================================================
   La sezione Pranzo: contenuti modificabili dal cliente
   ---------------------------------------------------------------------------
   Il pranzo cambia spesso (piatti, prezzi, foto) e il cliente lo aggiorna da
   solo dalla pagina gestione-pranzo.html. Il salvataggio finisce in un file
   JSON su Vercel Blob (pranzo/menu.json) e la pagina prodotti lo legge da
   /api/pranzo all'apertura.

   PRANZO_DEFAULT e il contenuto di partenza: lo mostra il sito finche il
   cliente non ha mai salvato, o se la lettura fallisce. pulisciPranzo() e la
   stessa validazione per il server (che la applica prima di salvare) e per la
   dashboard (che la applica prima di inviare): niente testi troppo lunghi,
   prezzi sempre scritti "8.00", foto solo dal nostro archivio.
   =========================================================================== */

export const PRANZO_DEFAULT = {
  lead: "Primi e secondi serviti a mezzogiorno, finché ci sono. Il menù completo mette insieme il primo e la bibita.",
  piatti: [
    {
      id: "gnocchi-sorrentina",
      name: "Gnocchi alla sorrentina",
      desc: "Gnocchi al pomodoro gratinati con la mozzarella.",
      price: "8.00",
      price2: "12.00",
      img: null,
    },
    {
      id: "frittata-maccheroni",
      name: "Frittata di maccheroni",
      desc: "Pasta legata e rosolata in padella, tagliata a fette.",
      price: "9.00",
      price2: "12.00",
      img: null,
    },
    { id: "ruotino-boscaiola", name: "Ruotino alla boscaiola", desc: "", price: "7.00", price2: "", img: null },
    { id: "ruotino-friarielli", name: "Ruotino salsiccia e friarielli", desc: "", price: "7.00", price2: "", img: null },
  ],
  menu: {
    name: "Menù completo",
    desc: "Un primo a scelta piu la bibita.",
    price: "10.00",
  },
  /* Le foto dei contorni sono le teglie del banco ritagliate in ciotola
     (script ciotole.py). Quelle caricate dal cliente sono foto normali: la
     pagina le ritaglia a cerchio da sola. */
  contorni: {
    price: "5.00",
    items: [
      { id: "melanzane-grigliate", name: "Melanzane grigliate sott'olio", img: "img/prodotti/contorno-melanzane-grigliate.webp" },
      { id: "carciofini", name: "Carciofini grigliati sott'olio", img: "img/prodotti/contorno-carciofini.webp" },
      { id: "friarielli", name: "Friarielli", img: "img/prodotti/contorno-friarielli.webp" },
      { id: "funghi", name: "Funghi", img: "img/prodotti/contorno-funghi.webp" },
      { id: "melanzane-funghetti", name: "Melanzane funghetti", img: "img/prodotti/contorno-melanzane-funghetti.webp" },
      { id: "zucchine-scapece", name: "Zucchine alla scapece", img: "img/prodotti/contorno-zucchine-scapece.webp" },
      { id: "patate-forno", name: "Patate al forno", img: "img/prodotti/contorno-patate-forno.webp" },
    ],
  },
};

/* Limiti: abbastanza larghi per un menu vero, abbastanza stretti perche un
   errore di battitura non rompa l'impaginazione. */
export const LIMITI = {
  lead: 300,
  nome: 80,
  desc: 280,
  piatti: 24,
  contorni: 24,
};

/* Le foto ammesse: quelle gia nel sito (img/prodotti/...) e quelle caricate
   dal cliente nell'archivio Blob del progetto, sotto pranzo/foto/. */
const FOTO_SITO = /^img\/prodotti\/[a-z0-9-]+\.webp$/;
const FOTO_ARCHIVIO = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/pranzo\/foto\/[A-Za-z0-9._-]+$/;

/* Una foto caricata dal cliente e una foto vera (col suo sfondo), non un
   prodotto scontornato: la pagina la mostra a tutto riquadro. */
export const isFotoCaricata = (img) => typeof img === "string" && FOTO_ARCHIVIO.test(img);

/* La versione piccola esiste solo per le foto del sito. */
export const fotoPiccola = (img) =>
  typeof img === "string" && FOTO_SITO.test(img) ? img.replace(/\.webp$/, "-sm.webp") : null;

export class ErroreDati extends Error {}

const testo = (v, max, campo, obbligatorio = false) => {
  const s = typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";
  if (obbligatorio && !s) throw new ErroreDati(`Manca ${campo}.`);
  if (s.length > max) throw new ErroreDati(`${campo} è troppo lungo (massimo ${max} caratteri).`);
  return s;
};

/* "8", "8.5", "8,50", "CHF 8.50" -> "8.00", "8.50". Vuoto ammesso solo per
   il secondo prezzo. */
export function prezzo(v, campo, obbligatorio = true) {
  const s = typeof v === "string" || typeof v === "number" ? String(v).replace(/chf/i, "").trim() : "";
  if (!s) {
    if (obbligatorio) throw new ErroreDati(`Manca il prezzo di ${campo}.`);
    return "";
  }
  const n = Number(s.replace(",", "."));
  if (!Number.isFinite(n) || n <= 0 || n >= 1000)
    throw new ErroreDati(`Il prezzo di ${campo} non è valido: scrivi per esempio 8.50`);
  return n.toFixed(2);
}

const foto = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "string" && (FOTO_SITO.test(v) || FOTO_ARCHIVIO.test(v))) return v;
  throw new ErroreDati("Una delle foto non viene dal nostro archivio.");
};

const ident = (v, i, pref) => {
  const s = typeof v === "string" ? v : "";
  return /^[a-z0-9-]{1,40}$/.test(s) ? s : `${pref}-${i + 1}`;
};

export function pulisciPranzo(d) {
  if (!d || typeof d !== "object") throw new ErroreDati("Dati mancanti.");
  const piatti = Array.isArray(d.piatti) ? d.piatti : [];
  const contorni = d.contorni && Array.isArray(d.contorni.items) ? d.contorni.items : [];
  if (piatti.length > LIMITI.piatti) throw new ErroreDati(`Al massimo ${LIMITI.piatti} piatti.`);
  if (contorni.length > LIMITI.contorni) throw new ErroreDati(`Al massimo ${LIMITI.contorni} contorni.`);

  const visti = new Set();
  const unico = (id) => {
    let u = id;
    for (let k = 2; visti.has(u); k++) u = `${id}-${k}`;
    visti.add(u);
    return u;
  };

  return {
    lead: testo(d.lead, LIMITI.lead, "Il testo della sezione"),
    piatti: piatti.map((p, i) => {
      const name = testo(p?.name, LIMITI.nome, `il nome del piatto ${i + 1}`, true);
      return {
        id: unico(ident(p?.id, i, "piatto")),
        name,
        desc: testo(p?.desc, LIMITI.desc, `La descrizione di «${name}»`),
        price: prezzo(p?.price, `«${name}»`),
        price2: prezzo(p?.price2, `«${name}» (secondo prezzo)`, false),
        img: foto(p?.img),
      };
    }),
    menu: {
      name: testo(d.menu?.name, LIMITI.nome, "il nome del menù completo", true),
      desc: testo(d.menu?.desc, LIMITI.desc, "La descrizione del menù completo"),
      price: prezzo(d.menu?.price, "menù completo"),
    },
    contorni: {
      price: prezzo(d.contorni?.price, "contorni"),
      items: contorni.map((c, i) => ({
        id: unico(ident(c?.id, i, "contorno")),
        name: testo(c?.name, LIMITI.nome, `il nome del contorno ${i + 1}`, true),
        img: foto(c?.img),
      })),
    },
  };
}
