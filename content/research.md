+++
title = "Research"
render = false
+++

## 02 — Research Papers

*Publications, preprints, and academic collaborations*

### ClaimLedger → A Provenance-Aware, Bitemporal Claim-Integrity Layer for Agent Memory
*Systems Research (Preprint) · 2026 · v1.0.0*

An append-only, claim-level memory integrity layer for long-term agent memory in agentic RAG. Instead of storing memory as text chunks or vector entries, ClaimLedger governs retrieval eligibility at the atomic claim level — tracking derivation provenance, bitemporal metadata (valid time vs. transaction time), trust tiers with confidence gates, and lifecycle states. Integrity constraints, not similarity, decide what reaches downstream generation, so stale, contradictory, and adversarially poisoned writes are filtered, superseded, or quarantined before they can influence a response.

- **Innovations:** Claim-level memory decomposition · Append-only provenance ledger · Bitemporal valid-time/transaction-time tracking · Trust-tier and confidence gates · Lifecycle governance (active, candidate, superseded, quarantined) · Poison-write quarantine against sleeper and agent-poisoning attacks
- **Evaluation:** REALTALK-derived benchmark of 2,387 cases from 10 authentic conversations (219 sessions, 8,944 turns, 726 evidence-linked human-annotated questions) with controlled conflict and poison overlays; identical results across three deterministic seeds. Versus naive active memory: Active-Claim Accuracy 0.392 → 1.000, Conflict Disclosure 0.000 → 1.000, Poison Activation 1.000 → 0.000
- **Stack & Focus:** Python · SQLite · uv · CLI · JSONL/Plotly reporting · REALTALK benchmarks · Bitemporal ledger · RAG · Agent Memory Systems · AI Security · Temporal Databases

- **Links:** [GitHub Code ↗](https://github.com/Celestial-0/ClaimLedger) [Paper PDF ↗](https://github.com/Celestial-0/ClaimLedger/releases/download/v1.0.0/ClaimLedger.pdf)
