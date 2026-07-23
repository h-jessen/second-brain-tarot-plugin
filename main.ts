import { Plugin, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, TarotSettings, TarotSettingTab } from "./src/settings";
import { TarotView, TAROT_VIEW_TYPE } from "./src/view";

/** The single apiKey/model fields used before multi-provider support —
 * still relevant only as a migration source in loadSettings(). */
interface LegacySettings {
  apiKey?: string;
  model?: string;
}

export default class SecondBrainTarotPlugin extends Plugin {
  settings: TarotSettings;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.registerView(TAROT_VIEW_TYPE, (leaf) => new TarotView(leaf, this));

    this.addRibbonIcon("sparkles", "Second-Brain Tarot", () => this.activateView());

    this.addCommand({
      id: "open-tarot-reading",
      name: "Draw a tarot reading",
      callback: () => this.activateView(),
    });

    this.addSettingTab(new TarotSettingTab(this.app, this));
  }

  onunload(): void {
    // Views are torn down by Obsidian itself; nothing else to clean up.
  }

  async loadSettings(): Promise<void> {
    // loadData() is typed `any` by the Obsidian API (it's arbitrary saved
    // JSON) — asserted to a known shape once, right here at the boundary,
    // rather than letting `any` leak through every property access below.
    const raw = ((await this.loadData()) ?? {}) as Partial<TarotSettings> & LegacySettings;

    // Migrate the old single apiKey/model shape (pre-multi-provider) into
    // the new per-provider maps, so an already-configured Anthropic key
    // isn't silently dropped on upgrade.
    let apiKeys = raw.apiKeys;
    let models = raw.models;
    let provider = raw.provider;
    if (raw.apiKey && !apiKeys) {
      apiKeys = { ...DEFAULT_SETTINGS.apiKeys, anthropic: raw.apiKey };
      models = { ...DEFAULT_SETTINGS.models, anthropic: raw.model || DEFAULT_SETTINGS.models.anthropic };
      provider = "anthropic";
    }

    this.settings = {
      ...DEFAULT_SETTINGS,
      ...raw,
      provider: provider ?? DEFAULT_SETTINGS.provider,
      // Merge per-provider maps key-by-key rather than taking the saved
      // object wholesale — otherwise a provider added after a user's
      // settings were first saved (e.g. openai, added after
      // anthropic/gemini/grok) would be missing from apiKeys/models
      // entirely instead of defaulting to "".
      apiKeys: { ...DEFAULT_SETTINGS.apiKeys, ...apiKeys },
      models: { ...DEFAULT_SETTINGS.models, ...models },
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  /** Resolve a bundled card-art filename to a usable <img src>, referencing
   * the plugin's own installed folder (not vault content). */
  cardImageSrc(filename: string): string {
    const pluginDir = `${this.app.vault.configDir}/plugins/${this.manifest.id}`;
    const path = `${pluginDir}/assets/cards/${filename}`;
    return this.app.vault.adapter.getResourcePath(path);
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = workspace.getLeavesOfType(TAROT_VIEW_TYPE)[0] ?? null;
    if (!leaf) {
      leaf = workspace.getLeaf(true);
      await leaf.setViewState({ type: TAROT_VIEW_TYPE, active: true });
    }
    await workspace.revealLeaf(leaf);
  }
}
