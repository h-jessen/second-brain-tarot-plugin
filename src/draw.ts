import { TarotCard } from "./deck";

export type Orientation = "upright" | "reversed";

export interface DrawnCard extends TarotCard {
  orientation: Orientation;
}

/** Fisher-Yates shuffle — used instead of naive random.sample-style picking
 * so there's no bias toward earlier cards in the deck array. */
function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** n unique cards, each independently upright or reversed — no repeats
 * within one reading, same as a physical deck (mirrors tarot_reading.py's draw()). */
export function draw(deck: TarotCard[], n: number): DrawnCard[] {
  const chosen = shuffled(deck).slice(0, n);
  return chosen.map((card) => ({
    ...card,
    orientation: (Math.random() < 0.5 ? "upright" : "reversed") as Orientation,
  }));
}
