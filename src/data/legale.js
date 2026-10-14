/* ===========================================================================
   Dati legali — unica fonte per impressum, privacy, cookie e termini
   ---------------------------------------------------------------------------
   Ragione sociale, forma giuridica e sede legale vengono dal registro IDI
   federale (uid.admin.ch, verificato il 14 ottobre 2026): la societa e una
   Sagl con sede in Via al Chioso 30 a Lugano, mentre il banco dove si
   vendono gli sfizi e quello di Viganello (INFO in menu.js). Partita IVA
   attiva dal 23 settembre 2024.

   Se cambia qualcosa (sede, IVA, data dei documenti) si cambia qui e lo
   prendono tutte e quattro le pagine e il pie.
   =========================================================================== */

export const SOCIETA = {
  ragioneSociale: "Sfizi Partenopei Sagl",
  forma: "Società a garanzia limitata (Sagl)",
  sedeVia: "Via al Chioso 30",
  sedeCap: "6900 Lugano",
  paese: "Svizzera",
  iva: "CHE-253.792.754 IVA",
  idi: "CHE-253.792.754",
  registro: "Registro di commercio del Cantone Ticino",
};

export const REALIZZAZIONE = {
  nome: "LyamFlow",
  attivita: "Creazione siti web e gestionali",
  url: "https://lyamflow.com",
  dominio: "lyamflow.com",
};

export const SITO = "www.sfizipartenopeilugano.ch";

/* Data in testa a tutti e quattro i documenti. Va aggiornata quando se ne
   cambia il contenuto, non quando si ritocca la grafica. */
export const AGGIORNATO = "14 ottobre 2026";

/* Le quattro pagine, nell'ordine in cui compaiono nel pie. Gli href sono gli
   indirizzi puliti (cleanUrls su Vercel), come per il resto del sito. */
export const DOCUMENTI = [
  {
    id: "privacy",
    href: "/privacy-policy",
    label: "Privacy policy",
    desc: "Quali dati trattiamo, perché e quali diritti hai.",
  },
  {
    id: "cookie",
    href: "/cookie-policy",
    label: "Cookie policy",
    desc: "Cosa salva il sito nel tuo browser e come scegliere.",
  },
  {
    id: "termini",
    href: "/termini-e-condizioni",
    label: "Termini e condizioni",
    desc: "Ordini, consegna, prezzi e uso del sito.",
  },
  {
    id: "impressum",
    href: "/impressum",
    label: "Impressum",
    desc: "Chi gestisce il sito e chi lo ha realizzato.",
  },
];
