import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES, PRODUCTS, INFO, ALLERGENI } from "../data/menu.js";
import { useReveal } from "../lib/reveal.js";
import PageOpener from "./PageOpener.jsx";
import SiteFooter from "./SiteFooter.jsx";
import { CategoryGlyph, PhoneGlyph, TruckGlyph, ArrowGlyph } from "./glyphs.jsx";

gsap.registerPlugin(ScrollTrigger);

/* ===========================================================================
   ProductsPage — "I nostri prodotti"
   ---------------------------------------------------------------------------
   Una pagina sola, tre sezioni ancorate: Pranzo, Sfizi, Panini. Le tre sezioni
   condividono lo stesso sistema di card ma non la stessa griglia, altrimenti
   scorrendo sembrerebbero la stessa cosa tre volte:

     pranzo    tre colonne, con il menu completo su una card larga
     sfizi     quattro colonne compatte: sedici voci, e un banco, non un menu
     panini    due colonne grandi, perche sono quattro e meritano la foto
     bevande   nessuna card vera: sono cinque bottiglie allo stesso prezzo, non
               hanno niente da confrontare e lo slot orizzontale le lascerebbe
               minuscole in mezzo al vuoto

   Le foto dei prodotti arrivano dal cliente: finche il campo `img` in
   data/menu.js e null la card mostra un segnaposto disegnato invece di un buco,
   e soprattutto non fa partire una richiesta che finirebbe 404.
   =========================================================================== */

/* --------------------------------------------------------------------------
   Card offerta: il menu completo. Niente slot immagine, fondo pieno, prezzo
   grande. Serve anche a rompere il ritmo della griglia.
   -------------------------------------------------------------------------- */
