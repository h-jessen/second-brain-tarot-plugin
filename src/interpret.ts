import { DrawnCard } from "./draw";
import { SpreadPosition } from "./spreads";
import { PROVIDERS, ProviderId } from "./providers";

export interface LLMConfig {
  providerId: ProviderId;
  apiKey: string;
  model: string;
}

export interface PositionReading {
  position: string;
  reading: string;
}

export interface Interpretation {
  cards: PositionReading[];
  synthesis: string;
}

// Same template as tarot_reading.py's SYSTEM_PROMPT_TEMPLATE — kept in sync
// deliberately. If you change one, change the other.
const SYSTEM_PROMPT_TEMPLATE = (vaultContext: string, questionBlock: string) => `You are giving a tarot reading, grounded in the querent's real life as captured in their own notes below — not generic tarot-book copy.

QUERENT'S VAULT CONTEXT:
${vaultContext}
${questionBlock}
Rules for how to read the cards:
- Each card's traditional meaning is a starting point, not the whole answer — the actual reading should draw a real, specific connection to something in the vault context above, the way a good reader listens to a client's actual situation rather than reciting a book.
- Stay grounded in what's really in the vault context. Don't invent specific facts, names, or events that aren't there — if nothing specific connects, say something true and useful at the level of pattern or tendency instead of fabricating a detail.
- Take each card's position and its theme seriously — a card in a "past" position should read differently than the same card in a "hopes and fears" position, even if the card itself is identical.
- Don't force positivity. A hard card in a hard position should read as genuinely hard.
- Keep each position's reading to 2-4 sentences.
- After all positions, write a short synthesis (3-5 sentences) that reads the spread as a whole, not just as separate cards — real spreads have a throughline.

Respond with JSON only:
{"cards": [{"position": "...", "reading": "..."}, ...], "synthesis": "..."}`;

function buildCardsBlock(drawn: DrawnCard[], spread: SpreadPosition[]): string {
  return drawn
    .map((card, i) => {
      const pos = spread[i];
      const meaning = card.orientation === "upright" ? card.upright : card.reversed;
      return `- Position "${pos.name}" (${pos.theme}): ${card.name}, ${card.orientation} — traditional meaning: ${meaning}`;
    })
    .join("\n");
}

/** Validates the model's JSON response actually matches Interpretation
 * before trusting it — JSON.parse only returns `unknown` here, deliberately,
 * so a malformed response can never silently masquerade as well-typed data. */
function isInterpretation(value: unknown): value is Interpretation {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.cards) &&
    v.cards.every(
      (c): c is PositionReading =>
        typeof c === "object" &&
        c !== null &&
        typeof (c as Record<string, unknown>).position === "string" &&
        typeof (c as Record<string, unknown>).reading === "string"
    ) &&
    typeof v.synthesis === "string"
  );
}

/** Same tolerant-parse strategy as the Python side: strip code fences, try a
 * clean parse, then fall back to extracting an embedded JSON object. */
function parseInterpretation(raw: string): Interpretation | null {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```json\s*|\s*```$/gm, "").trim();
  try {
    const result: unknown = JSON.parse(cleaned);
    if (isInterpretation(result)) return result;
  } catch {
    // fall through
  }
  const match = cleaned.match(/\{[\s\S]*"cards"[\s\S]*\}/);
  if (match) {
    try {
      const result: unknown = JSON.parse(match[0]);
      if (isInterpretation(result)) return result;
    } catch {
      // fall through
    }
  }
  return null;
}

export async function interpretReading(
  llm: LLMConfig,
  vaultContext: string,
  question: string,
  drawn: DrawnCard[],
  spread: SpreadPosition[],
  retries = 2
): Promise<Interpretation> {
  const questionBlock = question ? `\nTHE QUERENT'S QUESTION FOR THIS READING: ${question}\n` : "";
  const system = SYSTEM_PROMPT_TEMPLATE(vaultContext, questionBlock);
  const userContent = "THE SPREAD:\n" + buildCardsBlock(drawn, spread);
  const provider = PROVIDERS[llm.providerId];

  let lastRaw = "";
  for (let attempt = 0; attempt <= retries; attempt++) {
    const raw = await provider.complete({
      apiKey: llm.apiKey,
      model: llm.model,
      system,
      messages: [{ role: "user", content: userContent }],
      maxTokens: 4096,
    });
    lastRaw = raw;

    const parsed = parseInterpretation(raw);
    if (parsed) return parsed;
  }

  throw new Error(
    `Model didn't return parseable reading JSON after ${retries + 1} attempts. Last raw output:\n${lastRaw}`
  );
}
