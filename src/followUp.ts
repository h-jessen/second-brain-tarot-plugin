import { DrawnCard } from "./draw";
import { SpreadPosition } from "./spreads";
import { Interpretation, LLMConfig } from "./interpret";
import { PROVIDERS } from "./providers";

export interface FollowUpMessage {
  role: "user" | "assistant";
  content: string;
}

/** Built once, right after the initial interpretation finishes — every
 * follow-up question in the thread rides on this same fixed context, so a
 * question can span multiple cards without re-explaining the reading. */
export function buildFollowUpSystemPrompt(
  vaultContext: string,
  drawn: DrawnCard[],
  spread: SpreadPosition[],
  interpretation: Interpretation
): string {
  const spreadBlock = drawn
    .map((card, i) => {
      const pos = spread[i];
      const reading = interpretation.cards[i]?.reading ?? "";
      return `- ${pos.name}: ${card.name} (${card.orientation})\n  Reading: ${reading}`;
    })
    .join("\n");

  return `You just gave a tarot reading, grounded in the querent's real vault content. They may now ask follow-up questions about it. Stay in the same grounded style as the original reading — connect back to real, specific vault content where relevant, don't fall back to generic tarot-book language, and don't invent details that aren't in the vault context below.

QUERENT'S VAULT CONTEXT:
${vaultContext}

THE FULL READING YOU JUST GAVE:
${spreadBlock}

Synthesis: ${interpretation.synthesis}

Answer follow-up questions conversationally, in 2-5 sentences unless more is clearly warranted. You can reference any card in the spread, not just whichever one they're currently looking at — they may ask about connections across cards.`;
}

export async function askFollowUp(
  llm: LLMConfig,
  systemPrompt: string,
  history: FollowUpMessage[],
  question: string
): Promise<string> {
  const messages = [...history, { role: "user" as const, content: question }];
  const provider = PROVIDERS[llm.providerId];

  const raw = await provider.complete({
    apiKey: llm.apiKey,
    model: llm.model,
    system: systemPrompt,
    messages,
    maxTokens: 1024,
  });

  return raw.trim();
}
