# Open literature and paper-linking plan

## Product principle

Citation data is evidence, not intellectual causality. Imported citation edges must remain visually and semantically distinct until a researcher promotes one into a relationship such as `MOTIVATED_BY`, `SOLVES`, `EXTENDS`, or `CONTRADICTS` and explains why.

## Provider decision

1. **OpenAlex — primary discovery graph.** Use for paper search, persistent OpenAlex IDs, DOI resolution, references, citations, related works, authors, topics, and open-access locations. Its dataset is CC0. Basic keyless use is possible; a free key should eventually be held behind a server-side proxy for dependable quotas.
2. **Crossref — metadata fallback.** Use when OpenAlex search is unavailable or for DOI metadata reconciliation. Its public REST API requires no signup and most metadata can be reused without restriction. Abstracts can carry separate copyright.
3. **OpenCitations — citation verification.** Use DOI-to-DOI reference and citation lookups. Its citation data is CC0, its API is public, and its API service is open source under ISC.
4. **Semantic Scholar — optional enrichment.** Consider later for SPECTER embeddings, recommendations, TLDR fields, and coverage repair. API use is subject to AI2's API license and private keys must stay server-side.
5. **Connected Papers — optional provider.** Official MIT-licensed JavaScript and Python clients exist, but general tokens are early-access by email and the service is not the primary open-data dependency.

ResearchRabbit and Litmaps remain design references only because no supported public developer API or reusable application source was verified.

## Implemented first slice

- Added DOI, arXiv, source, PDF, provider, and citation-count fields to research nodes.
- Added primary-source links to the paper detail panel.
- Added an **Add paper** literature panel.
- Added OpenAlex search with automatic Crossref fallback.
- Added explicit semantic-edge selection and an editable relationship explanation before import.
- Added DOI/external-ID deduplication.
- Added local persistence for imported papers and relationships.
- Added provenance labels so imported metadata is never confused with curated analysis.

## Next unattended slice

1. Add OpenCitations one-hop expansion for references and citing papers.
2. Render machine citation edges as a separate, disabled-by-default evidence layer.
3. Add “promote to causal edge” instead of silently converting citations.
4. Add multi-seed discovery inspired by Citation Gecko and ResearchRabbit.
5. Add prior-work / derivative-work summaries inspired by Connected Papers.
6. Add saved collections and monitoring inspired by Litmaps.
7. Add request caching, abort handling, backoff, and rate-limit indicators.
8. Add browser-level interaction tests and accessibility checks.

## Supabase boundary

Use a new Supabase project owned by the ML Civilization maintainer. The included `supabase/schema.sql` creates user-owned nodes, edges, and notes with Row Level Security.

Do not place provider API keys in Vite environment variables: values prefixed with `VITE_` are shipped to the browser. A later Supabase Edge Function should proxy authenticated OpenAlex/Semantic Scholar requests and cache normalized results. Only the Supabase publishable/anon key belongs in the browser, protected by RLS.

## Open-source visual references

- Oignon: MIT-licensed chronological citation graphs built on OpenAlex.
- Open Knowledge Maps / Head Start: open knowledge-map and clustering architecture.
- Citation Gecko: multi-seed citation exploration; inspect ideas, but verify its repository license before reusing code.
- Connected Papers API clients: MIT-licensed typed client patterns.

The production UI should remain original and should not copy branding, layouts, or proprietary graph-ranking implementations.
