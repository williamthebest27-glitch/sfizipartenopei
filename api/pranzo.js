/* /api/pranzo
   GET  pubblico: i contenuti della sezione pranzo salvati dal cliente.
        404 finche non ha mai salvato: la pagina usa quelli di partenza.
   PUT  con la password: salva i contenuti nuovi, poi fa pulizia.

   Perche due copie a ogni salvataggio. Un file sovrascritto su Vercel Blob
   (pranzo/menu.json) per circa un minuto viene ancora servito nella versione
   vecchia, anche chiedendolo senza cache: misurato. Per il sito va bene, un
   minuto di ritardo non lo nota nessuno, e leggere un file fisso costa poco.
   Per la dashboard no: chi salva e ricarica la pagina deve ritrovare quello
   che ha appena scritto. Quindi ogni salvataggio scrive anche una versione
   datata, con un nome nuovo che non e mai stato in cache
   (pranzo/versioni/<data>.json), e la dashboard (?fresco=1) legge l'ultima di
   quelle. Le versioni fanno anche da storico: se ne tengono le ultime 30. */
import { get, put, list, del } from "@vercel/blob";
import { pulisciPranzo, ErroreDati } from "../src/data/pranzo.js";
import { DATI, FOTO, autorizzato, json, negato } from "./_comune.js";

const VERSIONI = "pranzo/versioni/";
const TIENI = 30;

async function ultimaVersione() {
  const { blobs } = await list({ prefix: VERSIONI, limit: 1000 });
  if (!blobs.length) return null;
  blobs.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
  const r = await fetch(blobs[0].url);
  return r.ok ? r.json() : null;
}

async function fileFisso() {
  const r = await get(DATI, { access: "public", useCache: false });
  if (!r || !r.stream) return null;
  return JSON.parse(await new Response(r.stream).text());
}

export async function GET(request) {
  const fresco = new URL(request.url).searchParams.has("fresco");
  try {
    const dati = (fresco && (await ultimaVersione())) || (await fileFisso());
    if (!dati) return json({ errore: "Nessun contenuto salvato." }, 404, { "cache-control": "no-store" });
    /* il sito accetta qualche secondo di ritardo in cambio della velocita:
       la risposta resta in cache sul CDN per 15 secondi */
    return json(dati, 200, {
      "cache-control": fresco ? "no-store" : "public, max-age=0, s-maxage=15, stale-while-revalidate=60",
    });
  } catch (e) {
    console.error("lettura pranzo", e);
    return json({ errore: "Lettura non riuscita." }, 500, { "cache-control": "no-store" });
  }
}

export async function PUT(request) {
  if (!(await autorizzato(request))) return negato();

  let dati;
  try {
    dati = pulisciPranzo(await request.json());
  } catch (e) {
    const msg = e instanceof ErroreDati ? e.message : "Dati non leggibili.";
    return json({ errore: msg }, 400);
  }

  const ora = new Date().toISOString();
  const salvato = { ...dati, aggiornato: ora };
  const corpo = JSON.stringify(salvato);
  const tipo = "application/json; charset=utf-8";

  await put(`${VERSIONI}${ora.replace(/[:.]/g, "-")}.json`, corpo, {
    access: "public",
    contentType: tipo,
    addRandomSuffix: false,
    cacheControlMaxAge: 31536000,
  });
  await put(DATI, corpo, {
    access: "public",
    contentType: tipo,
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });

  /* Pulizia, che non deve mai far fallire il salvataggio:
     - le versioni oltre le ultime TIENI;
     - le foto caricate e poi sostituite o tolte, se hanno piu di un giorno
       (cosi una foto appena caricata in un'altra scheda aperta non sparisce
       prima del suo salvataggio). */
  try {
    const { blobs: versioni } = await list({ prefix: VERSIONI, limit: 1000 });
    versioni.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
    const vecchie = versioni.slice(TIENI).map((b) => b.url);

    const usate = new Set([...dati.piatti.map((p) => p.img), ...dati.contorni.items.map((c) => c.img)]);
    const { blobs: foto } = await list({ prefix: FOTO, limit: 1000 });
    const ieri = Date.now() - 24 * 3600 * 1000;
    const orfane = foto.filter((b) => !usate.has(b.url) && new Date(b.uploadedAt).getTime() < ieri).map((b) => b.url);

    if (vecchie.length || orfane.length) await del([...vecchie, ...orfane]);
  } catch (e) {
    console.error("pulizia pranzo", e);
  }

  return json(salvato, 200, { "cache-control": "no-store" });
}
