import { useReducer } from 'react';
import {
  createGame,
  advanceSetup,
  recordTaskResult,
  castVote,
  resolveVote,
  getCurrentPlayer,
  getActivePlayers,
  PHASES,
} from './game/engine.js';
import SetupNamesScreen from './components/SetupNamesScreen.jsx';
import HandoffScreen from './components/HandoffScreen.jsx';
import RoleRevealScreen from './components/RoleRevealScreen.jsx';
import TaskScreen from './components/TaskScreen.jsx';
import DiscussionScreen from './components/DiscussionScreen.jsx';
import VoteScreen from './components/VoteScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';

const initialState = {
  game: null,
  ui: { handoffPending: true, voteCursor: 0, showVoteOutcome: false },
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      return {
        game: createGame(action.names),
        ui: { handoffPending: true, voteCursor: 0, showVoteOutcome: false },
      };
    }

    case 'REVEAL_DONE': {
      return {
        ...state,
        game: advanceSetup(state.game),
        ui: { ...state.ui, handoffPending: true },
      };
    }

    case 'TASK_DONE': {
      const currentPlayer = getCurrentPlayer(state.game);
      return {
        ...state,
        game: recordTaskResult(state.game, currentPlayer.id, action.success),
        ui: { ...state.ui, handoffPending: true },
      };
    }

    case 'GOTO_VOTE': {
      return {
        ...state,
        game: { ...state.game, phase: PHASES.VOTE },
        ui: { handoffPending: true, voteCursor: 0, showVoteOutcome: false },
      };
    }

    case 'CAST_VOTE': {
      const activePlayers = getActivePlayers(state.game);
      const voter = activePlayers[state.ui.voteCursor];
      const updatedGame = castVote(state.game, voter.id, action.targetId);
      const isLastVoter = state.ui.voteCursor >= activePlayers.length - 1;

      if (isLastVoter) {
        const resolvedGame = resolveVote(updatedGame);
        return {
          ...state,
          game: resolvedGame,
          ui: { ...state.ui, showVoteOutcome: true },
        };
      }

      return {
        ...state,
        game: updatedGame,
        ui: { ...state.ui, handoffPending: true, voteCursor: state.ui.voteCursor + 1 },
      };
    }

    case 'CONTINUE_AFTER_VOTE': {
      return {
        ...state,
        ui: { ...state.ui, showVoteOutcome: false, handoffPending: true },
      };
    }

    case 'CLEAR_HANDOFF': {
      return {
        ...state,
        ui: { ...state.ui, handoffPending: false },
      };
    }

    case 'NEW_GAME': {
      return {
        game: null,
        ui: { handoffPending: true, voteCursor: 0, showVoteOutcome: false },
      };
    }

    default:
      return state;
  }
}

/**
 * Derive the props for ResultScreen's `outcome` object from the current
 * engine state. Used both for the post-vote outcome beat (game.phase may
 * still be 'tasks' if the game continues) and for the final game-over phase.
 */
function deriveOutcome(game) {
  if (game.shieldMessage) {
    return { winner: null, eliminatedPlayer: null, shieldMessage: game.shieldMessage };
  }

  const lastEliminated = [...game.players].reverse().find(p => p.eliminated);

  return {
    winner: game.winner,
    eliminatedPlayer: lastEliminated
      ? { name: lastEliminated.name, role: lastEliminated.role }
      : null,
  };
}

/**
 * App
 * Root component for Site Crew Showdown. Owns the single useReducer game
 * state, routes between phase screens, and is one of only two modules
 * (alongside TaskScreen) permitted to import the game engine directly.
 */
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { game, ui } = state;

  if (game === null) {
    return (
      <SetupNamesScreen onStart={names => dispatch({ type: 'START_GAME', names })} />
    );
  }

  // Post-vote outcome beat takes priority over everything else, even if the
  // game continues afterward (phase may already be back to 'tasks').
  if (ui.showVoteOutcome) {
    const outcome = deriveOutcome(game);
    return (
      <ResultScreen
        outcome={outcome}
        onContinue={() => dispatch({ type: 'CONTINUE_AFTER_VOTE' })}
        onNewGame={() => dispatch({ type: 'NEW_GAME' })}
      />
    );
  }

  if (
    ui.handoffPending &&
    (game.phase === PHASES.SETUP || game.phase === PHASES.TASKS || game.phase === PHASES.VOTE)
  ) {
    let playerName;
    let actionLabel;

    if (game.phase === PHASES.SETUP) {
      playerName = game.players[game.setupPlayerIndex].name;
      actionLabel = 'see your secret role';
    } else if (game.phase === PHASES.TASKS) {
      playerName = getCurrentPlayer(game).name;
      actionLabel = 'do your task';
    } else {
      const activePlayers = getActivePlayers(game);
      playerName = activePlayers[ui.voteCursor].name;
      actionLabel = 'cast your vote';
    }

    return (
      <HandoffScreen
        playerName={playerName}
        actionLabel={actionLabel}
        onReady={() => dispatch({ type: 'CLEAR_HANDOFF' })}
      />
    );
  }

  if (game.phase === PHASES.SETUP) {
    const player = game.players[game.setupPlayerIndex];
    return (
      <RoleRevealScreen
        player={player}
        onDone={() => dispatch({ type: 'REVEAL_DONE' })}
      />
    );
  }

  if (game.phase === PHASES.TASKS) {
    const player = getCurrentPlayer(game);
    return (
      <TaskScreen
        player={player}
        onComplete={success => dispatch({ type: 'TASK_DONE', success })}
      />
    );
  }

  if (game.phase === PHASES.DISCUSSION) {
    return (
      <DiscussionScreen
        players={game.players}
        round={game.round}
        onVote={() => dispatch({ type: 'GOTO_VOTE' })}
      />
    );
  }

  if (game.phase === PHASES.VOTE) {
    const activePlayers = getActivePlayers(game);
    const voter = activePlayers[ui.voteCursor];
    const candidates = activePlayers
      .filter(p => p.id !== voter.id)
      .map(p => ({ id: p.id, name: p.name }));

    return (
      <VoteScreen
        voter={{ id: voter.id, name: voter.name }}
        candidates={candidates}
        onCast={targetId => dispatch({ type: 'CAST_VOTE', targetId })}
      />
    );
  }

  if (game.phase === PHASES.RESULT) {
    const outcome = deriveOutcome(game);
    return (
      <ResultScreen
        outcome={outcome}
        onContinue={() => dispatch({ type: 'CONTINUE_AFTER_VOTE' })}
        onNewGame={() => dispatch({ type: 'NEW_GAME' })}
      />
    );
  }

  return null;
}
