import { ProviderId, LLMProvider } from "./types";
import { anthropicProvider } from "./anthropic";
import { geminiProvider } from "./gemini";
import { grokProvider } from "./grok";

export * from "./types";

export const PROVIDERS: Record<ProviderId, LLMProvider> = {
  anthropic: anthropicProvider,
  gemini: geminiProvider,
  grok: grokProvider,
};

export const PROVIDER_LIST: LLMProvider[] = [anthropicProvider, geminiProvider, grokProvider];
