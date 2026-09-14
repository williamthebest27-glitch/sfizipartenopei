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
    lead: "Primi e secondi serviti a mezzogiorno, finche ci sono. Il menu completo mette insieme il primo e la bibita.",
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
    lead: "Quattro panini, tutti con la provola filante. Ognuno esiste anche in versione menu completo.",
    ink: "text-blu-700",
    glyph: "sandwich",
    layout: "showcase",
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
    { id: "contorni", name: "Contorni", desc: "Uno a scelta dal banco.", price: "5.00", img: null },
    { id: "bevande", name: "Bevande", desc: "", price: "3.00", img: null },
  ],

  sfizi: [
    { id: "arancino", name: "Arancino bolognese", desc: "Riso e ragu, impanato e fritto.", price: "4.00", img: null },
    { id: "mozzarella-carrozza", name: "Mozzarella in carrozza", desc: "Mozzarella fra due fette di pane, fritta.", price: "4.50", img: null },
    { id: "crocche", name: "Crocchè", desc: "Patate, fritte a bastoncino.", price: "4.00", img: null },
    {
      id: "calzoncino-fritto",
      name: "Calzoncino fritto",
      desc: "Pasta di pizza chiusa e fritta.",
      price: "5.00",
      img: "img/calzoncino.webp",
      imgSm: "img/calzoncino-sm.webp",
    },
    { id: "calzoncino-forno", name: "Calzoncino al forno", desc: "Lo stesso, cotto al forno.", price: "4.00", img: null },
    { id: "giovannino", name: "Giovannino crudo e provola", desc: "", price: "8.00", img: null },
    { id: "frittatina", name: "Frittatina di pasta", desc: "Pasta e besciamella, impanata e fritta.", price: "4.00", img: null },
    { id: "panino-napoletano", name: "Panino napoletano", desc: "Pane rustico farcito, cotto al forno.", price: "5.00", img: null },
    { id: "focaccia", name: "Focaccia", desc: "", price: "4.00", img: null },
    { id: "panino-wurstel", name: "Panino fritto wurstel e patatine", desc: "", price: "8.00", img: null },
    { id: "montanara", name: "Montanara", desc: "Pizza fritta con pomodoro e parmigiano.", price: "5.00", img: null },
    { id: "torciglione", name: "Panino torciglione", desc: "", price: "5.00", img: null },
    { id: "patatine", name: "Patatine", desc: "", price: "6.00", img: null },
    { id: "parmigiana", name: "Parmigiana di melanzane", desc: "Melanzane, pomodoro e formaggio, al forno.", price: "9.00", img: null },
    { id: "pizza-scarola", name: "Pizza di scarola", desc: "Scarola chiusa fra due dischi di pasta.", price: "7.00", img: null },
    { id: "pizzetta-melanzane", name: "Pizzetta melanzane", desc: "", price: "4.50", img: null },
  ],

  panini: [
    {
      id: "salsiccia-provola",
      name: "Salsiccia e provola",
      desc: "Salsiccia alla piastra e provola filante.",
      price: "9.00",
      menu: "15.00",
      img: "img/pesto.webp",
      imgSm: "img/pesto-sm.webp",
    },
    {
      id: "porchetta-provola",
      name: "Porchetta di Ariccia e provola",
      desc: "Porchetta di Ariccia e provola filante.",
      price: "9.00",
      menu: "15.00",
      img: null,
    },
    {
      id: "hamburger-provola",
      name: "Hamburger e provola",
      desc: "Hamburger alla piastra e provola filante.",
      price: "9.00",
      menu: "15.00",
      img: null,
    },
    {
      id: "cotoletta-provola",
      name: "Cotoletta e provola",
      desc: "Cotoletta impanata e provola filante.",
      price: "9.00",
      menu: "15.00",
      img: null,
    },
  ],
};

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
