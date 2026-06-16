import { describe, it, expect } from 'vitest';
import {
  createGame,
  advanceSetup,
  recordTaskResult,
  castVote,
  resolveVote,
  getCurrentPlayer,
  getActivePlayers,
  ROLES,
  PHASES,
} from './engine.js';

describe('createGame', () => {
  it('creates a game with exactly 3 players', () => {
    const state = createGame(['Alice', 'Bob', 'Charlie']);
    expect(state.players).toHaveLength(3);
  });

  it('assigns exactly one saboteur', () => {
    const state = createGame(['Alice', 'Bob', 'Charlie']);
    const saboteurs = state.players.filter(p => p.role === ROLES.SABOTEUR);
    expect(saboteurs).toHaveLength(1);
  });

  it('assigns exactly two crewmates', () => {
    const state = createGame(['Alice', 'Bob', 'Charlie']);
    const crewmates = state.players.filter(p => p.role === ROLES.CREWMATE);
    expect(crewmates).toHaveLength(2);
  });

  it('starts in setup phase', () => {
    const state = createGame();
    expect(state.phase).toBe(PHASES.SETUP);
  });

  it('throws if not exactly 3 players', () => {
    expect(() => createGame(['Alice', 'Bob'])).toThrow();
  });
});

describe('advanceSetup', () => {
  it('increments setupPlayerIndex', () => {
    const state = createGame();
    const next = advanceSetup(state);
    expect(next.setupPlayerIndex).toBe(1);
  });

  it('transitions to tasks phase after all 3 reveals', () => {
    let state = createGame();
    state = advanceSetup(state); // → player 2
    state = advanceSetup(state); // → player 3
    state = advanceSetup(state); // → tasks phase
    expect(state.phase).toBe(PHASES.TASKS);
  });
});

describe('recordTaskResult', () => {
  it('records a successful task', () => {
    let state = createGame();
    state = { ...state, phase: PHASES.TASKS };
    const player = state.players[0];
    const next = recordTaskResult(state, player.id, true);
    expect(next.taskResults[player.id]).toBe(true);
    expect(next.tasksCompleted).toBe(1);
  });

  it('transitions to discussion after all players complete a round', () => {
    let state = createGame();
    state = { ...state, phase: PHASES.TASKS };
    // All 3 players complete tasks
    state = recordTaskResult(state, 1, true);
    state = recordTaskResult(state, 2, true);
    state = recordTaskResult(state, 3, true);
    expect(state.phase).toBe(PHASES.DISCUSSION);
  });

  it('triggers crewmate win when tasks reach total', () => {
    let state = createGame();
    state = { ...state, phase: PHASES.TASKS, tasksCompleted: 5 };
    const next = recordTaskResult(state, 1, true);
    expect(next.winner).toBe('crewmates');
    expect(next.phase).toBe(PHASES.RESULT);
  });
});

describe('resolveVote', () => {
  it('eliminates the player with the most votes', () => {
    const state = createGame(['Alice', 'Bob', 'Charlie']);
    // Force known roles for deterministic test
    const players = state.players.map((p, i) => ({
      ...p,
      role: i === 0 ? ROLES.SABOTEUR : ROLES.CREWMATE,
    }));
    let s = { ...state, players, phase: PHASES.VOTE };
    s = castVote(s, 2, 2); // Bob votes Bob (shouldn't happen but tests tally)
    s = castVote(s, 3, 2); // Charlie votes Bob
    const result = resolveVote(s);
    // Bob (id=2, crewmate) should be eliminated by majority
    expect(result.players[1].eliminated).toBe(true);
  });

  it('triggers crewmate win when saboteur is eliminated', () => {
    const state = createGame(['Alice', 'Bob', 'Charlie']);
    const saboteur = state.players.find(p => p.role === ROLES.SABOTEUR);
    let s = { ...state, phase: PHASES.VOTE };
    // Everyone votes for the saboteur
    state.players.forEach(p => {
      if (p.id !== saboteur.id) s = castVote(s, p.id, saboteur.id);
    });
    s = castVote(s, saboteur.id, saboteur.id); // saboteur self-vote
    // Use shield first so it doesn't block
    s = { ...s, saboteurShieldUsed: true };
    const result = resolveVote(s);
    expect(result.winner).toBe('crewmates');
  });
});

describe('getActivePlayers', () => {
  it('filters out eliminated players', () => {
    const state = createGame();
    const modified = {
      ...state,
      players: state.players.map((p, i) => i === 0 ? { ...p, eliminated: true } : p),
    };
    expect(getActivePlayers(modified)).toHaveLength(2);
  });
});
