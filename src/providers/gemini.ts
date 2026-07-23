import { requestUrl } from "obsidian";
import { CompleteOptions, GeminiResponse, LLMProvider } from "./types";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export const geminiProvider: LLMProvider = {
  id: "gemini",
  label: "Google (Gemini)",
  defaultModel: "gemini-3.5-flash",

  async complete({ apiKey, model, system, messages, maxTokens }: CompleteOptions): Promise<string> {
    // Gemini has no "assistant" role — the model's own turns are "model".
    // The API key rides in the query string, not a header.
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await requestUrl({
      url: `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { maxOutputTokens: maxTokens },
      }),
      throw: false,
    });

    if (response.status !== 200) {
      throw new Error(`Gemini API error (${response.status}): ${response.text}`);
    }

    const body = response.json as GeminiResponse;
    const parts = body.candidates?.[0]?.content?.parts ?? [];
    return parts.map((p) => p.text ?? "").join("");
  },
};
