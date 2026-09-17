# Branch Realizer: evidence-constrained scientific possibility mapping

## Product objective

ML Evolution should show three fundamentally different kinds of branches:

1. **Documented history** — a paper, limitation, mechanism, or consequence supported by sources.
2. **Unrealized history** — a direction that was technically plausible at a historical moment but was not pursued, was abandoned, or remained disconnected from a neighboring field.
3. **Frontier possibility** — a present research hypothesis whose supporting evidence and decisive experiment are explicit.

The interface must never render all three as equivalent facts. Documented edges are solid, inferred historical branches are dotted, and future hypotheses dissolve into fog until a researcher promotes them.

## Recommended model: Branch Realizer

This should be a pipeline rather than one generative model.

### 1. Scientific representation

Use **SPECTER2** embeddings for paper-level semantic representation. Embed titles and only text whose reuse is licensed. Combine these vectors with OpenAlex identifiers, dates, topics, references, citations, and authorship metadata.

### 2. Typed graph completion

Train a small **Relational Graph Convolutional Network (R-GCN)** over the project's human-confirmed semantic relationships. Its task is not “write a research idea”; it ranks missing typed triples such as:

`fixed context bottleneck --MOTIVATES--> candidate mechanism`

or

`paper A --CONTRADICTS--> claim B`

Begin with similarity and graph heuristics while the hand-curated dataset is small. Train the R-GCN only after there are enough confirmed positive and negative edges.

### 3. Temporal branch realization

For a historical year `t`, hide every paper and edge after `t`. Ask the system to rank branches using only information available by `t`. This prevents hindsight leakage and creates a measurable task:

- Can the model recover later realized branches?
- Which highly ranked branches were never explored?
- Were they impossible then, or merely overlooked?

Unrealized branches must be labeled **counterfactual hypotheses**, not discoveries.

### 4. Evidence-grounded explanation

An LLM receives only the selected nodes, source metadata, and retrieved passages with permitted use. It produces a structured candidate:

- prior limitation;
- proposed connection;
- supporting evidence;
- evidence against;
- historical feasibility;
- missing experiment;
- confidence and provenance.

The LLM cannot publish an edge directly. A researcher accepts, edits, rejects, or marks it speculative.

## Initial scoring without model training

The first useful version can rank candidates with an interpretable score:

- 30% semantic compatibility;
- 25% graph-path plausibility;
- 20% limitation-to-mechanism match;
- 15% temporal feasibility;
- 10% independent evidence diversity.

Expose the components to the user. Never present one opaque confidence number as truth.

## Evaluation

- Temporal holdout recovery at 1, 5, and 10 years.
- Precision@k and mean reciprocal rank for candidate edges.
- Edge-type macro F1.
- Probability calibration.
- Researcher acceptance, correction, and rejection rates.
- Novelty: accepted candidates that are not direct citation neighbors.

## Build sequence

1. Add provenance and confidence fields to inferred nodes and edges.
2. Add visual grammar for documented, inferred, counterfactual, and speculative branches.
3. Add OpenAlex one-hop expansion without placing citation edges in the causal layer.
4. Implement deterministic candidate ranking and temporal replay.
5. Collect researcher decisions as training data.
6. Add SPECTER2 embeddings.
7. Train the typed link predictor when the confirmed graph is large enough.
8. Add grounded explanation generation and experiment proposals.
