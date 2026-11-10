/* ===========================================================================
   Il banner in evidenza: una locandina a tutto schermo sulla home
   ---------------------------------------------------------------------------
   Eventi, offerte, chiusure per ferie: il cliente carica una locandina dalla
   dashboard (/gestione) e la home la mostra a tutto schermo appena si alza il
   sipario, una volta per visita. Il salvataggio finisce su Vercel Blob
   (banner/attuale.json) e la home lo legge da /api/banner.

   BANNER_DEFAULT e il banner di partenza: lo mostra il sito finche il cliente
   non ha mai salvato (l'API risponde 404). La locandina sta nel repository,
   in public/img/eventi/. Dopo la data «fino» si spegne da solo.

   pulisciBanner() e la stessa validazione per il server (prima di salvare) e
   per la dashboard (prima di inviare).
   =========================================================================== */

export const BANNER_DEFAULT = {
  attivo: true,
  img: "img/eventi/aperitivo-natale-2026.webp",
  w: 1179,
  h: 1565,
  /* la locandina rimpicciolita a 24 px: e lo sfondo sfocato dietro, e c'e
     subito, anche prima che arrivi l'immagine vera */
  anteprima:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAgABgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwBuhQILR/MWN5G5LMOVHpk8ehyOuevFXr62tpbZo2I3EZX96cE9sA55/Ks1hLDNJAyQZEhYOVLAMeeWI9B+lXG0vUJUS5aa3O4jGwA+hz09R1rijUfI4p7nqvDxTjKfQw9Vs4rXDLgQ+XjcoJwyjHQf3u5NFb82j6lcKFNxbGKRh5ibQGC9ew4/OioV4qzE1T2X9fiinPa3cLAF0KD5iN5LRbjnacDJ69P8K6K1Ma6XAI2ZwigHcMHIznjt9KxIbi1vdLWKfUZInkOWK7VJOfpzT/MMAkXzHMaLtTDBV2kdTjHv1JNY063s5XsaVIOrDluboLLG5+0LBGX3NubaW4z+NFcxepBqVk0rXMJyvBHJTHoAO/r70Vs6jm77GKg4aLX+vM//2Q==",
  titolo: "Aperitivo di Natale",
  descrizione:
    "Aperitivo di Natale: 10 Fr. a persona, offerta valida fino al 23 dicembre. Avrete 3 zeppoline, 1 crocchè, 1 panino napoletano, 1 pizzetta margherita, 1 calzoncino fritto e 1 hot dog in formato mignon, più 1 graffetta dolce.",
  fino: "2026-12-23",
  chiama: true,
};

/* Il banner spento, da cui parte la dashboard quando il cliente lo toglie. */
export const BANNER_VUOTO = {
  attivo: false,
  img: null,
  w: 0,
  h: 0,
  anteprima: "",
  titolo: "",
  descrizione: "",
  fino: "",
  chiama: true,
};

export const LIMITI_BANNER = {
  titolo: 80,
  descrizione: 400,
  anteprima: 8000,
};

/* Le locandine ammesse: quelle nel sito (img/eventi/...) e quelle caricate
   dal cliente nell'archivio Blob del progetto, sotto banner/foto/. */
const FOTO_SITO = /^img\/eventi\/[a-z0-9-]+\.(webp|jpg)$/;
const FOTO_ARCHIVIO = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/banner\/foto\/[A-Za-z0-9._-]+$/;
const ANTEPRIMA = /^data:image\/(jpeg|webp|png);base64,[A-Za-z0-9+/=]+$/;
const DATA = /^\d{4}-\d{2}-\d{2}$/;

/* Oggi a Lugano, come "2026-12-23": il banner scade a mezzanotte svizzera,
   non a quella del telefono di chi guarda. */
export function oggiALugano(quando = new Date()) {
  try {
    return quando.toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });
  } catch {
    return quando.toISOString().slice(0, 10);
  }
}

export const scaduto = (b, oggi = oggiALugano()) => Boolean(b?.fino) && b.fino < oggi;

/* Da mostrare: acceso, con una locandina, non scaduto. */
export const bannerVisibile = (b) => Boolean(b && b.attivo && b.img && !scaduto(b));

/* "2026-12-23" -> "23 dicembre 2026" */
export function dataLeggibile(iso) {
  if (!iso || !DATA.test(iso)) return "";
  const [a, m, g] = iso.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, g)).toLocaleDateString("it-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export class ErroreBanner extends Error {}

const testo = (v, max, campo, obbligatorio = false) => {
  const s = typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";
  if (obbligatorio && !s) throw new ErroreBanner(`Manca ${campo}.`);
  if (s.length > max) throw new ErroreBanner(`${campo} è troppo lungo (massimo ${max} caratteri).`);
  return s;
};

const lato = (v) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n > 0 && n <= 10000 ? n : 0;
};

export function pulisciBanner(d) {
  if (!d || typeof d !== "object") throw new ErroreBanner("Dati del banner mancanti.");

  let img = null;
  if (d.img !== null && d.img !== undefined && d.img !== "") {
    if (typeof d.img !== "string" || !(FOTO_SITO.test(d.img) || FOTO_ARCHIVIO.test(d.img)))
      throw new ErroreBanner("La locandina non viene dal nostro archivio.");
    img = d.img;
  }

  const attivo = Boolean(d.attivo);
  if (attivo && !img) throw new ErroreBanner("Carica una locandina, oppure spegni il banner.");

  const w = img ? lato(d.w) : 0;
  const h = img ? lato(d.h) : 0;
  if (img && (!w || !h)) throw new ErroreBanner("Non conosco le misure della locandina: caricala di nuovo.");

  const anteprima = img && typeof d.anteprima === "string" ? d.anteprima : "";
  if (anteprima && (anteprima.length > LIMITI_BANNER.anteprima || !ANTEPRIMA.test(anteprima)))
    throw new ErroreBanner("L'anteprima della locandina non è valida: caricala di nuovo.");

  const fino = typeof d.fino === "string" ? d.fino.trim() : "";
  if (fino && (!DATA.test(fino) || Number.isNaN(Date.parse(`${fino}T00:00:00Z`))))
    throw new ErroreBanner("La data di fine non è valida.");

  return {
    attivo,
    img,
    w,
    h,
    anteprima,
    titolo: testo(d.titolo, LIMITI_BANNER.titolo, "il titolo del banner", Boolean(img)),
    descrizione: testo(d.descrizione, LIMITI_BANNER.descrizione, "La descrizione della locandina"),
    fino,
    chiama: d.chiama !== false,
  };
}
