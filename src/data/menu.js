/* ===========================================================================
   Il menu vero di Sfizi Partenopei
   ---------------------------------------------------------------------------
   Nomi e prezzi presi dal sito live del cliente, non inventati. I prezzi sono
   in franchi svizzeri.

   COME AGGIUNGERE LE FOTO
   Metti il PNG ritagliato (sfondo trasparente) in `react/public/img/prodotti/`
   e scrivi il nome del file nel campo `img` della voce corrispondente, per
   esempio  img: "img/prodotti/arancino.webp".
   Finche `img` resta null la card mostra un segnaposto disegnato, non un buco:
   nessuna richiesta fallita e nessun errore in console.

   Le descrizioni sono volutamente brevi e solo definitorie (dicono cos'e il
   piatto, non ingredienti che non mi risultano). Dove non ho una definizione
   sicura il campo resta vuoto e la card si compone lo stesso: vanno scritte
   dal cliente.
   =========================================================================== */

export const CATEGORIES = [
  {
    id: "pranzo",
    name: "Pranzo",
    script: "il piatto del giorno",
    eyebrow: "Solo a pranzo · Lun–Sab",
    lead: "Primi e secondi serviti a mezzogiorno, finché ci sono. Il menù completo mette insieme il primo e la bibita.",
    ink: "text-blu-800",
    glyph: "pot",
    layout: "wide",
  },
  {
    id: "sfizi",
    name: "Sfizi",
    script: "la vetrina del fritto",
    eyebrow: "Sempre disponibili",
    lead: "Il banco del fritto napoletano: crocche, frittatine, montanare, calzoncini. Si prendono al volo o si portano via.",
    ink: "text-blu-600",
    glyph: "fry",
    layout: "dense",
  },
  {
    id: "panini",
    name: "Panini",
    script: "tutti con la provola",
    eyebrow: "Carne e pane svizzeri",
    lead: "Quattro panini, tutti con la provola filante. Ognuno esiste anche in versione menù completo, con le patatine e la bibita.",
    ink: "text-blu-700",
    glyph: "sandwich",
    layout: "showcase",
  },
  {
    id: "bevande",
    name: "Bevande",
    script: "da bere, sempre fredde",
    eyebrow: "Tutte a 3.00",
    lead: "Acqua, bibite e birra svizzera. È la stessa bibita del menù completo a pranzo e dei panini menù.",
    ink: "text-blu-600",
    glyph: "drink",
    layout: "lista",
  },
];

