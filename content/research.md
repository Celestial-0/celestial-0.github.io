+++
title = "Research"
render = false
+++

## 02 — Research Papers

*Publications, preprints, and academic collaborations*

### ClaimLedger → A Provenance-Aware and Temporally Valid Memory Layer for Conflict- and Poisoning-Resilient RAG
*Systems Research (Preprint) · 2026*

Decomposes long-term LLM agent memory observations into atomic claims governed by an append-only bitemporal ledger (valid time + transaction time) with explicit lifecycle states, trust tiers, confidence scores, and conflict relationships. Gating retrieval by integrity constraints rather than similarity prevents stale, contradictory, or poisoned information from entering downstream generations.

- **Innovations:** Claim-level memory representation · Append-only provenance ledger · Bitemporal verification rules · Trust-aware write pipeline · Poison-memory quarantine
- **Evaluation:** Tested against LoCoMo-derived perturbations, achieving 1.000 Active Claim Accuracy, 1.000 Conflict Disclosure, and 0.000 Poison Activation (improving temporal boundary reasoning from 30% to 100%)
- **Stack & Focus:** Python · SQLite · uv · JSONL evaluation · LoCoMo benchmarks · Bitemporal ledger · RAG · Agent Memory Systems · AI Security · Temporal Databases

- **Links:** [GitHub Code ↗](#) [Paper PDF ↗](#)
