import { Plugin, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, TarotSettings, TarotSettingTab } from "./src/settings";
import { TarotView, TAROT_VIEW_TYPE } from "./src/view";

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
    const data = (await this.loadData()) ?? {};

    // Migrate the old single apiKey/model shape (pre-multi-provider) into
    // the new per-provider maps, so an already-configured Anthropic key
    // isn't silently dropped on upgrade.
    if (data.apiKey && !data.apiKeys) {
      data.apiKeys = { ...DEFAULT_SETTINGS.apiKeys, anthropic: data.apiKey };
      data.models = { ...DEFAULT_SETTINGS.models, anthropic: data.model || DEFAULT_SETTINGS.models.anthropic };
      data.provider = "anthropic";
      delete data.apiKey;
      delete data.model;
    }

    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    // Merge per-provider maps key-by-key rather than taking the saved object
    // wholesale — otherwise a provider added after a user's settings were
    // first saved (e.g. openai, added after anthropic/gemini/grok) would be
    // missing from apiKeys/models entirely instead of defaulting to "".
    this.settings.apiKeys = { ...DEFAULT_SETTINGS.apiKeys, ...data.apiKeys };
    this.settings.models = { ...DEFAULT_SETTINGS.models, ...data.models };
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
    workspace.revealLeaf(leaf);
  }
}
