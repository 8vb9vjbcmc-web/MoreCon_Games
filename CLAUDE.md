# CLAUDE.md — Family Deduction Game
## Project: Site Crew Showdown 🏗️
> A pass-and-play social deduction game for 3 players. Built for the Moreno family.

---

## 🧠 Model Delegation Strategy

This project uses a three-tier model stack. Follow these rules strictly to balance
quality and cost across all agentic sessions.

### Tier Assignment

| Task Type | Model | Reason |
|---|---|---|
| Architecture decisions, new feature design, game balance | **Opus** | Deep reasoning required |
| React component builds, game logic, bug fixes, PR review | **Sonnet 4.6** | Daily driver — best quality/cost ratio |
| File search, grep, reading, context gathering, test runs | **Haiku 4.5** | Fast and cheap — 15x cheaper than Opus |

### How to Launch Correctly

```bash
# Standard dev session — Sonnet does the work
claude --model claude-sonnet-4-6

# Architecture / design session — Opus plans, Sonnet implements
claude --model claude-opus-4-8

# Set default subagent model (always Haiku for search/explore tasks)
export CLAUDE_CODE_SUBAGENT_MODEL="claude-haiku-4-5-20251001"
```

### When to Switch Models Mid-Session

- **Upgrade to Opus** when: designing a new game phase, balancing impostor logic, 
  deciding on state architecture, or evaluating tradeoffs with multiple valid paths.
- **Stay on Sonnet** when: building components, writing tests, fixing bugs, writing docs.
- **Delegate to Haiku** (via subagent) when: searching files, gathering context, 
  running tests, reading existing code to understand it.

---

## 🎮 Project Overview

**Game Name:** Site Crew Showdown  
**Players:** 3 (designed for the Moreno kids — pass-and-play, one device)  
**Platform:** React PWA — works on any phone browser, no install required  
**Backend:** None — all state in React, no server, no auth  
**Theme:** Mortenson construction site — hard hats, cranes, blueprints, site crew  

### Core Loop
1. App secretly assigns one player as the **Saboteur** (impostor)
2. Each player completes a mini-task on their turn (taps to complete)
3. After each round, players discuss and vote to eliminate a suspect
4. Crewmates win by finishing all tasks OR correctly eliminating the Saboteur
5. Saboteur wins by eliminating all crewmates OR preventing task completion

---

## 📁 Project Structure

```
family-deduction-game/
├── CLAUDE.md                    ← You are here
├── .claude/
│   └── agents/                  ← Subagent definitions
│       ├── explorer.md          ← Haiku: codebase search & context
│       ├── tester.md            ← Haiku: run tests, report failures
│       ├── component-builder.md ← Sonnet: build React components
│       └── game-designer.md     ← Opus: game balance & architecture
├── src/
│   ├── components/              ← React UI components
│   ├── game/                    ← Pure game logic (no React)
│   └── assets/                  ← SVG icons, sounds
├── public/
├── docs/
│   ├── GAME_DESIGN.md           ← Canonical game rules & design decisions
│   └── ROADMAP.md               ← Phase plan
├── package.json
└── README.md
```

---

## 🔧 Dev Commands

```bash
npm run dev          # Start local dev server
npm run build        # Production build
npm run test         # Run test suite (Vitest)
npm run lint         # ESLint check
```

---

## ✅ Coding Standards

- **React functional components only** — no class components
- **useState / useReducer** for all game state — no localStorage, no external state lib
- **No backend calls** — this is a pure client-side PWA
- **Mobile-first** — design for 375px width minimum, thumb-friendly tap targets (48px+)
- **No hardcoded player names** — always pull from game state
- **Game logic lives in `src/game/`** — pure functions, fully testable, no React imports

---

## 🚫 Never Do

- Never add a backend or database
- Never store player data externally
- Never install heavyweight animation libraries (Framer Motion, GSAP) — CSS only
- Never break the pass-and-play flow (one device, secret reveal pattern)
- Never add auth, login, or accounts

---

## 🏗️ Mortenson Theme Guide

**Colors:**
- Primary Blue: `#0E2A7E` (Mortenson cobalt)
- White: `#FFFFFF`
- Accent Yellow: `#F5C800` (hard hat yellow)
- Concrete Gray: `#6B7280`
- Warning Red: `#DC2626` (saboteur color)

**Character Names (construction crew):**
- Foreman Frank, Inspector Iris, Crane Operator Carlos, Safety Sam, Blueprint Bea

**Mini-task Names:**
- "Inspect the rebar", "Sign the permit", "Check the blueprint", 
  "Calibrate the crane", "Pour the concrete", "Survey the site"
