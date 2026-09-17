# ML Civilization

An interactive causal atlas of machine-learning history. The prototype focuses on the sequence-modeling lineage from recurrent networks to the Transformer frontier.

## Launch locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite (normally [http://localhost:5173](http://localhost:5173)).

## Production build

```bash
npm run build
npm run preview
```

## Controls

- Drag the background to pan and scroll to zoom.
- Select a node to read its research analysis and edit local notes.
- Press `⌘K` / `Ctrl+K` to search the atlas.
- Toggle **Lineage** to isolate causal ancestry and descendants.
- Toggle **Fog** (or press `F`) to reveal locked territory.
- Switch to **Timeline** for a chronological projection of the same causal graph.

Exploration states and notes are stored in browser local storage.
