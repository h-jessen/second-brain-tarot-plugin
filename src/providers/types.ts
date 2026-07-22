export type ProviderId = "anthropic" | "gemini" | "grok";

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
