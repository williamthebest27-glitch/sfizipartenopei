/* Equalizzazione ottica dei titoli display.
   A corpo fisso, parole di lunghezza diversa coprono larghezze molto diverse e
   la composizione balla a ogni passo del carosello. Qui il corpo si ricava
   dalla lunghezza della parola, cosi ogni riga copre la stessa frazione di
   schermo. Il coefficiente e misurato su Bricolage Grotesque a wdth 100:
   ~0.497em di avanzamento medio per carattere. */
export const WORD_EM = 0.497;

/**
 * @param word    la parola da comporre
 * @param spanVw  quanta parte della larghezza deve coprire, in vw
 * @param capVh   opzionale: tetto in vh, espresso come multiplo di spanVw.
 *                Serve sui titoli alti, dove su uno schermo basso il vincolo
 *                vero e l'altezza. Usando lo stesso multiplo su tutte le righe
 *                di un lockup, le righe restano allineate in entrambi i regimi.
 */
export function fitWidth(word, spanVw, capVh) {
  const k = spanVw / (word.length * WORD_EM);
  const size = capVh ? `min(${k.toFixed(2)}vw, ${(k * capVh).toFixed(2)}vh)` : `${k.toFixed(2)}vw`;
  return `clamp(2rem, ${size}, ${(k * 0.9).toFixed(2)}rem)`;
}
