/* /api/pranzo-accesso
   POST: controlla la password della dashboard senza salvare niente. */
import { autorizzato, json, negato } from "./_comune.js";

export async function POST(request) {
  if (!(await autorizzato(request))) return negato();
  return json({ ok: true }, 200, { "cache-control": "no-store" });
}
