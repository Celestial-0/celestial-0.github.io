+++
title = "Projects"
render = false
+++

## 03 — Projects

*Selected software, 2025 – 2026*

### [01. OpenTier → High-Performance AI Knowledge Infrastructure](https://opentier.yashkumarsingh.me)
*Jan 2026*

A Rust API gateway and Python intelligence engine connected over gRPC, cutting round-trip latency 30%. A retrieval-augmented pipeline runs on PostgreSQL with pgvector and local sentence-transformer embeddings, and token streams reach the client through Rust-bridged server-sent events.

- **Metrics:** 30% ↓ round-trip latency · sub-120ms retrieval · 50 concurrent streams
- **Stack:** Rust (Axum, Tokio, SQLx) · Python (grpcio, SQLAlchemy) · Next.js · PostgreSQL/pgvector · gRPC · Docker · SSE
- **Links:** [GitHub ↗](https://github.com/Celestial-0/OpenTier) [Docs ↗](https://celestial-0.github.io/OpenTier) [Live ↗](https://opentier.yashkumarsingh.me)

### [02. Nyx → Decentralized End-to-End Encrypted Chat Platform](https://nyx0.vercel.app)
*Dec 2025*

Built a decentralized real-time messaging platform using Bun and Hono with Solana wallet authentication, eliminating traditional credentials. Engineered Redis Pub/Sub for low-latency message delivery, PostgreSQL with Drizzle ORM for persistence, and end-to-end encrypted 1:1 and room-based communication with an event-driven architecture.

- **Metrics:** passwordless authentication · real-time messaging · Redis Pub/Sub · end-to-end encrypted communication
- **Stack:** Bun · Hono · React (TanStack Start) · PostgreSQL · Drizzle ORM · Redis · Solana · WebSockets · Docker
- **Links:** [GitHub ↗](https://github.com/Celestial-0/Nyx) [Docs ↗](https://celestial-0.github.io/Nyx) [Live ↗](https://nyx0.vercel.app)

### [03. CodeNotify → Smart Competitive Programming Alert System](https://code-notify.vercel.app)
*Oct 2025*

Engineered a contest aggregation system that polls contest schedules from 4+ competitive programming platforms on automated cron schedules, serving real-time updates via a NestJS API deployed behind Docker and Caddy with automated HTTPS.

- **Metrics:** 4+ platforms aggregated · 99.9% uptime · automated HTTPS
- **Stack:** Next.js · TypeScript · NestJS · MongoDB · AWS · Caddy · JWT · Zod · Docker · CI/CD
- **Links:** [GitHub ↗](https://github.com/Celestial-0/CodeNotify) [Docs ↗](https://celestial-0.github.io/CodeNotify) [Live ↗](https://code-notify.vercel.app)

### [04. TrueFare → Full-Stack Real-Time Ride-Hailing Platform](https://truefare.yashkumarsingh.me)
*Aug 2025*

Built a real-time fare-bidding and ride-hailing system utilizing WebSockets for live driver-rider messaging and sub-500ms geolocation synchronization under concurrent load.

- **Metrics:** 100+ concurrent users · <500ms sync latency · live fare bidding
- **Stack:** React Native (Expo) · TypeScript · WebSocket · Node.js · MongoDB · Socket.io · Express · Zod
- **Links:** [GitHub ↗](https://github.com/Celestial-0/TrueFare)  [Releases ↗](https://github.com/Celestial-0/TrueFare/releases/tag/v0.2.1-beta)
