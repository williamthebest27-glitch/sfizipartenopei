/* Parti comuni delle funzioni della dashboard (/gestione): il banner in
   evidenza della home. Il trattino basso nel nome dice a Vercel che questo
   file non e una funzione a se. */
import { createHash, timingSafeEqual } from "node:crypto";

/* La password sta nella variabile d'ambiente PRANZO_PASSWORD del progetto
   Vercel: il nome e rimasto quello di quando la dashboard gestiva il pranzo,
   per non doverla rifare in tutti e tre gli ambienti (la sezione pranzo e
   stata tolta il 10 novembre 2026). Confronto a tempo
   costante sugli hash, cosi la durata della risposta non dice quanti
   caratteri sono giusti; e una pausa sui tentativi sbagliati, che rende lento
   provare password a raffica. */
export async function autorizzato(request) {
  const attesa = process.env.PRANZO_PASSWORD || "";
  const data = request.headers.get("x-gestione-password") || "";
  const h = (s) => createHash("sha256").update(s).digest();
  const ok = attesa.length > 0 && timingSafeEqual(h(attesa), h(data));
  if (!ok) await new Promise((r) => setTimeout(r, 900));
  return ok;
}

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });

export const negato = () => json({ errore: "Password non valida." }, 401, { "cache-control": "no-store" });
