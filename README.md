# 🏗️ Site Crew Showdown

> A pass-and-play social deduction game for 3 players — built for the Moreno family.

Inspired by Among Us. Themed around a Mortenson construction site.  
One device. Three kids. One Saboteur hiding among the crew.

---

## 🎮 How to Play

1. **Setup** — App secretly assigns one player as the **Saboteur**
2. **Tasks** — Each player completes a construction mini-task on their turn
3. **Discuss** — 60 seconds to argue about who's acting suspicious
4. **Vote** — Vote to eliminate your suspect
5. **Win** — Crewmates finish tasks or catch the Saboteur. Saboteur avoids detection.

## 🛠️ Tech Stack

- **React** (PWA — runs in any mobile browser)
- **Vite** (build tool)
- **Vitest** (testing)
- **Zero backend** — all state in React, no server, no auth, no database

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` on your phone (or any browser).

## 📁 Structure

```
src/
├── components/    # React UI screens
├── game/          # Pure game logic — no React imports
└── assets/        # SVGs, icons
.claude/
└── agents/        # Claude Code subagent definitions
    ├── explorer.md          # Haiku: fast codebase search
    ├── tester.md            # Haiku: test runner
    ├── component-builder.md # Sonnet: React UI builds
    └── game-designer.md     # Opus: architecture & game balance
docs/
└── GAME_DESIGN.md   # Full game rules and state shape
```

## 🤖 AI Development Setup

This repo is configured for Claude Code with a 3-tier model delegation strategy.
See `CLAUDE.md` for the full guide.

**Quick start:**
```bash
# Set Haiku as default subagent (search/explore tasks)
export CLAUDE_CODE_SUBAGENT_MODEL="claude-haiku-4-5-20251001"

# Launch Claude Code on Sonnet (daily driver)
claude --model claude-sonnet-4-6
```

## 🎨 Theme

Mortenson construction site — hard hats, cranes, blueprints.

| Color | Hex | Use |
|---|---|---|
| Cobalt Blue | `#0E2A7E` | Primary / header |
| Hard Hat Yellow | `#F5C800` | Accent / actions |
| White | `#FFFFFF` | Backgrounds |
| Concrete Gray | `#6B7280` | Secondary text |
| Danger Red | `#DC2626` | Saboteur / alerts |

---

Built with ❤️ for three kids who deserve their own game.
