/**
 * game/engine.js
 * Pure game logic for Site Crew Showdown.
 * No React imports. Fully testable with Vitest.
 */

export const ROLES = {
  CREWMATE: 'crewmate',
  SABOTEUR: 'saboteur',
};

export const PHASES = {
  SETUP: 'setup',
  TASKS: 'tasks',
  DISCUSSION: 'discussion',
  VOTE: 'vote',
  RESULT: 'result',
};

export const TOTAL_TASKS = 6;
export const TASKS_PER_ROUND = 3; // one per player

/**
 * Create initial game state for 3 players.
 * @param {string[]} playerNames - Array of 3 player names
 * @returns {object} Initial game state
 */
export function createGame(playerNames = ['Player 1', 'Player 2', 'Player 3']) {
  if (playerNames.length !== 3) throw new Error('Site Crew Showdown requires exactly 3 players');

  // Randomly assign saboteur
  const saboteurIndex = Math.floor(Math.random() * 3);

  const players = playerNames.map((name, i) => ({
    id: i + 1,
    name,
    role: i === saboteurIndex ? ROLES.SABOTEUR : ROLES.CREWMATE,
    eliminated: false,
  }));

  return {
    players,
    phase: PHASES.SETUP,
    currentPlayerIndex: 0,
    setupPlayerIndex: 0,      // tracks setup role-reveal progress
    taskResults: {},           // { playerId: boolean }
    tasksCompleted: 0,
    totalTasks: TOTAL_TASKS,
    round: 1,
    saboteurShieldUsed: false,
    votes: {},                 // { voterId: targetId }
    winner: null,
  };
}

/**
 * Advance setup phase — move to next player's role reveal.
 * Returns updated state or transitions to task phase if all roles revealed.
 */
export function advanceSetup(state) {
  const nextIndex = state.setupPlayerIndex + 1;
  if (nextIndex >= state.players.length) {
    return { ...state, phase: PHASES.TASKS, currentPlayerIndex: 0, setupPlayerIndex: 0 };
  }
  return { ...state, setupPlayerIndex: nextIndex };
}

/**
 * Record a player's task result and advance to the next player.
 * @param {object} state
 * @param {number} playerId
 * @param {boolean} success - true for crewmate completing real task, false for saboteur faking it
 */
export function recordTaskResult(state, playerId, success) {
  const taskResults = { ...state.taskResults, [playerId]: success };
  const tasksCompleted = state.tasksCompleted + (success ? 1 : 0);

  // Check if crewmates completed all tasks
  if (tasksCompleted >= TOTAL_TASKS) {
    return { ...state, taskResults, tasksCompleted, phase: PHASES.RESULT, winner: 'crewmates' };
  }

  // Advance to next active player or move to discussion
  const activePlayers = state.players.filter(p => !p.eliminated);
  const currentPos = activePlayers.findIndex(p => p.id === playerId);
  const nextPos = currentPos + 1;

  if (nextPos >= activePlayers.length) {
    // All players have done a task — go to discussion
    return { ...state, taskResults, tasksCompleted, phase: PHASES.DISCUSSION, currentPlayerIndex: 0 };
  }

  const nextPlayer = activePlayers[nextPos];
  const nextIndex = state.players.findIndex(p => p.id === nextPlayer.id);
  return { ...state, taskResults, tasksCompleted, currentPlayerIndex: nextIndex };
}

/**
 * Record a vote from one player targeting another.
 */
export function castVote(state, voterId, targetId) {
  return { ...state, votes: { ...state.votes, [voterId]: targetId } };
}

/**
 * Tally votes and resolve elimination.
 * Returns updated state with result or next round.
 */
export function resolveVote(state) {
  const activePlayers = state.players.filter(p => !p.eliminated);
  const tally = {};

  // Count votes
  Object.entries(state.votes).forEach(([, targetId]) => {
    tally[targetId] = (tally[targetId] || 0) + 1;
  });

  // Find the player with the most votes
  let maxVotes = 0;
  let eliminatedId = null;
  Object.entries(tally).forEach(([id, count]) => {
    if (count > maxVotes) { maxVotes = count; eliminatedId = Number(id); }
  });

  if (!eliminatedId) {
    return { ...state, phase: PHASES.TASKS, votes: {}, round: state.round + 1, shieldMessage: undefined };
  }

  const eliminated = state.players.find(p => p.id === eliminatedId);

  // Check saboteur shield
  if (eliminated?.role === ROLES.SABOTEUR && !state.saboteurShieldUsed) {
    return {
      ...state,
      saboteurShieldUsed: true,
      votes: {},
      phase: PHASES.TASKS,
      round: state.round + 1,
      shieldMessage: 'The Saboteur used their shield! They survived the vote.',
    };
  }

  const players = state.players.map(p =>
    p.id === eliminatedId ? { ...p, eliminated: true } : p
  );

  // Check win conditions
  if (eliminated?.role === ROLES.SABOTEUR) {
    return { ...state, players, phase: PHASES.RESULT, winner: 'crewmates', votes: {}, shieldMessage: undefined };
  }

  // Crewmate eliminated — check if saboteur now has majority
  const remaining = players.filter(p => !p.eliminated);
  const saboteurAlive = remaining.some(p => p.role === ROLES.SABOTEUR);
  if (remaining.length <= 2 && saboteurAlive) {
    return { ...state, players, phase: PHASES.RESULT, winner: 'saboteur', votes: {}, shieldMessage: undefined };
  }

  // Continue game
  return {
    ...state,
    players,
    votes: {},
    phase: PHASES.TASKS,
    round: state.round + 1,
    currentPlayerIndex: 0,
    shieldMessage: undefined,
  };
}

/**
 * Get the current active player object.
 */
export function getCurrentPlayer(state) {
  return state.players[state.currentPlayerIndex];
}

/**
 * Get active (non-eliminated) players.
 */
export function getActivePlayers(state) {
  return state.players.filter(p => !p.eliminated);
}
