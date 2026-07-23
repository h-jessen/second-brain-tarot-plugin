# Second-Brain Tarot

[Available in Obsidian's Community Plugins directory](https://obsidian.md/plugins?id=second-brain-tarot) — install directly from Settings → Community plugins → Browse, or search "Second-Brain Tarot".

An Obsidian plugin that draws a real, complete 78-card tarot deck and interprets it
fresh against your own vault's content — not generic tarot-book copy, not a fixed
lookup table.

Each reading loads relevant context from your vault (via Obsidian's own
`app.vault`/metadata APIs — always the vault you actually have open) and sends it,
along with your card draw, to an AI provider of your choice. The model is asked to
ground each card's reading in something real and specific from your notes, the way an
attentive reader listens to a client's actual situation rather than reciting a book.

## Features

- Six spreads: single card, three-card (Past/Present/Future), Celtic Cross, horseshoe,
  one-card-plus-clarifier, year-ahead — each laid out in its own real spread geometry,
  not a grid.
- Click-to-reveal cards, upright/reversed orientation (reversed cards flip their
  artwork, not just a text label).
- A synthesis of the whole spread, not just per-card readings in isolation.
- Multi-turn follow-up chat, grounded in the same vault context and reading the model
  just gave.
- Optional save-as-note — writes the reading (and any follow-up) directly into your
  vault with real `[[wikilinks]]`, either as a new note or appended into the
  currently-open one.
- Bring your own API key. Choose Anthropic (Claude), Google (Gemini), xAI (Grok), or
  OpenAI (GPT) in settings — nothing is proxied through any other server, requests go
  straight from your machine to whichever provider you pick.

## Setup

1. Install via Obsidian's Community Plugins browser (search "Second-Brain Tarot"), or
   copy this folder manually into `<your-vault>/.obsidian/plugins/second-brain-tarot/`.
2. Enable it in Obsidian's Community Plugins settings.
3. Open Settings → Second-Brain Tarot, pick a provider, and paste in your own API key
   for that provider.
4. Open the plugin from the ribbon icon (sparkles) or the command palette ("Draw a
   tarot reading").

Your API key is stored locally in this vault's plugin settings, in plain text — the
same convention most Obsidian AI-integration plugins use. It is not encrypted.

## Security & privacy

- **API keys live in plain text in `data.json`.** Once installed, your key is stored,
  unencrypted, at `<your-vault>/.obsidian/plugins/second-brain-tarot/data.json`. If
  you track your vault (or `.obsidian/`) in git, add that path to your `.gitignore` —
  don't commit it.
- **Readings can surface genuinely sensitive material.** Interpretations are built
  from real content in your vault — grief, relationship history, career doubts,
  whatever a card's position theme happens to pull in. That's the point of the
  plugin, but it means a saved reading note is not something to share or publish
  without reviewing it first. Where a reading goes from there is on you; the plugin
  doesn't restrict or filter what it saves.

## Artwork

All 78 cards use scans of the 1909 Pamela Colman Smith / Rider-Waite-Smith deck,
sourced from Wikimedia Commons' *Pictorial Key to the Tarot* collection
(`assets/cards/`). Public domain: the work's copyright term (life of the author plus
70 years) has expired in its country of origin, and it was published before January
1, 1931, placing it in the public domain in the United States as well.

## Development

```
npm install
npm run dev     # watch build
npm run build   # typecheck + production build
```

`main.ts` is the plugin entry point; `src/` holds the deck data, spreads, draw logic,
vault-context loading, the AI provider adapters (`src/providers/`), and the custom
view.
