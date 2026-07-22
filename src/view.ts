import { ItemView, WorkspaceLeaf, Notice, normalizePath, TFile } from "obsidian";
import type SecondBrainTarotPlugin from "../main";
import { TAROT_DECK } from "./deck";
import { SPREADS, SpreadName, SpreadPosition, spreadLabel } from "./spreads";
import { draw, DrawnCard } from "./draw";
import { interpretReading, Interpretation, LLMConfig } from "./interpret";
import { loadVaultContext } from "./vaultContext";
import { FollowUpMessage, buildFollowUpSystemPrompt, askFollowUp } from "./followUp";
import { PROVIDERS } from "./providers";

export const TAROT_VIEW_TYPE = "second-brain-tarot-view";

const CARD_W = 96;
const CARD_H = 138;
const TABLE_W = 760;
const TABLE_H = 560;
const CENTER_X = TABLE_W / 2;
const CENTER_Y = TABLE_H / 2;

type LayoutPos = { dx: number; dy: number; rot: number };

function layoutRow(n: number, spacing = 190): LayoutPos[] {
  const mid = (n - 1) / 2;
  return Array.from({ length: n }, (_, i) => ({ dx: (i - mid) * spacing, dy: 0, rot: 0 }));
}

function layoutArc(n: number, radius = 240, startDeg = 160, endDeg = 20, bow = 0.7): LayoutPos[] {
  return Array.from({ length: n }, (_, i) => {
    const t = n > 1 ? i / (n - 1) : 0;
    const deg = startDeg + (endDeg - startDeg) * t;
    const rad = (deg * Math.PI) / 180;
    return { dx: radius * Math.cos(rad), dy: -radius * Math.sin(rad) * bow, rot: 0 };
  });
}

function layoutCircle(n: number, radius = 230): LayoutPos[] {
  return Array.from({ length: n }, (_, i) => {
    const rad = ((i * (360 / n) - 90) * Math.PI) / 180;
    return { dx: radius * Math.cos(rad), dy: radius * Math.sin(rad), rot: 0 };
  });
}

function layoutCelticCross(): LayoutPos[] {
  return [
    { dx: 0, dy: 0, rot: 0 }, // Heart of the Matter
    { dx: 12, dy: -12, rot: 90 }, // The Challenge — crosses card 0
    { dx: 0, dy: 150, rot: 0 }, // The Foundation
    { dx: -150, dy: 0, rot: 0 }, // Recent Past
    { dx: 0, dy: -150, rot: 0 }, // The Crown
    { dx: 150, dy: 0, rot: 0 }, // Near Future
    { dx: 370, dy: 210, rot: 0 }, // Your Attitude — staff, bottom
    { dx: 370, dy: 70, rot: 0 }, // External Influences
    { dx: 370, dy: -70, rot: 0 }, // Hopes and Fears
    { dx: 370, dy: -210, rot: 0 }, // The Outcome — staff, top
  ];
}

function getLayout(spreadName: SpreadName, n: number): LayoutPos[] {
  if (spreadName === "celtic_cross") return layoutCelticCross();
  if (spreadName === "horseshoe") return layoutArc(n);
  if (spreadName === "year_ahead") return layoutCircle(n);
  return layoutRow(n, n <= 3 ? 200 : 130);
}

interface ReadingState {
  spreadName: SpreadName;
  question: string;
  drawn: DrawnCard[];
  spread: SpreadPosition[];
  revealed: boolean[];
  interpretation: Interpretation | null;
  interpreting: boolean;
  error: string | null;
  vaultContext: string;
  followUpSystemPrompt: string | null;
  followUpHistory: FollowUpMessage[];
  followUpPending: boolean;
  savedReadingPath: string | null; // set once the note exists — reading and
  // follow-up both write into this same file, never a second note.
  savedFollowUpCount: number; // how many follow-up messages are already
  // persisted in that note, so re-saving only appends what's new.
  focusedIndex: number | null; // last-clicked card — brought to the front of
  // the stack so a dense spread (horseshoe, year-ahead) doesn't bury it
  // under a neighboring card.
}

