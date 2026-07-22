import { requestUrl } from "obsidian";
import { CompleteOptions, LLMProvider } from "./types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export const anthropicProvider: LLMProvider = {
  id: "anthropic",
  label: "Anthropic (Claude)",
  defaultModel: "claude-sonnet-5",

  async complete({ apiKey, model, system, messages, maxTokens }: CompleteOptions): Promise<string> {
    const response = await requestUrl({
      url: ANTHROPIC_API_URL,
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages,
      }),
      throw: false,
    });

    if (response.status !== 200) {
      throw new Error(`Anthropic API error (${response.status}): ${response.text}`);
    }

    const textBlock = (response.json?.content ?? []).find((b: any) => b.type === "text");
    return textBlock?.text ?? "";
  },
};
