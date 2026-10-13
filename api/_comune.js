/* Parti comuni delle funzioni della dashboard pranzo. Il trattino basso nel
   nome dice a Vercel che questo file non e una funzione a se. */
import { createHash, timingSafeEqual } from "node:crypto";

export const DATI = "pranzo/menu.json";
export const FOTO = "pranzo/foto/";

/* La password sta nella variabile d'ambiente PRANZO_PASSWORD del progetto
   Vercel. Confronto a tempo costante sugli hash, cosi la durata della
   risposta non dice quanti caratteri sono giusti; e una pausa sui tentativi
   sbagliati, che rende lento provare password a raffica. */
export async function autorizzato(request) {
  const attesa = process.env.PRANZO_PASSWORD || "";
  const data = request.headers.get("x-pranzo-password") || "";
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
