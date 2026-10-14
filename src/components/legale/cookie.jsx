import { PulsantePreferenze, Righe, StatoConsenso } from "./LegalPage.jsx";

/* ===========================================================================
   Cookie policy
   ---------------------------------------------------------------------------
   L'elenco qui sotto e l'inventario completo di quello che il sito salva nel
   browser, verificato sul codice: lib/consenso.js, Sipario.jsx e
   PranzoAdmin.jsx. Nessun cookie vero e proprio, solo localStorage e
   sessionStorage. Chi aggiunge uno strumento (statistiche, pixel, mappe
   incorporate) aggiunge qui la sua voce e alza VERSIONE in lib/consenso.js.
   =========================================================================== */

const VOCI = [
  {
    nome: "sfizi:consenso",
    righe: [
      ["Tipo", "Memoria locale del browser (localStorage)"],
      ["A cosa serve", "Ricorda le tue scelte sui cookie, così non te le chiediamo a ogni pagina."],
      ["Durata", "12 mesi, poi te le chiediamo di nuovo"],
      ["Categoria", "Necessario"],
    ],
  },
  {
    nome: "sfizi:sipario-visto",
    righe: [
      ["Tipo", "Memoria di sessione (sessionStorage)"],
      [
        "A cosa serve",
        "Ricorda che hai già visto l'animazione d'apertura della home, per mostrarti la versione breve quando ci torni.",
      ],
      ["Durata", "Fino alla chiusura della scheda"],
      ["Categoria", "Necessario"],
    ],
  },
  {
    nome: "sfizi-pranzo-pw",
    righe: [
      ["Tipo", "Memoria di sessione (sessionStorage)"],
      [
        "A cosa serve",
        "Solo nell'area di gestione riservata al personale: mantiene l'accesso per aggiornare il menu del pranzo. Non viene mai creata per i visitatori.",
      ],
      ["Durata", "Fino alla chiusura della scheda"],
      ["Categoria", "Necessario"],
    ],
  },
];

export default {
  id: "cookie",
  titolo: "Cookie policy",
  script: "solo l'indispensabile",
  lead: "Cosa salva il sito nel tuo browser, a cosa serve e come puoi scegliere. La risposta breve: pochissimo, e niente che serva a seguirti.",
  sommario: [
    "Nessun cookie pubblicitario, di profilazione o di terze parti.",
    "Nel tuo browser salviamo solo due informazioni tecniche: le tue scelte sui cookie e se hai già visto l'animazione d'apertura.",
    "Statistiche e marketing oggi non sono attivi; se li aggiungeremo, partiranno solo con il tuo consenso.",
    "Puoi cambiare le tue scelte quando vuoi, da «Gestisci cookie» in fondo a ogni pagina.",
  ],
  sezioni: [
    {
      id: "cosa-sono",
      titolo: "Cosa sono i cookie",
      corpo: (
        <>
          <p>
            I cookie sono piccoli file di testo che un sito salva nel tuo browser per ricordare qualcosa tra una
            pagina e l'altra. Tecnologie simili, come la memoria locale (localStorage) e la memoria di sessione
            (sessionStorage), fanno la stessa cosa senza essere inviate al server a ogni richiesta.
          </p>
          <p>
            In questa pagina, per semplicità, le chiamiamo tutte «cookie». Questo sito, in realtà, non imposta
            nessun cookie in senso stretto: usa solo la memoria locale e quella di sessione.
          </p>
        </>
      ),
    },
    {
      id: "elenco",
      titolo: "Cosa usa questo sito",
      corpo: (
        <>
          <p>Questo è l'elenco completo di quello che il sito salva nel tuo browser:</p>
          {VOCI.map((v) => (
            <div key={v.nome}>
              <h3>{v.nome}</h3>
              <Righe righe={v.righe} />
            </div>
          ))}
          <p>
            Nessuna di queste informazioni ti identifica, viene inviata ai nostri server o è condivisa con terzi.
            Sono tutte <strong>necessarie</strong>: servono al funzionamento del sito e per questo non richiedono
            il tuo consenso.
          </p>
        </>
      ),
    },
    {
      id: "terze-parti",
      titolo: "Servizi di terze parti",
      corpo: (
        <>
          <p>
            Il sito non contiene contenuti incorporati di terze parti (video, mappe interattive, pulsanti social)
            e nessuna terza parte salva cookie attraverso le nostre pagine.
          </p>
          <p>
            I caratteri tipografici vengono scaricati dai server di Google Fonts: Google riceve così l'indirizzo IP
            del tuo dispositivo, ma non imposta cookie. I dettagli sono nella{" "}
            <a href="/privacy-policy#caratteri">privacy policy</a>.
          </p>
          <p>
            Se segui un link verso Google Maps, Instagram o Facebook, sul loro sito valgono le loro regole sui
            cookie, non le nostre.
          </p>
        </>
      ),
    },
    {
      id: "facoltativi",
      titolo: "Statistiche e marketing",
      corpo: (
        <p>
          Oggi il sito non usa strumenti di statistica né di marketing. Il riquadro delle preferenze ti permette
          comunque di scegliere: se un giorno ne aggiungeremo uno, partirà solo dopo il tuo consenso, lo elencheremo
          in questa pagina e ti chiederemo di nuovo cosa preferisci.
        </p>
      ),
    },
    {
      id: "gestire",
      titolo: "Come gestire le tue scelte",
      corpo: (
        <>
          <StatoConsenso />
          <div className="!mt-6">
            <PulsantePreferenze />
          </div>
          <p className="!mt-6">
            Puoi anche cancellare o bloccare i dati dei siti dalle impostazioni del tuo browser, di solito alla voce
            «Privacy» o «Cookie e dati dei siti». Se blocchi anche quelli necessari il sito continua a funzionare,
            ma il riquadro dei cookie ricomparirà a ogni visita e l'animazione d'apertura sarà sempre quella
            intera.
          </p>
        </>
      ),
    },
    {
      id: "contatti",
      titolo: "Domande e modifiche",
      corpo: (
        <p>
          Per qualsiasi domanda su questa pagina scrivici dalla pagina <a href="/contatti">Contatti</a>. Possiamo
          aggiornare questa cookie policy quando cambia il sito: fa fede la versione pubblicata qui, con la data
          indicata in alto. Il modo in cui trattiamo i dati personali in generale è descritto nella{" "}
          <a href="/privacy-policy">privacy policy</a>.
        </p>
      ),
    },
  ],
};