export class TarotView extends ItemView {
  plugin: SecondBrainTarotPlugin;
  reading: ReadingState | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: SecondBrainTarotPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return TAROT_VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Second-Brain Tarot";
  }

  getIcon(): string {
    return "sparkles";
  }

  private activeLLMConfig(): LLMConfig {
    const { provider, apiKeys, models } = this.plugin.settings;
    return { providerId: provider, apiKey: apiKeys[provider], model: models[provider] };
  }

  async onOpen(): Promise<void> {
    this.renderSetup();
  }

  async onClose(): Promise<void> {
    // nothing to tear down
  }

  private renderSetup(): void {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("tarot-root");

    root.createEl("h2", { text: "Second-Brain Tarot" });

    const { provider, apiKeys } = this.plugin.settings;
    if (!apiKeys[provider]) {
      root.createEl("p", {
        text: `Add your ${PROVIDERS[provider].label} API key in Settings → Second-Brain Tarot before drawing a reading.`,
        cls: "tarot-warning",
      });
      return;
    }

    const form = root.createDiv({ cls: "tarot-setup-form" });

    form.createEl("label", { text: "Spread" });
    const spreadSelect = form.createEl("select");
    for (const [key, positions] of Object.entries(SPREADS)) {
      const opt = spreadSelect.createEl("option", { text: `${spreadLabel(key as SpreadName)} (${positions.length} cards)` });
      opt.value = key;
    }
    spreadSelect.value = this.plugin.settings.defaultSpread;

    form.createEl("label", { text: "Question (optional)" });
    const questionInput = form.createEl("input", { type: "text", placeholder: "What are you actually asking about?" });

    const drawButton = form.createEl("button", { text: "Draw", cls: "mod-cta" });
    drawButton.onclick = () => this.startReading(spreadSelect.value as SpreadName, questionInput.value.trim());
  }

  private async startReading(spreadName: SpreadName, question: string): Promise<void> {
    const spread = SPREADS[spreadName];
    const drawn = draw(TAROT_DECK, spread.length);

    this.reading = {
      spreadName,
      question,
      drawn,
      spread,
      revealed: new Array(drawn.length).fill(false),
      interpretation: null,
      interpreting: true,
      error: null,
      vaultContext: "",
      followUpSystemPrompt: null,
      followUpHistory: [],
      followUpPending: false,
      savedReadingPath: null,
      savedFollowUpCount: 0,
      focusedIndex: null,
    };

    this.renderReading();

    try {
      const vaultContext = await loadVaultContext(this.app, this.plugin.settings.maxVaultChars);
      const interpretation = await interpretReading(this.activeLLMConfig(), vaultContext, question, drawn, spread);
      if (this.reading) {
        this.reading.vaultContext = vaultContext;
        this.reading.interpretation = interpretation;
        this.reading.interpreting = false;
        // Built once here — every follow-up question rides on this same
        // fixed context rather than re-sending the vault/spread each time.
        this.reading.followUpSystemPrompt = buildFollowUpSystemPrompt(vaultContext, drawn, spread, interpretation);
        this.renderReading();
      }
    } catch (e: any) {
      if (this.reading) {
        this.reading.error = e?.message ?? String(e);
        this.reading.interpreting = false;
        this.renderReading();
      }
    }
  }

  private renderReading(): void {
    const r = this.reading;
    if (!r) return;

    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("tarot-root");

    const header = root.createDiv({ cls: "tarot-header" });
    header.createEl("h3", { text: `${spreadLabel(r.spreadName)} reading` });
    if (r.question) header.createEl("p", { text: `Question: ${r.question}`, cls: "tarot-question" });

    const status = header.createEl("p", { cls: "tarot-status" });
    if (r.interpreting) status.setText("Interpreting the full spread — click any card to reveal it while you wait.");
    else if (r.error) status.setText(`Something went wrong: ${r.error}`);
    else status.setText("Click a card to reveal it, or open the synthesis below.");

    const layout = getLayout(r.spreadName, r.drawn.length);
    const table = root.createDiv({ cls: "tarot-table" });
    table.style.width = `${TABLE_W}px`;
    table.style.height = `${TABLE_H}px`;

    r.drawn.forEach((card, i) => {
      const pos = layout[i];
      const isFocused = r.focusedIndex === i;
      // Dense spreads (horseshoe, year-ahead) have real overlap between
      // neighboring cards by design — clicking one brings it to the front
      // of the stack, rather than trying to eliminate overlap entirely.
      const zIndex = isFocused ? 100 : 1;

      const cardEl = table.createDiv({ cls: "tarot-card" + (r.revealed[i] ? " revealed" : "") });
      cardEl.style.width = `${CARD_W}px`;
      cardEl.style.height = `${CARD_H}px`;
      cardEl.style.left = `calc(50% + ${pos.dx}px)`;
      cardEl.style.top = `calc(50% + ${pos.dy}px)`;
      cardEl.style.transform = `translate(-50%, -50%) rotate(${pos.rot}deg)`;
      cardEl.style.zIndex = String(zIndex);

      if (r.revealed[i]) {
        const img = cardEl.createEl("img", { cls: "tarot-card-image" });
        img.src = this.plugin.cardImageSrc(card.image);
        // Reversed cards show their artwork upside down — the actual
        // physical-tarot convention, not just a text label. Applied to the
        // image element specifically (not cardEl), so it composes correctly
        // with the outer position rotation on the Celtic Cross "Challenge"
        // card instead of fighting it.
        if (card.orientation === "reversed") img.style.transform = "rotate(180deg)";
        img.onerror = () => {
          // Artwork not present — fall back to a text-only card face rather
          // than a broken image icon. Left right-side-up even if reversed;
          // upside-down text is a readability problem the art convention
          // doesn't have.
          img.remove();
          cardEl.createDiv({ cls: "tarot-card-fallback", text: card.name });
        };
        cardEl.createDiv({ cls: `tarot-card-orientation ${card.orientation}`, text: card.orientation });

        // Card name, as its own element above the card (not nested inside
        // cardEl) so it stays upright even on the rotated Celtic Cross
        // "Challenge" card — real artwork alone doesn't make the card's
        // identity obvious at a glance, so this is shown regardless of
        // whether the fallback text face is also showing.
        const nameLabel = table.createDiv({ cls: "tarot-card-name" });
        nameLabel.style.left = `calc(50% + ${pos.dx}px)`;
        nameLabel.style.top = `calc(50% + ${pos.dy - CARD_H / 2 - 8}px)`;
        nameLabel.style.zIndex = String(zIndex);
        nameLabel.setText(card.name);
      } else {
        cardEl.createDiv({ cls: "tarot-card-back" });
      }

      const label = table.createDiv({ cls: "tarot-position-label" });
      label.style.left = `calc(50% + ${pos.dx}px)`;
      label.style.top = `calc(50% + ${pos.dy + CARD_H / 2 + 8}px)`;
      label.style.zIndex = String(zIndex);
      label.setText(r.spread[i].name);

      cardEl.onclick = () => {
        r.revealed[i] = true;
        r.focusedIndex = i;
        this.renderReading();
        this.showPositionText(i);
      };
    });

    const panel = root.createDiv({ cls: "tarot-panel" });
    this.textPanel = panel.createDiv({ cls: "tarot-text" });
    this.textPanel.setText("Click a card to see its reading here.");

    const actions = root.createDiv({ cls: "tarot-actions" });
    const synthesisBtn = actions.createEl("button", { text: "Synthesis" });
    synthesisBtn.onclick = () => this.showSynthesis();

    if (this.plugin.settings.saveReadingsToNote) {
      const saveBtn = actions.createEl("button", { text: "Save as note", cls: "mod-cta" });
      saveBtn.disabled = !r.interpretation;
      saveBtn.onclick = () => this.saveAsNote();
    }

    const newBtn = actions.createEl("button", { text: "New reading" });
    newBtn.onclick = () => {
      this.reading = null;
      this.renderSetup();
    };

    const followUpSection = root.createDiv({ cls: "tarot-followup" });
    this.renderFollowUpSection(followUpSection);
  }

  private textPanel: HTMLElement | null = null;
  private followUpHistoryEl: HTMLElement | null = null;

  /** Renders (or re-renders) just the follow-up thread + input, without
   * touching the card table — called both from renderReading() and after
   * every question, so the cards don't flicker on each round of Q&A. */
  private renderFollowUpSection(container: HTMLElement): void {
    const r = this.reading;
    container.empty();
    if (!r) return;

    container.createEl("h4", { text: "Ask a follow-up" });

    if (!r.interpretation) {
      container.createEl("p", {
        text: "Available once the initial reading finishes interpreting.",
        cls: "tarot-pending",
      });
      return;
    }

    this.followUpHistoryEl = container.createDiv({ cls: "tarot-followup-history" });
    this.renderFollowUpHistory();

    const inputRow = container.createDiv({ cls: "tarot-followup-input-row" });
    const input = inputRow.createEl("input", {
      type: "text",
      placeholder: "Ask about a specific card, or how they connect...",
    });
    const askBtn = inputRow.createEl("button", { text: "Ask", cls: "mod-cta" });

    const submit = () => {
      const question = input.value.trim();
      if (!question || r.followUpPending) return;
      input.value = "";
      this.askFollowUpQuestion(question);
    };
    askBtn.onclick = submit;
    input.onkeydown = (e) => {
      if (e.key === "Enter") submit();
    };

    if (r.followUpPending) {
      input.disabled = true;
      askBtn.disabled = true;
    }

    if (this.plugin.settings.saveReadingsToNote) {
      const saveFollowUpBtn = container.createEl("button", {
        text: "Save follow-up as note",
        cls: "tarot-save-followup",
      });
      saveFollowUpBtn.disabled = r.followUpHistory.length === 0;
      saveFollowUpBtn.onclick = () => this.saveFollowUpAsNote();
    }
  }

  private renderFollowUpHistory(): void {
    const r = this.reading;
    if (!r || !this.followUpHistoryEl) return;
    this.followUpHistoryEl.empty();

    for (const msg of r.followUpHistory) {
      const entry = this.followUpHistoryEl.createDiv({
        cls: `tarot-followup-message ${msg.role}`,
      });
      entry.createEl("strong", { text: msg.role === "user" ? "You: " : "Reading: " });
      entry.createSpan({ text: msg.content });
    }

    if (r.followUpPending) {
      this.followUpHistoryEl.createDiv({ cls: "tarot-pending", text: "Thinking..." });
    }

    this.followUpHistoryEl.scrollTop = this.followUpHistoryEl.scrollHeight;
  }

  private async askFollowUpQuestion(question: string): Promise<void> {
    const r = this.reading;
    if (!r || !r.followUpSystemPrompt) return;

    r.followUpHistory.push({ role: "user", content: question });
    r.followUpPending = true;
    this.renderFollowUpHistory();

    try {
      const answer = await askFollowUp(
        this.activeLLMConfig(),
        r.followUpSystemPrompt,
        r.followUpHistory.slice(0, -1), // history before this question — askFollowUp appends it itself
        question
      );
      r.followUpHistory.push({ role: "assistant", content: answer });
    } catch (e: any) {
      r.followUpHistory.push({ role: "assistant", content: `Error: ${e?.message ?? String(e)}` });
    } finally {
      r.followUpPending = false;
      // Re-render the whole section (not just history) so the input/button
      // re-enable correctly.
      const container = this.containerEl.querySelector(".tarot-followup") as HTMLElement | null;
      if (container) this.renderFollowUpSection(container);
    }
  }

  private showPositionText(i: number): void {
    const r = this.reading;
    if (!r || !this.textPanel) return;
    const position = r.spread[i];
    const card = r.drawn[i];
    this.textPanel.empty();
    this.textPanel.createEl("strong", { text: `${position.name}: ${card.name} (${card.orientation})` });
    this.textPanel.createEl("br");
    this.textPanel.createEl("br");
    if (r.error) {
      this.textPanel.createSpan({ text: `Error: ${r.error}`, cls: "tarot-error" });
    } else if (!r.interpretation) {
      this.textPanel.createSpan({ text: "Still interpreting the full spread — one moment...", cls: "tarot-pending" });
    } else {
      this.textPanel.createSpan({ text: r.interpretation.cards[i]?.reading ?? "" });
    }
  }

  private showSynthesis(): void {
    const r = this.reading;
    if (!r || !this.textPanel) return;
    this.textPanel.empty();
    this.textPanel.createEl("strong", { text: "Synthesis" });
    this.textPanel.createEl("br");
    this.textPanel.createEl("br");
    if (r.error) {
      this.textPanel.createSpan({ text: `Error: ${r.error}`, cls: "tarot-error" });
    } else if (!r.interpretation) {
      this.textPanel.createSpan({ text: "Still interpreting the full spread — one moment...", cls: "tarot-pending" });
    } else {
      this.textPanel.createSpan({ text: r.interpretation.synthesis });
    }
  }

  /** The reading itself, as note body lines — shared by saveAsNote() and by
   * saveFollowUpAsNote()'s fallback (reading was never explicitly saved, so
   * the first follow-up save has to create the note with both in it). */
  private readingBodyLines(r: ReadingState): string[] {
    const lines: string[] = [
      `# ${spreadLabel(r.spreadName)} Reading`,
      `**Date:** ${window.moment().format("YYYY-MM-DD HH:mm")}  `,
    ];
    if (r.question) lines.push(`**Question:** ${r.question}  `);
    lines.push("");
    if (r.interpretation) {
      r.drawn.forEach((card, i) => {
        const entry = r.interpretation!.cards[i];
        lines.push(`## ${r.spread[i].name}: ${card.name} (${card.orientation})`);
        lines.push(entry?.reading ?? "");
        lines.push("");
      });
      lines.push("## Synthesis");
      lines.push(r.interpretation.synthesis);
    }
    return lines;
  }

  /** Follow-up Q&A as note lines, with a heading — used once, the first time
   * follow-up content is written into the note (whether that's at initial
   * creation or on the first "Save follow-up" click). */
  private followUpBodyLines(messages: FollowUpMessage[], withHeading: boolean): string[] {
    const lines: string[] = [];
    if (withHeading) {
      lines.push("");
      lines.push("## Follow-up");
      lines.push("");
    }
    for (const msg of messages) {
      lines.push(`**${msg.role === "user" ? "You" : "Reading"}:** ${msg.content}`);
      lines.push("");
    }
    return lines;
  }

  private async ensureReadingsFolder(): Promise<string> {
    const folder = normalizePath(this.plugin.settings.readingsFolder);
    if (!this.app.vault.getAbstractFileByPath(folder)) {
      await this.app.vault.createFolder(folder).catch(() => {});
    }
    return folder;
  }

  private async saveAsNote(): Promise<void> {
    const r = this.reading;
    if (!r || !r.interpretation) return;

    const folder = await this.ensureReadingsFolder();
    const timestamp = window.moment().format("YYYY-MM-DD_HHmm");
    const filename = normalizePath(`${folder}/reading-${r.spreadName}-${timestamp}.md`);

    const lines = this.readingBodyLines(r);
    // If a follow-up conversation already happened before this first save,
    // fold it in now rather than losing it — everything lands in one note.
    if (r.followUpHistory.length > 0) {
      lines.push(...this.followUpBodyLines(r.followUpHistory, true));
      r.savedFollowUpCount = r.followUpHistory.length;
    }

    await this.app.vault.create(filename, lines.join("\n"));
    r.savedReadingPath = filename;
    new Notice(`Saved reading to ${filename}`);
  }

  private async saveFollowUpAsNote(): Promise<void> {
    const r = this.reading;
    if (!r || r.followUpHistory.length === 0) return;

    const newMessages = r.followUpHistory.slice(r.savedFollowUpCount);
    if (newMessages.length === 0) {
      new Notice("Follow-up is already saved in the note.");
      return;
    }

    const existingFile = r.savedReadingPath ? this.app.vault.getAbstractFileByPath(r.savedReadingPath) : null;

    if (existingFile instanceof TFile) {
      // The reading's note already exists — append into that same file
      // rather than creating a second one. Only add the "## Follow-up"
      // heading the first time; after that it's just more messages under it.
      const needsHeading = r.savedFollowUpCount === 0;
      const addition = this.followUpBodyLines(newMessages, needsHeading).join("\n");
      await this.app.vault.append(existingFile, "\n" + addition);
      r.savedFollowUpCount = r.followUpHistory.length;
      new Notice(`Added follow-up to ${r.savedReadingPath}`);
      return;
    }

    // No reading note saved yet — create one note with both the reading
    // (if it exists) and the full follow-up thread, so there's still only
    // ever one file, regardless of which save button was clicked first.
    const folder = await this.ensureReadingsFolder();
    const timestamp = window.moment().format("YYYY-MM-DD_HHmm");
    const filename = normalizePath(`${folder}/reading-${r.spreadName}-${timestamp}.md`);

    const lines = this.readingBodyLines(r);
    lines.push(...this.followUpBodyLines(r.followUpHistory, true));

    await this.app.vault.create(filename, lines.join("\n"));
    r.savedReadingPath = filename;
    r.savedFollowUpCount = r.followUpHistory.length;
    new Notice(`Saved reading and follow-up to ${filename}`);
  }
}
