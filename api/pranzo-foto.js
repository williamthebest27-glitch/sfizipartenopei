/* /api/pranzo-foto
   POST con la password: riceve una foto gia ridimensionata dalla dashboard
   (lato lungo 1600 px, WebP o JPEG) e la mette nell'archivio sotto
   pranzo/foto/ con un nome casuale. Risponde con l'indirizzo pubblico. */
import { put } from "@vercel/blob";
import { FOTO, autorizzato, json, negato } from "./_comune.js";

const TIPI = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };
const MAX = 4 * 1024 * 1024;

export async function POST(request) {
  if (!(await autorizzato(request))) return negato();

  const tipo = (request.headers.get("content-type") || "").split(";")[0].trim();
  if (!TIPI[tipo]) return json({ errore: "Formato non supportato: usa una foto JPG, PNG o WebP." }, 415);

  const corpo = await request.arrayBuffer();
  if (!corpo.byteLength) return json({ errore: "La foto è vuota." }, 400);
  if (corpo.byteLength > MAX) return json({ errore: "La foto è troppo pesante (massimo 4 MB)." }, 413);

  const blob = await put(`${FOTO}piatto.${TIPI[tipo]}`, corpo, {
    access: "public",
    contentType: tipo,
    addRandomSuffix: true,
    cacheControlMaxAge: 31536000,
  });
  return json({ url: blob.url }, 201, { "cache-control": "no-store" });
}
