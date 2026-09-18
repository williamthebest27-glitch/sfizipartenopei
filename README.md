# Sfizi Partenopei

Sito di [Sfizi Partenopei](https://sfizi-partenopei.vercel.app) — paninoteca e sfizi
fritti napoletani a Viganello (Lugano).

Tre pagine statiche: la home con il sipario d'ingresso e la vetrina dei prodotti
guidata dallo scroll, `I nostri prodotti` con il listino diviso in pranzo, sfizi,
panini (con i panini menù) e bevande, e `Contatti` col modulo.

## Stack

React 18 + Vite 6 + Tailwind CSS 4 + GSAP (ScrollTrigger). Nessun router: le tre
pagine sono tre ingressi HTML separati, dichiarati in `vite.config.js`, quindi
ogni pagina resta un file statico vero e non serve configurare rewrite
sull'hosting.

## Sviluppo

```bash
npm install
npm run dev     # http://localhost:5174
npm run build   # esce in dist/
npm run preview # la build vera, http://localhost:4174
```

In sviluppo React monta gli effetti due volte (StrictMode) e GSAP puo lasciare
sui prodotti della vetrina una translate residua che li sposta in alto: **e un
artefatto dello sviluppo**, sulla build non succede. Se qualcosa sembra fuori
posto nella vetrina, guardalo con `npm run preview` prima di inseguirlo.

## Il sipario (preloader della home)

`src/components/Sipario.jsx`. Il marchio del cliente si scrive da solo su fondo
blu — la linea del Vesuvio, le lettere di SFIZI, il fritto, il puntino,
PARTENOPEI — poi parte verso lo spettatore e si dissolve mentre dietro entra la
hero. Circa tre secondi in tutto, e si salta con un clic, un tasto o una
rotellata.

- Il marchio e **vettoriale** (`src/components/Marchio.jsx`), vettorializzato da
  `public/img/logo.webp`: resta nitido ingrandito nove volte, si smonta nei suoi
  pezzi e non dipende da nessuna richiesta di rete.
- Aspetta davvero che il sito sia pronto (font + `window.load`, con un tetto di
  4 secondi): e un preloader, non un'animazione a tempo.
- Chi lo ha gia visto in quella scheda trova la versione corta (solo il balzo
  finale). Per rivederlo intero: scheda nuova, oppure `SEMPRE_INTERA = true` in
  cima a `Sipario.jsx`.
- Le entrate di hero e testata aspettano il suo via (`src/lib/intro.js`): senza,
  si consumerebbero dietro al telo. Le pagine interne non hanno sipario e
  partono subito.
- Con `prefers-reduced-motion` niente balzo: il marchio compare e il telo si
  dissolve.

## Aggiungere le foto dei prodotti

Le voci del listino stanno in [`src/data/menu.js`](src/data/menu.js), con nomi e
prezzi presi dal sito del cliente.

1. Metti il file in `public/img/prodotti/`, **scontornato** (sfondo
   trasparente): le card hanno il fondo azzurro con una macchia sfumata, e un
   rettangolo bianco appiccicato sopra si vede.
2. Scrivi il nome del file nei campi `img` e `imgSm` della voce:
   `img: "img/prodotti/arancino.webp"`.

Finché `img` resta `null` la card mostra un marchio di categoria disegnato: non
un buco, e nessuna richiesta che finirebbe 404.

Le foto attuali vengono dalla cartella del cliente
(`Desktop\William\Clienti siti web\Sfizi`): scatti da catalogo su fondo bianco,
scontornati automaticamente e convertiti in WebP 1200w + 680w. Lo scontorno
prende il **minimo** dei tre canali RGB, non la media: il fondo bianco ha tutti
e tre i canali alti, un pane dorato no, ed e l'unico modo perche i pani chiari e
le patate non vengano ritagliati via a morsi.

## Pubblicazione

Il sito è su Vercel, progetto `sfizi-partenopei`, collegato a questo
repository: **ogni push su `main` va in produzione da solo**.

Per pubblicare a mano senza passare da un commit, da dentro questa cartella:

```bash
vercel --prod
```

`.env.local` contiene il token OIDC creato da `vercel link` ed è escluso sia dal
repository sia dall'upload: non va mai caricato.

## Da far confermare al cliente

- **Porchetta di Ariccia e provola**: le due foto che erano nella cartella
  (`ariccia provola.jpg` e `ariccia provola + bevande.jpg`) sono uno stock
  **Alamy con la filigrana addosso**, quindi non si possono pubblicare. È
  l'unico panino senza fotografia: serve uno scatto vero.
- **Coca Cola Zero**: in carta è 33 cl, la foto disponibile è la bottiglia da
  0.5 l.
- **Valser**: il sito live scrive «Walser», le bottiglie dicono VALSER. Qui è
  scritto Valser.
- **Panini menù**: sul sito del cliente c'è solo il prezzo (15.00). Che siano
  «panino, patatine e bibita» è quello che si vede nelle fotografie che ha
  mandato lui.
- I **doppi prezzi del pranzo** (gnocchi 8/12, frittata 9/12): non è chiaro a
  cosa corrispondano i due importi.
- I **contorni** sono una card sola a 5.00; sul sito live sono sette voci
  separate (melanzane grigliate, carciofini, friarielli, funghi, melanzane a
  funghetti, zucchine alla scapece, patate al forno), tutte a 5.00.
- Le **descrizioni dei piatti** sono scritte solo dove il nome definisce il
  piatto; dove servirebbe inventare ingredienti sono lasciate vuote.
- Le zone di consegna: la pagina `/pranzo` del sito live aggiunge **Massagno**,
  le altre no.

---

Sito realizzato da [LyamFlow](https://lyamflow.com).
