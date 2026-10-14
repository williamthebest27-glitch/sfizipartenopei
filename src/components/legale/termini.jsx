import { ALLERGENI, INFO } from "../../data/menu.js";
import { SOCIETA, SITO } from "../../data/legale.js";

/* ===========================================================================
   Termini e condizioni
   ---------------------------------------------------------------------------
   Due cose insieme: le regole d'uso del sito e le condizioni di vendita. Il
   sito e una vetrina (niente carrello, niente pagamenti online): gli ordini
   arrivano per telefono o al banco e si pagano alla consegna o al ritiro.
   Raggio, finestre e zone di consegna vengono da INFO in data/menu.js, cosi
   restano gli stessi del resto del sito.

   Costi di consegna, ordine minimo e mezzi di pagamento non sono scritti di
   proposito: non li conosciamo con certezza e si comunicano al telefono.
   =========================================================================== */

const tel = <a href={`tel:${INFO.tel}`}>{INFO.telLabel}</a>;
const orari = INFO.orari.map((o) => `${o.g} ${o.h}`).join(", ");

export default {
  id: "termini",
  titolo: "Termini e condizioni",
  script: "le regole del banco",
  lead: "Le condizioni che valgono quando usi il sito e quando ordini da noi, per telefono o al banco.",
  sommario: [
    "Il sito è una vetrina: non si ordina e non si paga online.",
    "Gli ordini si fanno per telefono o al banco e si pagano al ritiro o alla consegna.",
    `Consegniamo entro ${INFO.consegna.raggio} da Viganello, negli orari indicati.`,
    "I prezzi sono in franchi svizzeri, IVA inclusa.",
  ],
  sezioni: [
    {
      id: "ambito",
      titolo: "Chi siamo e a cosa si applicano",
      corpo: (
        <>
          <p>
            Questi termini regolano l'uso del sito {SITO} e la vendita dei prodotti di{" "}
            <strong>{SOCIETA.ragioneSociale}</strong>, {SOCIETA.sedeVia}, {SOCIETA.sedeCap} (i dati completi sono
            nell'<a href="/impressum">impressum</a>), a chi ordina per telefono o al banco del nostro punto vendita
            in {INFO.via}, {INFO.cap}.
          </p>
          <p>
            Usando il sito o facendo un ordine accetti questi termini. Restano sempre salve le norme imperative a
            tutela dei consumatori.
          </p>
        </>
      ),
    },
    {
      id: "sito",
      titolo: "Il sito",
      corpo: (
        <>
          <p>
            Il sito ha uno scopo informativo: presenta i nostri prodotti, i prezzi, gli orari e i modi per
            contattarci. Non è possibile ordinare né pagare online.
          </p>
          <p>
            Il modulo della pagina Contatti non invia messaggi da sé: prepara un'email che parte dal tuo
            programma di posta. Una richiesta inviata così non vale come ordine.
          </p>
          <p>
            Curiamo i contenuti con attenzione, ma menu, prezzi, orari e immagini possono cambiare senza preavviso
            e non possiamo garantire che il sito sia sempre aggiornato, completo o raggiungibile.
          </p>
        </>
      ),
    },
    {
      id: "prezzi",
      titolo: "Prodotti, prezzi e disponibilità",
      corpo: (
        <>
          <p>
            Tutti i prezzi sono espressi in franchi svizzeri (CHF) e comprendono l'IVA. Vale il prezzo in vigore al
            momento dell'ordine, che ti confermiamo al telefono o al banco.
          </p>
          <p>
            Il menu del pranzo cambia di giorno in giorno ed è servito fino a esaurimento. Anche sfizi, panini e
            bevande dipendono dalla disponibilità del momento.
          </p>
          <p>
            Le fotografie e le immagini hanno scopo illustrativo: aspetto, dimensioni e presentazione del prodotto
            servito possono essere diversi. Errori evidenti di battitura o di prezzo non ci vincolano.
          </p>
        </>
      ),
    },
    {
      id: "ordini",
      titolo: "Come si ordina",
      corpo: (
        <>
          <p>
            Puoi ordinare per telefono al {tel} oppure direttamente al banco, negli orari di apertura ({orari}).
          </p>
          <p>
            Il contratto si conclude quando confermiamo il tuo ordine a voce. Al telefono ti chiediamo nome,
            numero di telefono e, per la consegna, l'indirizzo completo: controlla che siano corretti. Se hai
            allergie o intolleranze, diccelo al momento dell'ordine.
          </p>
          <p>
            Possiamo rifiutare un ordine, per esempio se l'indirizzo è fuori dalla zona di consegna, se un
            prodotto è esaurito o se nei momenti di punta non riusciamo a garantire i tempi.
          </p>
        </>
      ),
    },
    {
      id: "consegna",
      titolo: "Consegna a domicilio",
      corpo: (
        <>
          <p>
            Consegniamo entro un raggio di {INFO.consegna.raggio} dal nostro banco di Viganello, nelle fasce{" "}
            {INFO.consegna.finestre.join(" e ")}. Le zone servite sono: {INFO.consegna.zone.join(", ")}. Per
            indirizzi al limite della zona chiedici al telefono.
          </p>
          <p>
            Eventuali costi di consegna o importi minimi d'ordine ti vengono comunicati prima della conferma.
          </p>
          <p>
            L'orario di consegna che ti indichiamo è una stima: traffico, meteo e momenti di punta possono
            causare ritardi, che ti segnaliamo quando possibile. Assicurati di essere raggiungibile al numero che
            ci hai dato e presente all'indirizzo indicato. Se non troviamo nessuno e non riusciamo a contattarti,
            possiamo chiederti di pagare comunque l'ordine, perché il cibo preparato non può essere rivenduto.
          </p>
        </>
      ),
    },
    {
      id: "ritiro",
      titolo: "Ritiro al banco",
      corpo: (
        <p>
          Se scegli il ritiro, l'ordine ti aspetta al banco di {INFO.via}, {INFO.cap}, all'ora concordata. Il
          fritto è preparato al momento e dà il meglio di sé appena fatto: ti consigliamo di passare puntuale e di
          consumarlo presto.
        </p>
      ),
    },
    {
      id: "pagamento",
      titolo: "Pagamento",
      corpo: (
        <p>
          Paghi al momento del ritiro o della consegna, con i mezzi di pagamento accettati dal punto vendita, che
          ti indichiamo quando ordini. Il sito non raccoglie né elabora dati di pagamento.
        </p>
      ),
    },
    {
      id: "annullamento",
      titolo: "Modifiche e annullamenti",
      corpo: (
        <>
          <p>
            Se vuoi modificare o annullare un ordine, chiamaci al {tel} il prima possibile. Finché non abbiamo
            iniziato a prepararlo lo facciamo senza problemi; dopo, potrebbe non essere più possibile.
          </p>
          <p>
            Gli ordini partono da una tua richiesta e riguardano cibo preparato al momento: per questo non è
            previsto un diritto di revoca.
          </p>
        </>
      ),
    },
    {
      id: "allergeni",
      titolo: "Allergeni e intolleranze",
      corpo: (
        <>
          <p>{ALLERGENI}</p>
          <p>
            Le informazioni sugli allergeni presenti in ogni prodotto sono disponibili su richiesta, al banco o
            per telefono, prima dell'ordine. In cucina lavoriamo diversi ingredienti negli stessi spazi: non
            possiamo quindi escludere la presenza di tracce di allergeni in nessun prodotto.
          </p>
        </>
      ),
    },
    {
      id: "reclami",
      titolo: "Se qualcosa non va",
      corpo: (
        <p>
          Se un ordine non è come dovrebbe (un prodotto mancante, uno sbagliato) avvisaci subito, possibilmente lo
          stesso giorno, al {tel}. Troveremo insieme una soluzione, per esempio sostituendo il prodotto o
          rimborsandone il prezzo.
        </p>
      ),
    },
    {
      id: "responsabilita",
      titolo: "Responsabilità",
      corpo: (
        <>
          <p>
            Nei limiti consentiti dalla legge, rispondiamo solo dei danni causati intenzionalmente o per
            negligenza grave. Non rispondiamo di ritardi o mancate consegne dovuti a cause che non dipendono da
            noi, come traffico, condizioni meteo eccezionali o guasti, né di danni derivanti dall'uso del sito o
            dalla sua temporanea indisponibilità.
          </p>
          <p>Resta salva la responsabilità imperativa prevista dalla legge, in particolare per danno da prodotti.</p>
        </>
      ),
    },
    {
      id: "proprieta",
      titolo: "Proprietà intellettuale",
      corpo: (
        <p>
          Marchio, logo, testi, fotografie e grafica del sito appartengono a {SOCIETA.ragioneSociale} o ai
          rispettivi titolari. Non possono essere copiati, modificati o usati, in tutto o in parte, senza il nostro
          consenso scritto.
        </p>
      ),
    },
    {
      id: "dati",
      titolo: "Protezione dei dati",
      corpo: (
        <p>
          Il modo in cui trattiamo i tuoi dati personali è descritto nella{" "}
          <a href="/privacy-policy">privacy policy</a>; quello che il sito salva nel tuo browser nella{" "}
          <a href="/cookie-policy">cookie policy</a>.
        </p>
      ),
    },
    {
      id: "foro",
      titolo: "Diritto applicabile e foro",
      corpo: (
        <p>
          Questi termini e ogni ordine sono regolati esclusivamente dal diritto svizzero, con esclusione della
          Convenzione di Vienna sulla vendita internazionale di merci. Il foro competente è Lugano, fatti salvi i
          fori imperativi previsti dalla legge a favore dei consumatori.
        </p>
      ),
    },
    {
      id: "modifiche",
      titolo: "Modifiche",
      corpo: (
        <p>
          Possiamo aggiornare questi termini in qualsiasi momento. A ogni ordine si applica la versione pubblicata
          su questa pagina nel momento in cui lo fai.
        </p>
      ),
    },
  ],
};
