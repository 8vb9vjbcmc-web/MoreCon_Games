# Site Crew Showdown — Game Design Document

## Concept
A 3-player pass-and-play social deduction game for kids, played on one mobile device.
Themed around a Mortenson construction site. Inspired by Among Us.

## Players & Roles
- **3 players** — always exactly 3 (designed for the Moreno kids)
- **2 Crewmates** — complete site tasks, identify the Saboteur
- **1 Saboteur** — secretly sabotages tasks, avoids being voted out

## Win Conditions
- **Crewmates win**: Complete all 6 tasks OR correctly vote out the Saboteur
- **Saboteur wins**: Gets crewmates to vote out an innocent player (eliminating them),
  leaving 1v1 where Saboteur can't lose, OR prevents all tasks from completing

## Game Flow

### Phase 1 — Setup
1. App shows "Pass to Player 1 — look away everyone"
2. Player 1 taps to see their secret role (Crewmate or Saboteur)
3. Handoff screen shown, repeat for Players 2 and 3

### Phase 2 — Task Round (repeats)
Each player takes a turn on their own:
1. "Pass to [Player Name] — eyes away!"
2. Player sees their task: e.g., "Inspect the rebar" (tap 5 targets in 5 sec)
3. Crewmate: completes real task → logs ✅
4. Saboteur: sees fake task → secretly logs ❌ (looks the same from outside)
5. Handoff to next player

### Phase 3 — Discussion
After all 3 players complete a task round:
- 60-second free discussion timer shown on screen
- Players talk out loud — no chat, no in-app messages
- Kids physically discuss who they think the Saboteur is

### Phase 4 — Vote
- Each player votes privately (pass-and-play, tap their choice)
- Majority vote eliminates a player
- App reveals if eliminated player was Crewmate or Saboteur
- If Saboteur: Crewmates win 🎉
- If Crewmate: continue (Saboteur gets 1 shield used if invoked)
- After elimination, remaining players continue tasks until win condition

## Task Mini-Games (Phase 1 build — 3 tasks)
1. **Inspect the Rebar** — tap 5 glowing spots before timer runs out
2. **Sign the Permit** — trace a signature path with finger
3. **Check the Blueprint** — tap the matching symbol from 4 options

## State Shape
```javascript
{
  players: [
    { id: 1, name: "Player 1", role: "crewmate" | "saboteur", eliminated: false },
    { id: 2, name: "Player 2", role: "crewmate", eliminated: false },
    { id: 3, name: "Player 3", role: "crewmate", eliminated: false },
  ],
  phase: "setup" | "tasks" | "discussion" | "vote" | "result",
  currentPlayerIndex: 0,
  taskResults: { 1: true, 2: false, 3: true }, // playerId → completed
  tasksCompleted: 0,
  totalTasks: 6,
  round: 1,
  saboteurShieldUsed: false,
  votes: { 1: 2, 2: 3, 3: 2 }, // voterId → targetId
  winner: null | "crewmates" | "saboteur"
}
```

## Roadmap
- **Phase 1**: Role setup, 3 mini-tasks, voting, win detection (playable MVP)
- **Phase 2**: 3 more mini-tasks, discussion timer, animation polish
- **Phase 3**: Custom player names, character selection, score history
- **Phase 4**: Sound effects, haptic feedback, accessibility pass
