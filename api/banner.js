/* /api/banner
   GET  pubblico: il banner in evidenza salvato dal cliente.
        { salvato: false } finche non ha mai salvato: la home usa BANNER_DEFAULT.
   PUT  con la password: salva il banner nuovo, poi fa pulizia.

   Un file sovrascritto su Vercel Blob resta servito vecchio per circa un
   minuto, anche chiedendolo senza cache (misurato). La home legge il
   file fisso (banner/attuale.json, economico), la dashboard con ?fresco=1
   legge l'ultima versione datata (banner/versioni/<data>.json, nome nuovo e
   quindi mai in cache). */
import { get, put, list, del } from "@vercel/blob";
import { pulisciBanner, ErroreBanner } from "../src/data/banner.js";
import { autorizzato, json, negato } from "./_comune.js";

const DATI = "banner/attuale.json";
const FOTO = "banner/foto/";
const VERSIONI = "banner/versioni/";
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
    /* mai salvato: 200 e non 404, perche la home lo chiede a ogni visita e un
       404 finirebbe in rosso nella console di tutti i visitatori */
    return json(dati || { salvato: false }, 200, {
      "cache-control": fresco ? "no-store" : "public, max-age=0, s-maxage=15, stale-while-revalidate=60",
    });
  } catch (e) {
    console.error("lettura banner", e);
    return json({ errore: "Lettura non riuscita." }, 500, { "cache-control": "no-store" });
  }
}

export async function PUT(request) {
  if (!(await autorizzato(request))) return negato();

  let dati;
  try {
    dati = pulisciBanner(await request.json());
  } catch (e) {
    const msg = e instanceof ErroreBanner ? e.message : "Dati non leggibili.";
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

  /* Pulizia, che non deve mai far fallire il salvataggio: le versioni oltre
     le ultime TIENI e le locandine non piu usate con piu di un giorno. */
  try {
    const { blobs: versioni } = await list({ prefix: VERSIONI, limit: 1000 });
    versioni.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
    const vecchie = versioni.slice(TIENI).map((b) => b.url);

    const { blobs: foto } = await list({ prefix: FOTO, limit: 1000 });
    const ieri = Date.now() - 24 * 3600 * 1000;
    const orfane = foto.filter((b) => b.url !== dati.img && new Date(b.uploadedAt).getTime() < ieri).map((b) => b.url);

    if (vecchie.length || orfane.length) await del([...vecchie, ...orfane]);
  } catch (e) {
    console.error("pulizia banner", e);
  }

  return json(salvato, 200, { "cache-control": "no-store" });
}