export const PRODUCTS = {
  pranzo: [
    {
      id: "gnocchi-sorrentina",
      name: "Gnocchi alla sorrentina",
      desc: "Gnocchi al pomodoro gratinati con la mozzarella.",
      price: "8.00",
      price2: "12.00",
      img: null,
    },
    {
      id: "frittata-maccheroni",
      name: "Frittata di maccheroni",
      desc: "Pasta legata e rosolata in padella, tagliata a fette.",
      price: "9.00",
      price2: "12.00",
      img: null,
    },
    {
      id: "ruotino-boscaiola",
      name: "Ruotino alla boscaiola",
      desc: "",
      price: "7.00",
      img: null,
    },
    {
      id: "ruotino-friarielli",
      name: "Ruotino salsiccia e friarielli",
      desc: "",
      price: "7.00",
      img: null,
    },
    {
      id: "menu-pranzo",
      name: "Menù completo",
      desc: "Un primo a scelta piu la bibita.",
      price: "10.00",
      featured: true,
      img: null,
    },
    {
      id: "contorni",
      name: "Contorni",
      desc: "Uno a scelta dal banco: friarielli, funghi, melanzane, zucchine alla scapece, patate al forno.",
      price: "5.00",
      img: "img/prodotti/contorni.webp",
      imgSm: "img/prodotti/contorni-sm.webp",
    },
  ],

  sfizi: [
    { id: "arancino", name: "Arancino bolognese", desc: "Riso e ragu, impanato e fritto.", price: "4.00", img: "img/prodotti/arancino.webp", imgSm: "img/prodotti/arancino-sm.webp" },
    { id: "mozzarella-carrozza", name: "Mozzarella in carrozza", desc: "Mozzarella fra due fette di pane, fritta.", price: "4.50", img: "img/prodotti/mozzarella-carrozza.webp", imgSm: "img/prodotti/mozzarella-carrozza-sm.webp" },
    { id: "crocche", name: "Crocchè", desc: "Patate, fritte a bastoncino.", price: "4.00", img: "img/prodotti/crocche.webp", imgSm: "img/prodotti/crocche-sm.webp" },
    {
      id: "calzoncino-fritto",
      name: "Calzoncino fritto",
      desc: "Pasta di pizza chiusa e fritta.",
      price: "5.00",
      img: "img/prodotti/calzoncino-fritto.webp",
      imgSm: "img/prodotti/calzoncino-fritto-sm.webp",
    },
    { id: "calzoncino-forno", name: "Calzoncino al forno", desc: "Lo stesso, cotto al forno.", price: "4.00", img: "img/prodotti/calzoncino-forno.webp", imgSm: "img/prodotti/calzoncino-forno-sm.webp" },
    { id: "giovannino", name: "Giovannino crudo e provola", desc: "", price: "8.00", img: "img/prodotti/giovannino.webp", imgSm: "img/prodotti/giovannino-sm.webp" },
    { id: "frittatina", name: "Frittatina di pasta", desc: "Pasta e besciamella, impanata e fritta.", price: "4.00", img: "img/prodotti/frittatina.webp", imgSm: "img/prodotti/frittatina-sm.webp" },
    { id: "panino-napoletano", name: "Panino napoletano", desc: "Pane rustico farcito, cotto al forno.", price: "5.00", img: "img/prodotti/panino-napoletano.webp", imgSm: "img/prodotti/panino-napoletano-sm.webp" },
    { id: "focaccia", name: "Focaccia", desc: "", price: "4.00", img: "img/prodotti/focaccia.webp", imgSm: "img/prodotti/focaccia-sm.webp" },
    { id: "panino-wurstel", name: "Panino fritto wurstel e patatine", desc: "", price: "8.00", img: "img/prodotti/panino-wurstel.webp", imgSm: "img/prodotti/panino-wurstel-sm.webp" },
    { id: "montanara", name: "Montanara", desc: "Pizza fritta con pomodoro e parmigiano.", price: "5.00", img: "img/prodotti/montanara.webp", imgSm: "img/prodotti/montanara-sm.webp" },
    { id: "torciglione", name: "Panino torciglione", desc: "", price: "5.00", img: "img/prodotti/torciglione.webp", imgSm: "img/prodotti/torciglione-sm.webp" },
    { id: "patatine", name: "Patatine", desc: "", price: "6.00", img: "img/prodotti/patatine.webp", imgSm: "img/prodotti/patatine-sm.webp" },
    { id: "parmigiana", name: "Parmigiana di melanzane", desc: "Melanzane, pomodoro e formaggio, al forno.", price: "9.00", img: "img/prodotti/parmigiana.webp", imgSm: "img/prodotti/parmigiana-sm.webp" },
    { id: "pizza-scarola", name: "Pizza di scarola", desc: "Scarola chiusa fra due dischi di pasta.", price: "7.00", img: "img/prodotti/pizza-scarola.webp", imgSm: "img/prodotti/pizza-scarola-sm.webp" },
    { id: "pizzetta-melanzane", name: "Pizzetta melanzane", desc: "", price: "4.50", img: "img/prodotti/pizzetta-melanzane.webp", imgSm: "img/prodotti/pizzetta-melanzane-sm.webp" },
  ],

  panini: [
    {
      id: "salsiccia-provola",
      name: "Salsiccia e provola",
      desc: "Salsiccia alla piastra e provola filante.",
      price: "9.00",
      menu: "15.00",
      img: "img/prodotti/salsiccia-provola.webp",
      imgSm: "img/prodotti/salsiccia-provola-sm.webp",
      imgMenu: "img/prodotti/menu-salsiccia.webp",
      imgMenuSm: "img/prodotti/menu-salsiccia-sm.webp",
    },
    {
      id: "porchetta-provola",
      name: "Porchetta di Ariccia e provola",
      desc: "Porchetta di Ariccia e provola filante.",
      price: "9.00",
      menu: "15.00",
      /* Le due foto della porchetta che c'erano nella cartella del cliente
         sono uno stock Alamy con la filigrana addosso: non si possono
         pubblicare. Finche non arriva uno scatto vero, la card mostra il
         segnaposto disegnato. */
      img: null,
    },
    {
      id: "hamburger-provola",
      name: "Hamburger e provola",
      desc: "Hamburger alla piastra e provola filante.",
      price: "9.00",
      menu: "15.00",
      img: "img/prodotti/hamburger-provola.webp",
      imgSm: "img/prodotti/hamburger-provola-sm.webp",
      imgMenu: "img/prodotti/menu-hamburger.webp",
      imgMenuSm: "img/prodotti/menu-hamburger-sm.webp",
    },
    {
      id: "cotoletta-provola",
      name: "Cotoletta e provola",
      desc: "Cotoletta impanata e provola filante.",
      price: "9.00",
      menu: "15.00",
      img: "img/prodotti/cotoletta-provola.webp",
      imgSm: "img/prodotti/cotoletta-provola-sm.webp",
      imgMenu: "img/prodotti/menu-cotoletta.webp",
      imgMenuSm: "img/prodotti/menu-cotoletta-sm.webp",
    },
  ],

  /* Le cinque bevande del banco, tutte a 3.00 come sul sito del cliente. Il
     formato sta nella descrizione invece che nel nome: in una riga di listino
     "Coca Cola" e "33 cl" sono due informazioni diverse e vanno lette come
     tali. */
  bevande: [
    {
      id: "coca-cola",
      name: "Coca Cola",
      desc: "33 cl",
      price: "3.00",
      img: "img/prodotti/coca-cola.webp",
      imgSm: "img/prodotti/coca-cola-sm.webp",
    },
    {
      id: "coca-cola-zero",
      name: "Coca Cola Zero",
      desc: "33 cl",
      price: "3.00",
      img: "img/prodotti/coca-cola-zero.webp",
      imgSm: "img/prodotti/coca-cola-zero-sm.webp",
    },
    {
      id: "valser-naturale",
      name: "Valser naturale",
      desc: "Acqua minerale · 0.5 l",
      price: "3.00",
      img: "img/prodotti/walser-naturale.webp",
      imgSm: "img/prodotti/walser-naturale-sm.webp",
    },
    {
      id: "valser-gassata",
      name: "Valser gassata",
      desc: "Acqua minerale · 0.5 l",
      price: "3.00",
      img: "img/prodotti/walser-gassata.webp",
      imgSm: "img/prodotti/walser-gassata-sm.webp",
    },
    {
      id: "feldschlosschen",
      name: "Feldschlösschen",
      desc: "Birra svizzera · 0.33 l",
      price: "3.00",
      img: "img/prodotti/feldschlosschen.webp",
      imgSm: "img/prodotti/feldschlosschen-sm.webp",
    },
  ],
};