function OfferCard({ item }) {
  return (
    <article
      data-item
      className="group relative isolate flex flex-col justify-center gap-6 overflow-hidden rounded-[26px] bg-blu-950 p-[clamp(20px,2.4vw,32px)] text-white shadow-[0_26px_54px_-36px_rgba(7,41,55,0.95)] transition-all duration-500 ease-hero hover:-translate-y-1.5 hover:shadow-[0_32px_62px_-32px_rgba(13,169,220,0.7)] sm:col-span-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] -bottom-[40%] -z-10 aspect-square w-[46%] transition-transform duration-700 ease-hero group-hover:scale-110"
        style={{
          borderRadius: "58% 42% 71% 29% / 38% 63% 37% 62%",
          background:
            "radial-gradient(closest-side, rgba(13,169,220,0.55), rgba(13,169,220,0.2) 55%, rgba(13,169,220,0) 100%)",
        }}
      />

      <div className="min-w-0">
        <span className="font-body text-[0.6rem] font-semibold tracking-[0.22em] text-blu-300 uppercase">
          Il piu conveniente
        </span>
        <h3
          className="mt-2 font-display font-extrabold text-white"
          style={{ fontSize: "clamp(1.5rem,2.8vw,2.1rem)", lineHeight: 1.05, letterSpacing: "-0.035em" }}
        >
          {item.name}
        </h3>
        {item.desc && <p className="mt-2 max-w-[38ch] text-[0.92rem] leading-relaxed text-blu-200">{item.desc}</p>}
      </div>

      <p className="flex shrink-0 items-baseline gap-2">
        <span className="font-body text-[0.64rem] font-semibold tracking-[0.16em] text-blu-300 uppercase">CHF</span>
        <span
          className="font-display font-extrabold text-white tabular-nums"
          style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)", lineHeight: 1, letterSpacing: "-0.04em" }}
        >
          {item.price}
        </span>
      </p>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Card prodotto. Stessa anatomia per tutte, tre tagli diversi dello slot
   immagine: e quello che cambia il ritmo fra una sezione e l'altra.
   -------------------------------------------------------------------------- */
function ProductCard({ item, glyph, variant }) {
  const ratio = variant === "dense" ? "4 / 3" : variant === "showcase" ? "16 / 11" : "3 / 2";

  /* sizes deve dichiarare la larghezza VERA dello slot, che cambia con la
     griglia della sezione: con un valore unico le card grandi ricevevano il
     file piccolo e le foto uscivano ingrandite. */
  const sizes =
    variant === "dense"
      ? "(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
      : variant === "showcase"
        ? "(min-width: 640px) 46vw, 92vw"
        : "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw";

  return (
    <article
      data-item
      className="group relative flex flex-col overflow-hidden rounded-[26px] border border-blu-100 bg-white shadow-[0_18px_40px_-34px_rgba(7,41,55,0.5)] transition-all duration-500 ease-hero hover:-translate-y-1.5 hover:border-blu-200 hover:shadow-[0_30px_60px_-34px_rgba(13,169,220,0.55)]"
    >
      {/* campo immagine: macchia blu + prodotto, o segnaposto disegnato */}
      <div className="relative isolate overflow-hidden" style={{ aspectRatio: ratio }}>
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-blu-50 transition-colors duration-500 ease-hero group-hover:bg-blu-100"
        />
        <span
          aria-hidden="true"
          className="absolute -z-10 aspect-square w-[78%] transition-transform duration-700 ease-hero group-hover:scale-110"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "58% 42% 71% 29% / 38% 63% 37% 62%",
            background:
              "radial-gradient(closest-side, rgba(13,169,220,0.26), rgba(13,169,220,0.14) 52%, rgba(13,169,220,0) 100%)",
          }}
        />

        {item.img && (
          <span
            aria-hidden="true"
            className="absolute bottom-[12%] left-1/2 h-[9%] w-[54%] -translate-x-1/2 rounded-[50%]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(7,41,55,0.26), rgba(7,41,55,0.1) 55%, rgba(7,41,55,0) 100%)",
            }}
          />
        )}

        {item.img ? (
          <img
            src={item.img}
            {...(item.imgSm ? { srcSet: `${item.imgSm} 680w, ${item.img} 1200w` } : {})}
            sizes={sizes}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[0.9] object-contain transition-transform duration-700 ease-hero group-hover:scale-[0.97]"
          />
        ) : (
          <CategoryGlyph
            kind={glyph}
            className="absolute top-1/2 left-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 text-blu-300 transition-transform duration-700 ease-hero group-hover:scale-105"
          />
        )}

        {item.menu && (
          <span className="absolute top-3 right-3 rounded-full border border-blu-200 bg-white/85 px-3 py-1.5 font-body text-[0.62rem] font-semibold tracking-[0.1em] text-blu-700 uppercase backdrop-blur-sm">
            Menù {item.menu}
          </span>
        )}
      </div>

      {/* testo */}
      <div className={`flex flex-1 flex-col ${variant === "dense" ? "gap-1 p-4" : "gap-1.5 p-5"}`}>
        <h3
          className={`font-display font-extrabold text-blu-950 ${
            variant === "dense" ? "text-[0.98rem]" : "text-[clamp(1.05rem,1.4vw,1.3rem)]"
          }`}
          style={{ fontStretch: "92%", lineHeight: 1.15, textWrap: "balance" }}
        >
          {item.name}
        </h3>

        {item.desc && (
          <p className={`leading-snug text-blu-800 ${variant === "dense" ? "text-[0.8rem]" : "text-[0.88rem]"}`}>
            {item.desc}
          </p>
        )}

        <p className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-body text-[0.62rem] font-semibold tracking-[0.14em] text-blu-700 uppercase">
            CHF
          </span>
          <span
            className={`font-body font-semibold text-blu-950 tabular-nums ${
              variant === "dense" ? "text-[1.05rem]" : "text-[1.2rem]"
            }`}
          >
            {item.price}
          </span>
          {item.price2 && (
            <>
              <span aria-hidden="true" className="text-blu-300">
                /
              </span>
              <span className="font-body text-[1.05rem] font-semibold text-blu-700 tabular-nums">
                {item.price2}
              </span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Bottiglia. Slot verticale, e la pastiglia azzurra dietro al fondo della
   bottiglia come un sottobicchiere: una bottiglia in una cornice 16/11 viene
   alta un terzo dello spazio e sembra persa.
   -------------------------------------------------------------------------- */
function DrinkCard({ item }) {
  return (
    <article
      data-item
      className="group flex flex-col items-center rounded-[24px] border border-blu-100 bg-white p-4 text-center shadow-[0_18px_40px_-34px_rgba(7,41,55,0.5)] transition-all duration-500 ease-hero hover:-translate-y-1.5 hover:border-blu-200 hover:shadow-[0_30px_60px_-34px_rgba(13,169,220,0.55)] sm:p-5"
    >
      <div className="relative flex h-[clamp(124px,19vh,186px)] w-full items-end justify-center">
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-[42%] w-[74%] -translate-x-1/2 rounded-[50%] bg-blu-50 transition-transform duration-700 ease-hero group-hover:scale-105"
        />
        <img
          src={item.img}
          {...(item.imgSm ? { srcSet: `${item.imgSm} 680w, ${item.img} 1200w` } : {})}
          sizes="(min-width: 1024px) 14vw, (min-width: 640px) 22vw, 40vw"
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="relative h-full w-auto max-w-full object-contain transition-transform duration-700 ease-hero group-hover:-translate-y-1.5"
        />
      </div>

      <h3
        className="mt-4 font-display text-[1.02rem] font-extrabold text-blu-950"
        style={{ fontStretch: "92%", lineHeight: 1.15, textWrap: "balance" }}
      >
        {item.name}
      </h3>
      {item.desc && <p className="mt-0.5 text-[0.8rem] leading-snug text-blu-800">{item.desc}</p>}

      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="font-body text-[0.6rem] font-semibold tracking-[0.14em] text-blu-700 uppercase">
          CHF
        </span>
        <span className="font-body text-[1.05rem] font-semibold text-blu-950 tabular-nums">
          {item.price}
        </span>
      </p>
    </article>
  );
}

/* --------------------------------------------------------------------------
   Panini Menù: il pannello scuro che chiude la sezione panini.
   Sul sito del cliente "Panini Menù" e una lista a se, con gli stessi quattro
   panini a 15.00. Qui i dati non si duplicano: sono le stesse voci, con la
   loro seconda fotografia (quella con le patatine e la bibita). Il pannello
   blu scuro dopo quattro card bianche chiude la sezione invece di allungarla.
   -------------------------------------------------------------------------- */
function PaniniMenu({ items }) {
  const menu = items.filter((i) => i.menu);
  if (!menu.length) return null;

  return (
    <div
      data-item
      className="relative isolate mt-4 overflow-hidden rounded-[30px] bg-blu-950 p-[clamp(22px,3vw,42px)] text-white shadow-[0_30px_60px_-40px_rgba(7,41,55,0.95)] sm:mt-5"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[30%] -right-[8%] -z-10 aspect-square w-[42%]"
        style={{
          borderRadius: "58% 42% 71% 29% / 38% 63% 37% 62%",
          background:
            "radial-gradient(closest-side, rgba(13,169,220,0.5), rgba(13,169,220,0.18) 55%, rgba(13,169,220,0) 100%)",
        }}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="block h-px w-8 bg-blu-400" />
            <span className="font-body text-[0.62rem] font-semibold tracking-[0.22em] text-blu-300 uppercase">
              Menù completo
            </span>
          </p>
          <h3
            className="mt-2 font-display font-extrabold text-white"
            style={{ fontSize: "clamp(1.6rem,3.4vw,2.6rem)", lineHeight: 1, letterSpacing: "-0.035em" }}
          >
            Panini Menù
          </h3>
        </div>
        <p className="max-w-[40ch] text-[0.92rem] leading-relaxed text-blu-200 md:text-right">
          Lo stesso panino con le patatine e la bibita, a{" "}
          <span className="font-semibold text-white tabular-nums">15.00 CHF</span>.
        </p>
      </div>

      <ul className="mt-[clamp(20px,3vh,34px)] grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {menu.map((item) => (
          <li
            key={`menu-${item.id}`}
            className="group flex flex-col rounded-[22px] bg-white/10 p-3 transition-colors duration-500 ease-hero hover:bg-white/15"
          >
            <div className="relative aspect-[16/11] overflow-hidden rounded-[16px]">
              <span
                aria-hidden="true"
                className="absolute bottom-[10%] left-1/2 h-[10%] w-[58%] -translate-x-1/2 rounded-[50%]"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(0,0,0,0.45), rgba(0,0,0,0.16) 55%, rgba(0,0,0,0) 100%)",
                }}
              />
              {item.imgMenu ? (
                <img
                  src={item.imgMenu}
                  {...(item.imgMenuSm
                    ? { srcSet: `${item.imgMenuSm} 680w, ${item.imgMenu} 1200w` }
                    : {})}
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 82vw"
                  alt={`${item.name}, menu completo`}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full scale-[0.94] object-contain transition-transform duration-700 ease-hero group-hover:scale-100"
                />
              ) : (
                <CategoryGlyph
                  kind="sandwich"
                  className="absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 text-white/30"
                />
              )}
            </div>

            <p
              className="mt-3 font-display text-[0.98rem] font-extrabold text-white"
              style={{ fontStretch: "92%", lineHeight: 1.15, textWrap: "balance" }}
            >
              {item.name}
            </p>
            <p className="mt-auto flex items-baseline gap-1.5 pt-2">
              <span className="font-body text-[0.58rem] font-semibold tracking-[0.14em] text-blu-300 uppercase">
                CHF
              </span>
              <span className="font-body text-[1.02rem] font-semibold text-white tabular-nums">
                {item.menu}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Sezione di categoria: testata editoriale + griglia.
   -------------------------------------------------------------------------- */
function CategorySection({ cat }) {
  const items = PRODUCTS[cat.id];
  const grid =
    cat.layout === "dense"
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : cat.layout === "showcase"
        ? "grid-cols-1 sm:grid-cols-2"
        : cat.layout === "lista"
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id={cat.id}
      data-reveal
      aria-labelledby={`${cat.id}-title`}
      className="scroll-mt-[128px] border-t border-blu-100 py-[clamp(48px,8vh,96px)] lg:scroll-mt-[150px]"
    >
      <div className="flex flex-col gap-[clamp(20px,3vh,36px)] md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-3" data-item>
            <span aria-hidden="true" className="block h-px w-8 bg-blu-500" />
            <span className="font-body text-[0.62rem] font-semibold tracking-[0.22em] text-blu-700 uppercase">
              {cat.eyebrow}
            </span>
          </p>

          <h2
            id={`${cat.id}-title`}
            className={`mt-3 font-display font-extrabold ${cat.ink}`}
            style={{
              fontSize: "clamp(2.2rem, 6vw, 4.4rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontStretch: "100%",
            }}
          >
            <span className="mb-[-0.12em] block overflow-hidden pb-[0.12em]">
              <span data-line className="block uppercase">
                {cat.name}
              </span>
            </span>
          </h2>

          <p data-item className="mt-1 font-script text-[clamp(1.3rem,2.4vw,2rem)] text-blu-600">
            {cat.script}
          </p>
        </div>

        <div className="md:max-w-[38ch] md:text-right">
          <p data-item className="text-[0.95rem] leading-relaxed text-blu-800">
            {cat.lead}
          </p>
          <p
            data-item
            className="mt-3 font-body text-[0.68rem] font-semibold tracking-[0.16em] text-blu-700 uppercase tabular-nums"
          >
            {items.length} voci in carta
          </p>
        </div>
      </div>

      <div className={`mt-[clamp(26px,4vh,48px)] grid gap-4 sm:gap-5 ${grid}`}>
        {items.map((item) =>
          cat.layout === "lista" ? (
            <DrinkCard key={item.id} item={item} />
          ) : item.featured ? (
            <OfferCard key={item.id} item={item} />
          ) : (
            <ProductCard key={item.id} item={item} glyph={cat.glyph} variant={cat.layout} />
          )
        )}
      </div>

      {/* i panini menù chiudono la sezione panini, come sul sito del cliente */}
      {cat.id === "panini" && <PaniniMenu items={items} />}
    </section>
  );
}

