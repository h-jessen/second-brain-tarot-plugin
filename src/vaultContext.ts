import { App, TFile, getAllTags } from "obsidian";

const DEFAULT_MAX_CHARS = 40_000;

/**
 * Ported from vault_dialogue.py's load_vault() priority order:
 *   1. A note named _brain.md or brain.md
 *   2. Any note tagged #agent (frontmatter or inline)
 *   3. Fallback: the 40 most recently modified notes
 *
 * Unlike the Python version, this reads the *live, currently-open* vault
 * directly via Obsidian's own APIs — no path to point at, no risk of it
 * going stale relative to what's actually in the vault right now.
 */
export async function loadVaultContext(app: App, maxChars = DEFAULT_MAX_CHARS): Promise<string> {
  const files = app.vault.getMarkdownFiles();

  // Priority 1: _brain.md / brain.md
  const brainFile = files.find((f) => f.basename.toLowerCase() === "_brain" || f.basename.toLowerCase() === "brain");
  if (brainFile) {
    const text = await app.vault.cachedRead(brainFile);
    return text.slice(0, maxChars);
  }

  // Priority 2: #agent-tagged notes
  const tagged: TFile[] = files.filter((f) => {
    const cache = app.metadataCache.getFileCache(f);
    if (!cache) return false;
    const tags = getAllTags(cache) ?? [];
    return tags.some((t) => t.toLowerCase() === "#agent");
  });

  if (tagged.length > 0) {
    const parts: string[] = [];
    let total = 0;
    for (const f of tagged) {
      const text = await app.vault.cachedRead(f);
      const chunk = `# ${f.basename}\n${text}\n`;
      if (total + chunk.length > maxChars) break;
      parts.push(chunk);
      total += chunk.length;
    }
    return parts.join("\n---\n\n");
  }

  // Priority 3: 40 most recently modified notes
  const recent = files.slice().sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, 40);
  const parts: string[] = [];
  let total = 0;
  for (const f of recent) {
    const text = await app.vault.cachedRead(f);
    const chunk = `# ${f.basename}\n${text}\n`;
    if (total + chunk.length > maxChars) break;
    parts.push(chunk);
    total += chunk.length;
  }
  return parts.join("\n---\n");
}
