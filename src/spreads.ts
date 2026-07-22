// Ported from tarot_reading.py's SPREADS dict — same positions, same themes.
// Each spread is an ordered list of (position name, position theme) pairs.
// The theme is what steers which part of the vault context the interpretation
// leans on for that card — same role a real reader's sense of position plays.

export interface SpreadPosition {
  name: string;
  theme: string;
}

export type SpreadName =
  | "single"
  | "three_card"
  | "celtic_cross"
  | "horseshoe"
  | "one_card_clarifier"
  | "year_ahead";

export const SPREADS: Record<SpreadName, SpreadPosition[]> = {
  single: [
    { name: "The Card", theme: "a general read on what's most relevant right now — no narrower framing than that" },
  ],
  three_card: [
    { name: "Past", theme: "what has shaped the current situation — look to older, settled material" },
    { name: "Present", theme: "where things actually stand right now — look to recent, active material" },
    { name: "Future", theme: "where this is heading if nothing changes — look to open threads and unresolved questions" },
  ],
  celtic_cross: [
    { name: "Heart of the Matter", theme: "the core of the current situation, stated plainly" },
    { name: "The Challenge", theme: "what crosses or complicates it — the immediate obstacle or tension" },
    { name: "The Foundation", theme: "the root or distant-past basis of the situation" },
    { name: "Recent Past", theme: "what has just happened or is passing" },
    { name: "The Crown", theme: "the conscious goal, or the best outcome being aimed at" },
    { name: "Near Future", theme: "what's coming next" },
    { name: "Your Attitude", theme: "your own stance, approach, or self-conception toward this" },
    { name: "External Influences", theme: "the people or environment around this situation" },
    { name: "Hopes and Fears", theme: "what's hoped for or feared about how this goes" },
    { name: "The Outcome", theme: "where this leads if the current path continues" },
  ],
  horseshoe: [
    { name: "The Past", theme: "what led here" },
    { name: "The Present", theme: "the current state of things" },
    { name: "Hidden Influences", theme: "what isn't being consciously acknowledged" },
    { name: "Obstacles", theme: "what stands in the way" },
    { name: "External Influences", theme: "other people or circumstances bearing on this" },
    { name: "Recommended Approach", theme: "what a wiser stance toward this would look like" },
    { name: "Likely Outcome", theme: "where this is headed" },
  ],
  one_card_clarifier: [
    { name: "The Card", theme: "a general read on what's most relevant right now" },
    { name: "Clarifier", theme: "additional nuance or a complication on the first card's reading" },
  ],
  year_ahead: Array.from({ length: 12 }, (_, i) => ({
    name: `Month ${i + 1}`,
    theme: "what that stretch of the year ahead tends to bring",
  })),
};

export function spreadLabel(name: SpreadName): string {
  return name
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
