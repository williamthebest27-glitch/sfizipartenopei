import { INFO } from "../../data/menu.js";
import { SOCIETA, SITO } from "../../data/legale.js";
import { Esterno, Righe } from "./LegalPage.jsx";

/* ===========================================================================
   Privacy policy
   ---------------------------------------------------------------------------
   Scritta su quello che il sito fa davvero, non su un modello generico:
   hosting Vercel (funzioni a Francoforte), caratteri da Google Fonts, modulo
   contatti che apre il programma di posta (nessun server), mappa disegnata da
   noi, social e Google Maps solo come link. Se cambia uno di questi pezzi,
   va cambiata la sezione corrispondente e la data in data/legale.js.

   Riferimento: Legge federale sulla protezione dei dati (LPD, in vigore dal
   1 settembre 2023) e, per chi visita dall'UE, il RGPD.
   =========================================================================== */

const email = <a href={`mailto:${INFO.email}`}>{INFO.email}</a>;

export default {
  id: "privacy",
  titolo: "Privacy policy",
  script: "i tuoi dati, in chiaro",
  lead: "Quali dati personali trattiamo quando visiti il sito, ci scrivi o ordini da noi, perché lo facciamo, a chi li affidiamo e quali diritti hai.",
  sommario: [
    "Il sito non ha account, non vende online e non usa cookie pubblicitari o di profilazione.",
    "Trattiamo solo i dati che servono a mostrarti il sito, a risponderti e a preparare e consegnare i tuoi ordini.",
    "Non vendiamo e non cediamo i tuoi dati a nessuno.",
    "Puoi chiederci in ogni momento quali dati abbiamo su di te, correggerli o farli cancellare.",
  ],
  sezioni: [
    {
      id: "titolare",
      titolo: "Chi è responsabile dei tuoi dati",
      corpo: (
        <>
          <p>
            Responsabile del trattamento dei dati raccolti attraverso il sito {SITO} e nella nostra attività è:
          </p>
          <Righe
            righe={[
              ["Titolare", SOCIETA.ragioneSociale],
              [
                "Sede legale",
                <>
                  {SOCIETA.sedeVia}, {SOCIETA.sedeCap}, {SOCIETA.paese}
                </>,
              ],
              [
                "Punto vendita",
                <>
                  {INFO.via}, {INFO.cap}
                </>,
              ],
              ["Email", email],
              ["Telefono", <a href={`tel:${INFO.tel}`}>{INFO.telLabel}</a>],
            ]}
          />
          <p>
            Per qualsiasi domanda sulla protezione dei tuoi dati puoi scriverci a {email}. Questa informativa si
            basa sulla Legge federale sulla protezione dei dati (LPD) e, per chi ci visita dall'Unione europea e
            nella misura in cui sia applicabile, sul Regolamento generale sulla protezione dei dati (RGPD).
          </p>
        </>
      ),
    },
    {
      id: "visita",
      titolo: "Quando visiti il sito",
      corpo: (
        <>
          <p>
            Ogni volta che apri una pagina, il tuo browser invia al server alcune informazioni tecniche, che il
            nostro fornitore di hosting registra automaticamente:
          </p>
          <ul>
            <li>indirizzo IP del tuo dispositivo;</li>
            <li>data e ora della richiesta e pagina richiesta;</li>
            <li>pagina da cui arrivi (referrer);</li>
            <li>tipo e versione del browser e del sistema operativo.</li>
          </ul>
          <p>
            Questi dati servono a consegnarti le pagine, a mantenere il sito sicuro e stabile e a riconoscere
            eventuali abusi. Non li usiamo per identificarti, non li incrociamo con altre informazioni e vengono
            cancellati automaticamente dopo un breve periodo, secondo le regole del fornitore.
          </p>
          <p>
            Il menu del pranzo viene caricato dal nostro server quando apri la pagina dei prodotti: è una
            richiesta tecnica come le altre e non raccoglie dati su di te.
          </p>
        </>
      ),
    },
    {
      id: "contatti",
      titolo: "Quando ci contatti",
      corpo: (
        <>
          <p>
            Se ci chiami, ci scrivi un'email o usi il modulo della pagina Contatti, trattiamo i dati che ci
            comunichi: di solito nome e cognome, numero di telefono, indirizzo email e il contenuto del messaggio.
          </p>
          <p>
            <strong>Il modulo di contatto non invia nulla ai nostri server.</strong> Quando premi «Invia», il sito
            prepara un'email con i dati che hai inserito e la apre nel tuo programma di posta: sei tu a spedirla, e
            fino a quel momento non riceviamo niente.
          </p>
          <p>
            Usiamo questi dati solo per risponderti e per gestire la tua richiesta. Le email arrivano su una
            casella Gmail, un servizio di Google (vedi «A chi affidiamo i dati»). Conserviamo la corrispondenza per
            il tempo necessario a chiudere la richiesta, poi la cancelliamo, salvo che la legge ci obblighi a
            tenerla più a lungo.
          </p>
        </>
      ),
    },
    {
      id: "ordini",
      titolo: "Ordini, ritiro e consegna",
      corpo: (
        <>
          <p>
            Quando ordini per telefono o al banco trattiamo i dati necessari a preparare e consegnare l'ordine:
            nome, numero di telefono, indirizzo di consegna, prodotti ordinati ed eventuali indicazioni per il
            fattorino.
          </p>
          <p>
            Se ci comunichi un'allergia o un'intolleranza, usiamo questa informazione soltanto per preparare il tuo
            ordine in modo sicuro e non la registriamo oltre il necessario.
          </p>
          <p>
            I documenti contabili (per esempio le ricevute) vengono conservati per dieci anni, come richiesto dal
            Codice delle obbligazioni. Tutto il resto viene cancellato quando non serve più.
          </p>
          <p>Il sito non accetta ordini né pagamenti online: nessun dato di pagamento passa da qui.</p>
        </>
      ),
    },
    {
      id: "caratteri",
      titolo: "Caratteri tipografici (Google Fonts)",
      corpo: (
        <>
          <p>
            Per mostrare i testi con i caratteri del sito, il tuo browser li scarica dai server di Google Fonts,
            un servizio di Google Ireland Limited (Gordon House, Barrow Street, Dublino 4, Irlanda) e di Google
            LLC (Stati Uniti). Per farlo, Google riceve l'indirizzo IP del tuo dispositivo e le informazioni
            tecniche della richiesta.
          </p>
          <p>
            Google Fonts non imposta cookie. Lo usiamo per un interesse legittimo: mostrare il sito in modo
            uniforme e leggibile su tutti i dispositivi. Maggiori informazioni nella{" "}
            <Esterno href="https://policies.google.com/privacy?hl=it">privacy policy di Google</Esterno>.
          </p>
        </>
      ),
    },
    {
      id: "esterni",
      titolo: "Mappa, social e link esterni",
      corpo: (
        <>
          <p>
            La mappa della pagina Contatti è un'immagine disegnata da noi a partire dai dati di OpenStreetMap e
            caricata dal nostro server: non contatta servizi esterni e non imposta cookie.
          </p>
          <p>
            Google Maps, Instagram e Facebook sono collegati con semplici link, non con contenuti incorporati:
            finché non li clicchi, a questi servizi non arriva nessun dato. Quando li apri, valgono le loro
            regole sulla privacy: quelle di Google per Google Maps e quelle di Meta Platforms Ireland Limited per
            Instagram e Facebook.
          </p>
        </>
      ),
    },
    {
      id: "cookie",
      titolo: "Cookie e memoria del browser",
      corpo: (
        <p>
          Il sito non usa cookie pubblicitari, di profilazione o di terze parti. Salva nel tuo browser solo un paio
          di informazioni tecniche, per esempio le tue scelte sui cookie. L'elenco completo e il modo per cambiare
          le tue scelte sono nella <a href="/cookie-policy">cookie policy</a>.
        </p>
      ),
    },
    {
      id: "destinatari",
      titolo: "A chi affidiamo i dati",
      corpo: (
        <>
          <p>
            Non vendiamo, non affittiamo e non cediamo i tuoi dati. Li trattano per nostro conto, e solo per gli
            scopi descritti qui, questi fornitori:
          </p>
          <ul>
            <li>
              <strong>Vercel Inc.</strong>, 440 N Barranca Avenue #4133, Covina, CA 91723, Stati Uniti: hosting
              del sito. Le pagine sono distribuite da una rete di server in più paesi; le funzioni del server (come
              il menu del pranzo) girano nella regione di Francoforte, in Germania.{" "}
              <Esterno href="https://vercel.com/legal/privacy-policy">Privacy policy di Vercel</Esterno>.
            </li>
            <li>
              <strong>Google</strong> (Google Ireland Limited e Google LLC): caratteri tipografici (Google Fonts) e
              casella di posta elettronica (Gmail).
            </li>
            <li>
              Consulenti esterni, come il fiduciario o il contabile, solo per gli obblighi contabili e fiscali e
              tenuti al segreto professionale.
            </li>
          </ul>
          <p>Comunichiamo dati alle autorità solo quando la legge ce lo impone.</p>
        </>
      ),
    },
    {
      id: "estero",
      titolo: "Dati trasferiti all'estero",
      corpo: (
        <>
          <p>
            Alcuni fornitori trattano dati nell'Unione europea e negli Stati Uniti. L'Unione europea garantisce
            una protezione dei dati che il Consiglio federale riconosce come adeguata.
          </p>
          <p>
            Per gli Stati Uniti, Vercel e Google aderiscono allo Swiss-U.S. Data Privacy Framework, che il
            Consiglio federale riconosce come adeguato dal 15 settembre 2024. Dove questo quadro non si applica,
            il trasferimento si basa sulle clausole contrattuali standard riconosciute dall'Incaricato federale
            della protezione dei dati e della trasparenza (IFPDT).
          </p>
        </>
      ),
    },
    {
      id: "basi",
      titolo: "Su quali basi trattiamo i dati",
      corpo: (
        <>
          <p>
            In Svizzera trattiamo i tuoi dati nel rispetto dei principi della LPD: solo per gli scopi indicati,
            in misura proporzionata e in modo trasparente.
          </p>
          <p>Se il RGPD è applicabile, le basi giuridiche sono:</p>
          <ul>
            <li>
              l'esecuzione di un contratto o di misure precontrattuali (art. 6 par. 1 lett. b RGPD) per ordini e
              richieste;
            </li>
            <li>un obbligo legale (lett. c) per la conservazione dei documenti contabili;</li>
            <li>
              il nostro interesse legittimo (lett. f) per il funzionamento sicuro del sito e la sua presentazione
              grafica;
            </li>
            <li>
              il tuo consenso (lett. a) per eventuali cookie facoltativi, che puoi revocare in qualsiasi momento.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "diritti",
      titolo: "I tuoi diritti",
      corpo: (
        <>
          <p>Nei limiti previsti dalla legge hai il diritto di:</p>
          <ul>
            <li>sapere quali dati personali trattiamo su di te e riceverne una copia (diritto d'accesso);</li>
            <li>far correggere i dati inesatti o incompleti;</li>
            <li>chiederne la cancellazione o opporti al loro trattamento;</li>
            <li>
              ricevere i dati che ci hai fornito in un formato elettronico di uso comune, o farli trasmettere a
              un altro titolare;
            </li>
            <li>revocare un consenso che ci hai dato, senza che questo tocchi il trattamento già avvenuto.</li>
          </ul>
          <p>
            Per esercitarli scrivici a {email}. Per essere sicuri di rispondere alla persona giusta potremmo
            chiederti di dimostrare la tua identità. Rispondiamo di regola entro 30 giorni.
          </p>
          <p>
            Se ritieni che trattiamo i tuoi dati in modo non conforme, puoi rivolgerti all'Incaricato federale
            della protezione dei dati e della trasparenza (IFPDT), Feldeggweg 1, 3003 Berna,{" "}
            <Esterno href="https://www.edoeb.admin.ch">www.edoeb.admin.ch</Esterno>. Se vivi nell'Unione europea
            puoi rivolgerti anche all'autorità di controllo del tuo paese.
          </p>
        </>
      ),
    },
    {
      id: "sicurezza",
      titolo: "Sicurezza",
      corpo: (
        <p>
          Il sito è servito solo tramite connessione cifrata (HTTPS) e l'area di gestione riservata al personale è
          protetta da password. Adottiamo misure tecniche e organizzative adeguate per proteggere i dati da
          perdita, accesso non autorizzato e uso improprio. Non prendiamo decisioni basate unicamente su
          trattamenti automatizzati e non facciamo profilazione.
        </p>
      ),
    },
    {
      id: "modifiche",
      titolo: "Modifiche a questa informativa",
      corpo: (
        <p>
          Possiamo aggiornare questa informativa quando cambiano il sito, i fornitori o la legge. Fa fede sempre la
          versione pubblicata su questa pagina, con la data dell'ultimo aggiornamento indicata in alto.
        </p>
      ),
    },
  ],
};
