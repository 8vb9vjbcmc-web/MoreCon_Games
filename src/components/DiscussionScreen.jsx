import { useState, useEffect } from 'react';

const DISCUSSION_SECONDS = 60;

/**
 * DiscussionScreen
 * Public screen (not handoff-gated) shown after every task round. Displays a
 * visible 60-second countdown while the crew talks out loud, plus the list
 * of still-active crew members. Voting can start any time — kids are never
 * trapped behind the timer.
 *
 * @param {object} props
 * @param {{id: number, name: string, eliminated: boolean}[]} props.players
 *   Full player roster (eliminated players are filtered out for display).
 * @param {number} props.round - Current round number.
 * @param {() => void} props.onVote - Called when "Start Voting" is tapped.
 */
export default function DiscussionScreen({ players, round, onVote }) {
  const [secondsLeft, setSecondsLeft] = useState(DISCUSSION_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const activePlayers = players.filter(p => !p.eliminated);

  return (
    <div style={styles.container}>
      <p style={styles.roundLabel}>Round {round}</p>
      <h1 style={styles.title}>Discussion Time</h1>
      <p style={styles.subtitle}>Talk it out — who's the Saboteur?</p>

      <div style={styles.timer}>{secondsLeft}s</div>

      <div style={styles.crewList}>
        {activePlayers.map(p => (
          <div key={p.id} style={styles.crewItem}>
            <span aria-hidden="true">⛑️</span> {p.name}
          </div>
        ))}
      </div>

      <button type="button" onClick={onVote} style={styles.button}>
        Start Voting
      </button>
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
    padding: '32px 24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textAlign: 'center',
  },
  roundLabel: {
    fontSize: 14,
    color: '#F5C800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    margin: '0 0 4px 0',
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: 15,
    color: '#D1D5DB',
    margin: '0 0 20px 0',
  },
  timer: {
    fontSize: 48,
    fontWeight: 800,
    color: '#F5C800',
    marginBottom: 24,
  },
  crewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: '100%',
    maxWidth: 280,
    marginBottom: 32,
  },
  crewItem: {
    minHeight: 48,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 16px',
    borderRadius: 10,
    backgroundColor: '#1C3A9E',
    fontSize: 16,
    fontWeight: 600,
  },
  button: {
    minHeight: 56,
    minWidth: 240,
    fontSize: 18,
    fontWeight: 700,
    border: 'none',
    borderRadius: 12,
    backgroundColor: '#F5C800',
    color: '#0E2A7E',
    padding: '0 24px',
    cursor: 'pointer',
  },
};
