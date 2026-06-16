import { useState, useRef, useEffect } from 'react';
import { ROLES } from '../game/engine.js';
import RebarTask from './RebarTask.jsx';
import PermitTask from './PermitTask.jsx';
import BlueprintTask from './BlueprintTask.jsx';

const MINI_GAMES = [RebarTask, PermitTask, BlueprintTask];
const CONFIRMATION_DELAY_MS = 1000;

/** Pick one mini-game component at random. */
function pickMiniGame() {
  return MINI_GAMES[Math.floor(Math.random() * MINI_GAMES.length)];
}

/**
 * TaskScreen
 * Private screen where the current player performs a randomly chosen
 * mini-task. This is the ONLY component that reads `role` to determine the
 * task outcome — the saboteur always secretly "fails" regardless of how
 * well they play the mini-game, while crewmates succeed only if they
 * actually finish it.
 *
 * @param {object} props
 * @param {{id: number, name: string, role: 'crewmate'|'saboteur'}} props.player
 *   The player whose turn it currently is.
 * @param {(success: boolean) => void} props.onComplete - Called after the
 *   brief "Task Complete!" confirmation with the final engine-bound result.
 */
export default function TaskScreen({ player, onComplete }) {
  const MiniGame = useRef(pickMiniGame()).current;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    if (!showConfirmation) return;
    const timer = setTimeout(() => {
      onComplete(resultRef.current);
    }, CONFIRMATION_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConfirmation]);

  const handleMiniDone = didFinish => {
    const success = player.role === ROLES.SABOTEUR ? false : didFinish;
    resultRef.current = success;
    setShowConfirmation(true);
  };

  return (
    <div style={styles.container}>
      <p style={styles.playerLabel}>{player.name}'s Task</p>

      {showConfirmation ? (
        <div style={styles.confirmation}>
          <div style={styles.checkIcon} aria-hidden="true">✅</div>
          <h2 style={styles.confirmationText}>Task Complete!</h2>
        </div>
      ) : (
        <MiniGame onComplete={handleMiniDone} />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    minWidth: 375,
    boxSizing: 'border-box',
    backgroundColor: '#0E2A7E',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  playerLabel: {
    fontSize: 14,
    color: '#F5C800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  confirmation: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  checkIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 800,
    color: '#F5C800',
    margin: 0,
  },
};
