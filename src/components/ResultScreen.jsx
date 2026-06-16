/**
 * ResultScreen
 * Shared public reveal screen used both for the post-vote outcome beat
 * (mid-game) and for the final game-over banner.
 *
 * @param {object} props
 * @param {object} props.outcome
 * @param {null|'crewmates'|'saboteur'} props.outcome.winner - Set once the
 *   game has a final winner; null while the game continues.
 * @param {{name: string, role: 'crewmate'|'saboteur'}|null} props.outcome.eliminatedPlayer
 *   The most recently eliminated player, if any, for the "X was a ___" reveal.
 * @param {string} [props.outcome.shieldMessage] - Present when the
 *   saboteur's shield blocked an elimination this vote.
 * @param {() => void} props.onContinue - Called to dismiss a non-final
 *   outcome (shield save or crewmate elimination) and resume the game.
 * @param {() => void} props.onNewGame - Called from the final banner to
 *   reset and start a new game.
 */
export default function ResultScreen({ outcome, onContinue, onNewGame }) {
  const { winner, eliminatedPlayer, shieldMessage } = outcome || {};

  if (shieldMessage) {
    return (
      <div style={styles.container}>
        <div style={styles.icon} aria-hidden="true">🛡️</div>
        <h1 style={styles.title}>Shield Activated!</h1>
        <p style={styles.message}>{shieldMessage}</p>
        <button type="button" onClick={onContinue} style={styles.button}>
          Continue
        </button>
      </div>
    );
  }

  if (winner) {
    const crewmatesWon = winner === 'crewmates';
    return (
      <div
        style={{
          ...styles.container,
          backgroundColor: crewmatesWon ? '#0E2A7E' : '#DC2626',
        }}
      >
        <div style={styles.icon} aria-hidden="true">{crewmatesWon ? '🏆' : '⚠️'}</div>
        <h1 style={styles.bannerTitle}>
          {crewmatesWon ? 'Crewmates Win!' : 'Saboteur Wins!'}
        </h1>
        {eliminatedPlayer ? (
          <p style={styles.message}>
            {eliminatedPlayer.name} was the {eliminatedPlayer.role === 'saboteur' ? 'Saboteur' : 'Crewmate'}!
          </p>
        ) : null}
        <button
          type="button"
          onClick={onNewGame}
          style={{
            ...styles.button,
            backgroundColor: crewmatesWon ? '#F5C800' : '#FFFFFF',
            color: crewmatesWon ? '#0E2A7E' : '#DC2626',
          }}
        >
          Play Again
        </button>
      </div>
    );
  }

  // Crewmate eliminated, game continues — no winner yet.
  return (
    <div style={styles.container}>
      <div style={styles.icon} aria-hidden="true">⛑️</div>
      <h1 style={styles.title}>
        {eliminatedPlayer ? `${eliminatedPlayer.name} was a Crewmate!` : 'No one was eliminated'}
      </h1>
      <p style={styles.message}>The crew presses on.</p>
      <button type="button" onClick={onContinue} style={styles.button}>
        Continue
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
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    margin: '0 0 12px 0',
  },
  bannerTitle: {
    fontSize: 30,
    fontWeight: 800,
    margin: '0 0 12px 0',
  },
  message: {
    fontSize: 16,
    color: '#F5C800',
    margin: '0 0 32px 0',
    maxWidth: 280,
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
