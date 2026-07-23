import { requestUrl } from "obsidian";
import { CompleteOptions, LLMProvider, OpenAIStyleResponse } from "./types";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";

export const grokProvider: LLMProvider = {
  id: "grok",
  label: "xAI (Grok)",
  defaultModel: "grok-4",

  async complete({ apiKey, model, system, messages, maxTokens }: CompleteOptions): Promise<string> {
    // OpenAI-compatible chat completions shape — system is just the first
    // message in the array, not a separate top-level field like the other
    // two providers.
    const chatMessages = [{ role: "system", content: system }, ...messages];

    const response = await requestUrl({
      url: GROK_API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: chatMessages,
      }),
      throw: false,
    });

    if (response.status !== 200) {
      throw new Error(`Grok API error (${response.status}): ${response.text}`);
    }

    const body = response.json as OpenAIStyleResponse;
    return body.choices?.[0]?.message?.content ?? "";
  },
};