/* ------------------------------------------------------------------------ */

export default function ProductsPage() {
  const root = useRef(null);
  useReveal(root);

  /* La barra delle categorie segna dove sei. Un ScrollTrigger per sezione che
     scrive un data-attribute: nessuno stato React, quindi nessun re-render a
     ogni pixel di scroll. */
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const links = Array.from(el.querySelectorAll("[data-cat-link]"));
      const setActive = (id) =>
        links.forEach((a) => (a.dataset.active = a.dataset.catLink === id ? "true" : "false"));

      CATEGORIES.forEach((cat) => {
        const section = el.querySelector(`#${cat.id}`);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => self.isActive && setActive(cat.id),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root}>
      <main>
        <PageOpener
          eyebrow="Il banco di Viganello"
          title="I nostri prodotti"
          script="tutto quello che esce dalla cucina"
          lead="Il fritto napoletano, i panini con la provola e i primi del pranzo. Preparato al momento, da mangiare qui o da farsi portare a casa entro otto chilometri."
        >
          <ul data-item className="mt-[clamp(20px,3vh,34px)] flex flex-wrap gap-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-blu-200 bg-white/70 px-4 py-2.5 font-body text-[0.7rem] font-semibold tracking-[0.12em] text-blu-800 uppercase backdrop-blur-sm transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:border-blu-700 hover:bg-blu-700 hover:text-white focus-visible:-translate-y-0.5"
                >
                  {c.name}
                  <span className="text-blu-500 transition-colors duration-300 group-hover:text-white">
                    <CategoryGlyph kind={c.glyph} weight={1.9} className="h-4 w-4" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </PageOpener>

        {/* barra delle categorie: resta sotto la testata fissa e segna la
            sezione in cui ti trovi */}
        <nav
          aria-label="Categorie"
          className="sticky top-[98px] z-30 border-y border-blu-100 bg-white/85 backdrop-blur-md lg:top-[74px]"
        >
          <div className="mx-auto w-full max-w-[1440px] overflow-x-auto px-[clamp(20px,5vw,72px)]">
            <ul className="flex min-w-max items-center gap-1 py-2.5">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    data-cat-link={c.id}
                    data-active={c.id === CATEGORIES[0].id ? "true" : "false"}
                    className="block rounded-full px-4 py-2 font-body text-[0.68rem] font-semibold tracking-[0.14em] text-blu-700 uppercase transition-all duration-300 ease-hero hover:bg-blu-50 data-[active=true]:bg-blu-700 data-[active=true]:text-white"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mx-auto w-full max-w-[1440px] px-[clamp(20px,5vw,72px)]">
          {CATEGORIES.map((cat) => (
            <CategorySection key={cat.id} cat={cat} />
          ))}

          {/* L'avviso che sul sito del cliente chiude ogni pagina del menu.
              Una riga sola in fondo a tutto: e un obbligo di servizio, non un
              contenuto da mettere in evidenza. */}
          <p
            data-reveal
            className="border-t border-blu-100 py-[clamp(20px,3vh,32px)] text-[0.82rem] leading-relaxed text-blu-700"
          >
            <span data-item>{ALLERGENI}</span>
          </p>
        </div>

        {/* fascia di chiusura: consegna + telefono */}
        <section data-reveal className="bg-blu-50">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-[clamp(20px,5vw,72px)] py-[clamp(44px,7vh,84px)] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p data-item className="flex items-center gap-3">
                <span className="text-blu-600">
                  <TruckGlyph size={18} />
                </span>
                <span className="font-body text-[0.64rem] font-semibold tracking-[0.22em] text-blu-700 uppercase">
                  Consegna entro {INFO.consegna.raggio}
                </span>
              </p>
              <h2
                className="mt-3 font-display font-extrabold text-blu-950"
                style={{ fontSize: "clamp(1.7rem,4vw,3rem)", lineHeight: 1, letterSpacing: "-0.035em" }}
              >
                <span className="mb-[-0.12em] block overflow-hidden pb-[0.12em]">
                  <span data-line className="block">
                    Ordina al telefono.
                  </span>
                </span>
              </h2>
              <p data-item className="mt-3 max-w-[46ch] text-[0.95rem] leading-relaxed text-blu-800">
                Si consegna nelle due finestre: {INFO.consegna.finestre.join(" e ")}. Zone servite:{" "}
                {INFO.consegna.zone.join(", ")}.
              </p>
            </div>

            <div data-item className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <a
                href={`tel:${INFO.tel}`}
                className="group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-blu-900 px-7 py-[1.05rem] font-body text-[0.76rem] font-semibold tracking-[0.1em] text-white uppercase shadow-[0_18px_40px_-22px_rgba(7,41,55,0.95)] transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-20px_rgba(13,169,220,0.85)] focus-visible:-translate-y-0.5"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-blu-600 transition-transform duration-500 ease-hero group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <span className="relative z-10 flex items-center gap-3 tabular-nums">
                  <PhoneGlyph />
                  {INFO.telLabel}
                </span>
              </a>

              <a
                href="contatti.html"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-blu-200 bg-white px-7 py-[1.05rem] font-body text-[0.76rem] font-semibold tracking-[0.1em] text-blu-800 uppercase transition-all duration-300 ease-hero hover:-translate-y-0.5 hover:border-blu-700 focus-visible:-translate-y-0.5"
              >
                Scrivici
                <span className="transition-transform duration-500 ease-hero group-hover:translate-x-1">
                  <ArrowGlyph />
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