/* Avviso allergeni, come sul sito del cliente (li c'e in quattro lingue). */
export const ALLERGENI =
  "Se hai allergie o intolleranze alimentari chiedici pure informazioni sul nostro cibo e sulle nostre bevande: siamo preparati per consigliarti nel migliore dei modi.";

/* Contatti e informazioni di servizio, tutti verificati sul sito live. */
export const INFO = {
  tel: "+41784065676",
  telLabel: "078 406 56 76",
  email: "sfizipartenopeilugano@gmail.com",
  via: "Piazzale Gilberto Quadri 1",
  cap: "6962 Viganello (Lugano)",
  maps: "https://www.google.com/maps/search/?api=1&query=Sfizi%20Partenopei%2C%20Piazzale%20Gilberto%20Quadri%201%2C%206962%20Viganello%20Lugano",
  facebook: "https://facebook.com/share/1bjuRniNZ6/?mibextid=wwXIfr",
  instagram: "https://instagram.com/sfizipartenopeilugano?igsh=MXd3dDM4eWFnNjY4dQ==",
  orari: [
    { g: "Lunedì – Sabato", h: "11:30 – 20:30" },
    { g: "Domenica", h: "Chiuso" },
  ],
  consegna: {
    raggio: "8 km",
    finestre: ["11:30 – 13:30", "18:30 – 21:00"],
    zone: [
      "Viganello",
      "Cassarate",
      "Molino Nuovo",
      "Paradiso",
      "Castagnola",
      "Ruvigliana",
      "Canobbio",
      "Pregassona",
    ],
  },
};
