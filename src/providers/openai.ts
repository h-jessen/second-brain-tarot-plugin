import { requestUrl } from "obsidian";
import { CompleteOptions, LLMProvider } from "./types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const openaiProvider: LLMProvider = {
  id: "openai",
  label: "OpenAI (GPT)",
  defaultModel: "gpt-5",

  async complete({ apiKey, model, system, messages, maxTokens }: CompleteOptions): Promise<string> {
    // Same OpenAI-compatible chat completions shape as Grok — system is the
    // first message in the array, not a separate top-level field.
    const chatMessages = [{ role: "system", content: system }, ...messages];

    const response = await requestUrl({
      url: OPENAI_API_URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        // OpenAI's newer models (the gpt-5 family, reasoning models) reject
        // the classic `max_tokens` param and require this instead — unlike
        // Grok, which still accepts `max_tokens` on its OpenAI-compatible
        // endpoint. Not actually interchangeable despite the shared shape.
        max_completion_tokens: maxTokens,
        messages: chatMessages,
      }),
      throw: false,
    });

    if (response.status !== 200) {
      throw new Error(`OpenAI API error (${response.status}): ${response.text}`);
    }

    return response.json?.choices?.[0]?.message?.content ?? "";
  },
};
