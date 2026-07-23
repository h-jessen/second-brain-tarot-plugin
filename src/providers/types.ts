export type ProviderId = "anthropic" | "gemini" | "grok" | "openai";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CompleteOptions {
  apiKey: string;
  model: string;
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
}

export interface LLMProvider {
  id: ProviderId;
  label: string;
  defaultModel: string;
  complete(opts: CompleteOptions): Promise<string>;
}

// Minimal shapes for each vendor's JSON response — just enough to safely
// pull the text out, not a full schema of every field. `requestUrl`'s
// `.json` is typed `any`; casting to one of these once, right where the
// response comes back, is what keeps that `any` from leaking further in.
export interface AnthropicResponse {
  content?: { type: string; text?: string }[];
}

export interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

export interface OpenAIStyleResponse {
  choices?: { message?: { content?: string } }[];
}
