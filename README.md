# Sfizi Partenopei

Sito di [Sfizi Partenopei](https://sfizi-partenopei.vercel.app) — paninoteca e sfizi
fritti napoletani a Viganello (Lugano).

Tre pagine statiche: la home con la vetrina dei prodotti guidata dallo scroll,
`I nostri prodotti` con il listino diviso in pranzo, sfizi e panini, e `Contatti`
col modulo.

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
```

## Aggiungere le foto dei prodotti

Le voci del listino stanno in [`src/data/menu.js`](src/data/menu.js), con nomi e
prezzi presi dal sito del cliente.

1. Metti il PNG ritagliato (sfondo trasparente) in `public/img/prodotti/`
2. Scrivi il nome del file nel campo `img` della voce:
   `img: "img/prodotti/arancino.webp"`

Finché `img` resta `null` la card mostra un marchio di categoria disegnato: non
un buco, e nessuna richiesta che finirebbe 404.

## Pubblicazione

Il sito è su Vercel, progetto `sfizi-partenopei`. Da dentro questa cartella:

```bash
vercel --prod
```

`.env.local` contiene il token OIDC creato da `vercel link` ed è escluso sia dal
repository sia dall'upload: non va mai caricato.

## Da far confermare al cliente

- Il panino **«Cotto, mozzarella e zucchine» (9.00)** non è nel menù del sito
  live: nome e prezzo sono un'ipotesi coerente con gli altri panini.
- I **doppi prezzi del pranzo** (gnocchi 8/12, frittata 9/12): non è chiaro a
  cosa corrispondano i due importi.
- Le **descrizioni dei piatti** sono scritte solo dove il nome definisce il
  piatto; dove servirebbe inventare ingredienti sono lasciate vuote.
- Le zone di consegna: la pagina `/pranzo` del sito live aggiunge **Massagno**,
  le altre no.

---

Sito realizzato da [LyamFlow](https://lyamflow.com).
